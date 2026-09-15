import * as React from "react";

import {
  RADIUS_TOKEN,
  themeTokenNames,
  type ThemeMode,
} from "@components/theme-tokens";

const STORAGE_KEY = "push-design:themes";
/** The single-theme shape this panel used before themes were a list. */
const LEGACY_STORAGE_KEY = "push-design:theme-overrides";

/** Token overrides, kept separately for each mode. */
export type Overrides = Record<ThemeMode, Record<string, string>>;

export type Theme = {
  id: string;
  name: string;
  overrides: Overrides;
};

/** `null` means the default theme: `style.css` with nothing painted over it. */
export type ActiveThemeId = string | null;

type Stored = {
  mode: ThemeMode;
  activeId: ActiveThemeId;
  themes: Theme[];
};

const emptyOverrides = (): Overrides => ({ light: {}, dark: {} });

const hasOverrides = (overrides: Overrides) =>
  Object.keys(overrides.light).length > 0 ||
  Object.keys(overrides.dark).length > 0;

const newId = () => Math.random().toString(36).slice(2, 10);

/**
 * Reads a mode's authored token values straight out of the stylesheet. The
 * `.dark` block is scoped to a class, so an off-screen probe element wearing
 * that class reports the dark values even while the page is in light mode.
 */
function readBaseline(mode: ThemeMode): Record<string, string> {
  const probe = document.createElement("div");
  probe.style.display = "none";
  if (mode === "dark") probe.className = "dark";
  document.body.append(probe);

  const computed = getComputedStyle(probe);
  const values = Object.fromEntries(
    themeTokenNames.map((name) => [
      name,
      computed.getPropertyValue(name).trim(),
    ]),
  );

  probe.remove();
  return values;
}

function loadStored(): Stored {
  const fallback: Stored = { mode: "light", activeId: null, themes: [] };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored>;
      const themes = (parsed.themes ?? []).map((theme) => ({
        id: theme.id || newId(),
        name: theme.name || "Untitled",
        overrides: { ...emptyOverrides(), ...theme.overrides },
      }));
      return {
        mode: parsed.mode === "dark" ? "dark" : "light",
        themes,
        activeId: themes.some((theme) => theme.id === parsed.activeId)
          ? (parsed.activeId ?? null)
          : null,
      };
    }

    // Carry over the one theme the earlier version could hold.
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return fallback;

    const parsed = JSON.parse(legacy) as {
      mode?: ThemeMode;
      custom?: boolean;
      overrides?: Overrides;
    };
    const overrides = { ...emptyOverrides(), ...parsed.overrides };
    if (!hasOverrides(overrides)) return fallback;

    const theme: Theme = { id: newId(), name: "Custom", overrides };
    return {
      mode: parsed.mode === "dark" ? "dark" : "light",
      themes: [theme],
      activeId: parsed.custom === false ? null : theme.id,
    };
  } catch {
    return fallback;
  }
}

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  themes: Theme[];
  activeId: ActiveThemeId;
  activeTheme: Theme | null;
  selectTheme: (id: ActiveThemeId) => void;
  /** Saves a new theme, seeded from whatever is on screen. Returns its id. */
  createTheme: (name?: string) => string;
  duplicateTheme: (id: string) => string;
  renameTheme: (id: string, name: string) => void;
  deleteTheme: (id: string) => void;
  /** Drops the active theme's edits, leaving it empty but still selected. */
  revertTheme: () => void;
  /** The value on screen right now, for the active mode and theme. */
  valueOf: (token: string) => string;
  /** Edits the active theme, creating one first if the default is showing. */
  setToken: (token: string, value: string) => void;
  isOverridden: (token: string) => boolean;
  css: () => string;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }
  return context;
}

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [baselines] = React.useState(() => ({
    light: readBaseline("light"),
    dark: readBaseline("dark"),
  }));
  const [stored] = React.useState(loadStored);
  const [mode, setMode] = React.useState<ThemeMode>(stored.mode);
  const [themes, setThemes] = React.useState<Theme[]>(stored.themes);
  const [activeId, setActiveId] = React.useState<ActiveThemeId>(
    stored.activeId,
  );

  const activeTheme = themes.find((theme) => theme.id === activeId) ?? null;

  // Paint the active theme onto :root; the default theme paints nothing, so
  // the stylesheet shows through untouched.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");

    for (const token of themeTokenNames) {
      const value = activeTheme?.overrides[mode][token];
      if (value) root.style.setProperty(token, value);
      else root.style.removeProperty(token);
    }
  }, [activeTheme, mode]);

  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ mode, activeId, themes } satisfies Stored),
    );
  }, [activeId, mode, themes]);

  const value = React.useMemo<ThemeContextValue>(() => {
    const editActive = (edit: (overrides: Overrides) => Overrides) =>
      setThemes((current) =>
        current.map((theme) =>
          theme.id === activeId
            ? { ...theme, overrides: edit(theme.overrides) }
            : theme,
        ),
      );

    const nextName = () => {
      const taken = new Set(themes.map((theme) => theme.name));
      let index = themes.length + 1;
      while (taken.has(`Theme ${index}`)) index += 1;
      return `Theme ${index}`;
    };

    const addTheme = (name: string, overrides: Overrides) => {
      const theme: Theme = { id: newId(), name, overrides };
      setThemes((current) => [...current, theme]);
      setActiveId(theme.id);
      return theme.id;
    };

    return {
      mode,
      setMode,
      themes,
      activeId,
      activeTheme,
      selectTheme: setActiveId,

      createTheme: (name) =>
        addTheme(name?.trim() || nextName(), {
          light: { ...(activeTheme?.overrides.light ?? {}) },
          dark: { ...(activeTheme?.overrides.dark ?? {}) },
        }),

      duplicateTheme: (id) => {
        const source = themes.find((theme) => theme.id === id);
        if (!source) return id;
        return addTheme(`${source.name} copy`, {
          light: { ...source.overrides.light },
          dark: { ...source.overrides.dark },
        });
      },

      renameTheme: (id, name) =>
        setThemes((current) =>
          current.map((theme) =>
            theme.id === id
              ? { ...theme, name: name.trim() || theme.name }
              : theme,
          ),
        ),

      deleteTheme: (id) => {
        setThemes((current) => current.filter((theme) => theme.id !== id));
        setActiveId((current) => (current === id ? null : current));
      },

      revertTheme: () => editActive(emptyOverrides),

      // Mirror whatever the page is showing, so the rows never disagree.
      valueOf: (token) =>
        activeTheme?.overrides[mode][token] || baselines[mode][token] || "",

      isOverridden: (token) => Boolean(activeTheme?.overrides[mode][token]),

      setToken: (token, next) => {
        // Editing the default theme starts a new one rather than changing
        // the stylesheet out from under every other theme.
        if (!activeTheme) {
          addTheme(nextName(), {
            ...emptyOverrides(),
            [mode]: { [token]: next },
          });
          return;
        }
        editActive((overrides) => ({
          ...overrides,
          [mode]: { ...overrides[mode], [token]: next },
        }));
      },

      css: () => {
        const block = (target: ThemeMode) =>
          themeTokenNames
            .filter((token) => target === "light" || token !== RADIUS_TOKEN)
            .map(
              (token) =>
                `  ${token}: ${activeTheme?.overrides[target][token] || baselines[target][token]};`,
            )
            .join("\n");

        const title = activeTheme ? `/* ${activeTheme.name} */\n` : "";
        return `${title}:root {\n${block("light")}\n}\n\n.dark {\n${block("dark")}\n}\n`;
      },
    };
  }, [activeId, activeTheme, baselines, mode, themes]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
