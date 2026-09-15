import * as React from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  CopyPlusIcon,
  MoonIcon,
  PencilIcon,
  PlusIcon,
  SunIcon,
  Trash2Icon,
  Undo2Icon,
  XIcon,
} from "lucide-react";

import { cn } from "cn";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { Slider } from "@components/ui/slider";
import { useTheme } from "@components/theme-provider";
import {
  RADIUS_TOKEN,
  colorGroups,
  formatColor,
  hexToOklch,
  oklchToHex,
  parseColor,
} from "@components/theme-tokens";

/** Picks the theme to show and edit, and manages the saved list. */
function ThemePicker() {
  const {
    themes,
    activeId,
    activeTheme,
    selectTheme,
    createTheme,
    duplicateTheme,
    renameTheme,
    deleteTheme,
  } = useTheme();

  const [renaming, setRenaming] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  const startRename = () => {
    if (!activeTheme) return;
    setDraft(activeTheme.name);
    setRenaming(true);
  };

  const commitRename = () => {
    if (activeTheme) renameTheme(activeTheme.id, draft);
    setRenaming(false);
  };

  if (renaming) {
    return (
      <Input
        autoFocus
        value={draft}
        aria-label="Theme name"
        className="h-8"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commitRename}
        onKeyDown={(event) => {
          // The panel closes on Escape, so keep this one local.
          event.stopPropagation();
          if (event.key === "Enter") commitRename();
          if (event.key === "Escape") setRenaming(false);
        }}
      />
    );
  }

  return (
    // Not modal: the point of the panel is to keep clicking around the app
    // while it is open, and a modal menu locks scroll and blocks every
    // pointer event outside itself.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between font-normal"
          />
        }
      >
        <span className="truncate">{activeTheme?.name ?? "Default"}</span>
        <ChevronsUpDownIcon className="text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {/* Menu labels have to sit inside a group -- Base UI reads the group
            context to wire a label to its items. */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Themes</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => selectTheme(null)}>
            <CheckIcon className={cn(activeId !== null && "invisible")} />
            <span className="flex-1 truncate">Default</span>
            <span className="text-muted-foreground font-mono text-[11px]">
              style.css
            </span>
          </DropdownMenuItem>

          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => selectTheme(theme.id)}
            >
              <CheckIcon className={cn(activeId !== theme.id && "invisible")} />
              <span className="flex-1 truncate">{theme.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => createTheme()}>
          <PlusIcon />
          New theme
        </DropdownMenuItem>

        {activeTheme ? (
          <>
            <DropdownMenuItem onClick={() => duplicateTheme(activeTheme.id)}>
              <CopyPlusIcon />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={startRename}>
              <PencilIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteTheme(activeTheme.id)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ColorRow({ token, label }: { token: string; label: string }) {
  const { valueOf, setToken, isOverridden } = useTheme();
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

function RadiusRow() {
  const { valueOf, setToken } = useTheme();
  const radius = Number.parseFloat(valueOf(RADIUS_TOKEN)) || 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px]">{RADIUS_TOKEN}</span>
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

export function ThemePanel() {
  const { mode, setMode, activeTheme, revertTheme, css } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

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

      <div className="shrink-0 border-b p-3">
        <ThemePicker />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-3">
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
          disabled={!activeTheme}
          onClick={revertTheme}
          title="Clear this theme's edits, back to the style.css values"
        >
          <Undo2Icon data-icon="inline-start" />
          Revert
        </Button>
      </footer>
    </aside>
  );
}
