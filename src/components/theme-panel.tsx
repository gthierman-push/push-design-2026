import * as React from "react";
import { CheckIcon, CopyIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";

import { cn } from "cn";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { Slider } from "@components/ui/slider";
import {
  RADIUS_TOKEN,
  colorGroups,
  formatColor,
  hexToOklch,
  oklchToHex,
  parseColor,
  themeTokenNames,
  type ThemeMode,
} from "@components/theme-tokens";

const STORAGE_KEY = "push-design:theme-overrides";

type Overrides = Record<ThemeMode, Record<string, string>>;

const emptyOverrides = (): Overrides => ({ light: {}, dark: {} });

const hasOverrides = (overrides: Overrides) =>
  Object.keys(overrides.light).length > 0 ||
  Object.keys(overrides.dark).length > 0;

type Stored = { mode: ThemeMode; overrides: Overrides; custom: boolean };

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

function loadStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    const overrides = { ...emptyOverrides(), ...parsed.overrides };
    return {
      mode: parsed.mode === "dark" ? "dark" : "light",
      overrides,
      // Themes saved before the switch existed were always applied.
      custom: parsed.custom ?? hasOverrides(overrides),
    };
  } catch {
    return null;
  }
}

type ThemePanelContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** False shows style.css untouched; true applies the edited tokens. */
  custom: boolean;
  setCustom: (custom: boolean) => void;
  /** True once anything has been edited, whichever theme is showing. */
  edited: boolean;
  /** The value on screen right now for the active mode and theme. */
  valueOf: (token: string) => string;
  setToken: (token: string, value: string) => void;
  isOverridden: (token: string) => boolean;
  reset: () => void;
  css: () => string;
};

const ThemePanelContext = React.createContext<ThemePanelContextValue | null>(
  null,
);

export function useThemePanel() {
  const context = React.useContext(ThemePanelContext);
  if (!context) {
    throw new Error("useThemePanel must be used within a ThemePanelProvider.");
  }
  return context;
}

export function ThemePanelProvider({ children }: React.PropsWithChildren) {
  const [baselines] = React.useState(() => ({
    light: readBaseline("light"),
    dark: readBaseline("dark"),
  }));
  const [stored] = React.useState(loadStored);
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<ThemeMode>(stored?.mode ?? "light");
  const [overrides, setOverrides] = React.useState<Overrides>(
    stored?.overrides ?? emptyOverrides(),
  );
  const [custom, setCustom] = React.useState(stored?.custom ?? false);

  // Paint the active mode's overrides onto :root; everything else falls back
  // to the stylesheet.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");

    for (const token of themeTokenNames) {
      const value = custom ? overrides[mode][token] : undefined;
      if (value) root.style.setProperty(token, value);
      else root.style.removeProperty(token);
    }
  }, [custom, mode, overrides]);

  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ mode, overrides, custom } satisfies Stored),
    );
  }, [custom, mode, overrides]);

  // A bare "t" toggles the panel, so it stays out of the way while the user
  // is typing anywhere -- a field, a menu, any editable surface.
  React.useEffect(() => {
    function isTyping(target: EventTarget | null) {
      const element = target as HTMLElement | null;
      if (!element?.tagName) return false;
      return (
        element.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target)) return;

      if (event.code === "KeyT") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = React.useMemo<ThemePanelContextValue>(() => {
    // Mirror whatever the page is showing, so the rows never disagree with it.
    const valueOf = (token: string) =>
      (custom ? overrides[mode][token] : "") || baselines[mode][token] || "";

    return {
      open,
      setOpen,
      mode,
      setMode,
      custom,
      setCustom,
      edited: hasOverrides(overrides),
      valueOf,
      isOverridden: (token) => custom && Boolean(overrides[mode][token]),
      // Editing is what the custom theme is for, so an edit switches to it.
      setToken: (token, next) => {
        setCustom(true);
        setOverrides((current) => ({
          ...current,
          [mode]: { ...current[mode], [token]: next },
        }));
      },
      reset: () => {
        setOverrides(emptyOverrides());
        setCustom(false);
      },
      css: () => {
        const block = (target: ThemeMode) =>
          themeTokenNames
            .filter((token) => target === "light" || token !== RADIUS_TOKEN)
            .map(
              (token) =>
                `  ${token}: ${(custom ? overrides[target][token] : "") || baselines[target][token]};`,
            )
            .join("\n");

        return `:root {\n${block("light")}\n}\n\n.dark {\n${block("dark")}\n}\n`;
      },
    };
  }, [baselines, custom, mode, open, overrides]);

  return (
    <ThemePanelContext.Provider value={value}>
      {children}
      <ThemePanel />
    </ThemePanelContext.Provider>
  );
}

function ColorRow({ token, label }: { token: string; label: string }) {
  const { valueOf, setToken, isOverridden } = useThemePanel();
  const value = valueOf(token);
  const color = parseColor(value);
  const hex = color ? oklchToHex(color) : "#000000";

  const [draft, setDraft] = React.useState(hex);
  React.useEffect(() => setDraft(hex), [hex]);

  const commit = (nextHex: string) => {
    setToken(token, formatColor(hexToOklch(nextHex, color?.alpha ?? 1)));
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "border-border relative size-6 shrink-0 overflow-hidden rounded-md border",
          // Chequerboard so partly transparent tokens read as transparent.
          "bg-[repeating-conic-gradient(var(--color-muted-foreground)_0%_25%,transparent_0%_50%)] bg-[length:8px_8px]",
        )}
      >
        <span className="absolute inset-0" style={{ background: value }} />
        <input
          type="color"
          value={hex}
          aria-label={label}
          onChange={(event) => commit(event.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </span>

      <span
        className="min-w-0 flex-1 truncate font-mono text-[11px]"
        title={label}
      >
        {token}
        {isOverridden(token) ? (
          <span className="text-muted-foreground"> •</span>
        ) : null}
      </span>

      <Input
        value={draft}
        spellCheck={false}
        aria-label={`${label} hex`}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (/^#[0-9a-f]{6}$/i.test(next)) commit(next);
        }}
        onBlur={() => setDraft(hex)}
        className="h-7 w-[4.75rem] shrink-0 px-2 font-mono text-[11px]"
      />
    </div>
  );
}

/** Flips between the stylesheet's own theme and the edited one. */
function ThemeSourceSwitch() {
  const { custom, setCustom, edited } = useThemePanel();

  const options = [
    { value: false, label: "Default", hint: "style.css as authored" },
    { value: true, label: "Custom", hint: "your edited tokens" },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="group"
        aria-label="Theme source"
        className="bg-muted flex gap-0.5 rounded-md p-0.5"
      >
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={custom === option.value}
            onClick={() => setCustom(option.value)}
            className={cn(
              "flex-1 rounded-sm px-2 py-1 text-xs transition-colors",
              custom === option.value
                ? "bg-background text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
            {option.value && edited && !custom ? (
              <span className="text-muted-foreground"> •</span>
            ) : null}
          </button>
        ))}
      </div>
      <span className="text-muted-foreground text-[11px]">
        Showing {custom ? options[1].hint : options[0].hint}
        {!custom && edited ? " — edits are kept" : ""}
      </span>
    </div>
  );
}

function RadiusRow() {
  const { valueOf, setToken } = useThemePanel();
  const radius = Number.parseFloat(valueOf(RADIUS_TOKEN)) || 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs">Radius</span>
        <span className="text-muted-foreground font-mono text-[11px]">
          {radius.toFixed(2)}rem
        </span>
      </div>
      <Slider
        value={[radius]}
        min={0}
        max={2}
        step={0.05}
        onValueChange={(next) => {
          const [value] = Array.isArray(next) ? next : [next];
          setToken(RADIUS_TOKEN, `${value}rem`);
        }}
      />
    </div>
  );
}

function ThemePanel() {
  const { open, setOpen, mode, setMode, reset, css } = useThemePanel();
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(css());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (!open) return null;

  return (
    <aside
      data-slot="theme-panel"
      aria-label="Theme editor"
      className="bg-background fixed inset-y-0 right-0 z-50 flex w-[19rem] flex-col border-l shadow-lg"
    >
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
        <span className="flex-1 text-sm font-medium">Theme</span>

        <div className="flex items-center gap-0.5">
          <Button
            variant={mode === "light" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Edit light mode"
            aria-pressed={mode === "light"}
            onClick={() => setMode("light")}
          >
            <SunIcon />
          </Button>
          <Button
            variant={mode === "dark" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Edit dark mode"
            aria-pressed={mode === "dark"}
            onClick={() => setMode("dark")}
          >
            <MoonIcon />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-4 self-center!" />

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close theme editor"
          onClick={() => setOpen(false)}
        >
          <XIcon />
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-3">
        <ThemeSourceSwitch />
        <RadiusRow />

        {colorGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              {group.label}
            </span>
            {group.tokens.map((token) => (
              <ColorRow
                key={token.name}
                token={token.name}
                label={token.label}
              />
            ))}
          </div>
        ))}
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t p-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={copy}>
          {copied ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {copied ? "Copied" : "Copy CSS"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          title="Discard every edit and go back to the default theme"
        >
          Reset
        </Button>
      </footer>
    </aside>
  );
}
