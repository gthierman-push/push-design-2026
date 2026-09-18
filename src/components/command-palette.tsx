import * as React from "react";
import { useNavigate } from "react-router";
import { PlusIcon, SearchIcon } from "lucide-react";

import type { NavItem } from "@layouts/app-nav";
import { footerNavigation, home, sections } from "@layouts/app-nav";
import { sections as settingsSections } from "@layouts/settings-nav";
import { SidebarMenuButton } from "@components/ui/sidebar";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import { Kbd, KbdGroup } from "@components/ui/kbd";

/** A page, plus anything else worth matching a query against. */
type PaletteItem = NavItem & { keywords?: string[] };

type PaletteGroup = {
  label: string;
  items: PaletteItem[];
  /** Kept out of the resting list: it only shows up once there is a query. */
  searchOnly?: boolean;
};

/** Things to do, ahead of places to go. Add a group here as one is needed. */
const groups: PaletteGroup[] = [
  {
    label: "Actions",
    items: [
      { title: "Add employee", url: "/employees", icon: PlusIcon },
      { title: "Run payroll", url: "/payroll", icon: PlusIcon },
    ],
  },
  {
    /** Every page the sidebar holds, read top to bottom the way it reads. */
    label: "Pages",
    items: [
      home,
      ...sections.flatMap((section) => section.items),
      ...footerNavigation,
    ],
  },
  {
    /**
     * The settings nav, flattened. Each page carries its section as a keyword,
     * so "payroll tax" finds Tax Setup even though the row only says so much.
     */
    label: "Settings",
    searchOnly: true,
    items: settingsSections.flatMap((section) =>
      section.items.map((item) => ({ ...item, keywords: [section.label] })),
    ),
  },
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  /** A fresh palette every time, however it was closed. */
  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const visibleGroups = search.trim()
    ? groups
    : groups.filter((group) => !group.searchOnly);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <SidebarMenuButton
        tooltip="Search pages"
        className="text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        <span>Search</span>
        <KbdGroup className="ml-auto">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </SidebarMenuButton>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search pages"
        description="Search for a page to jump to"
      >
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search pages..."
            hint={
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            }
          />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            {visibleGroups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.url}
                    value={`${item.title} ${group.label}`}
                    keywords={item.keywords}
                    onSelect={() => {
                      setOpen(false);
                      navigate(item.url);
                    }}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
