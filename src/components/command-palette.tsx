import * as React from "react";
import { useNavigate } from "react-router";
import { BuildingIcon, MapPinIcon, PlusIcon, SearchIcon } from "lucide-react";

import type { NavItem } from "@layouts/app-nav";
import { footerNavigation, home, sections } from "@layouts/app-nav";
import { sections as settingsSections } from "@layouts/settings-nav";
import { AccountAvatar } from "@components/account-switcher";
import { accounts } from "@components/accounts";
import { useActiveAccount } from "@components/active-account";
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

/** Places to go. Add a group here as one is needed. */
const navGroups: PaletteGroup[] = [
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

/** One row of the palette, whether it goes somewhere or changes something. */
type PaletteRow = {
  /** Unique across the palette: cmdk keys rows on it and matches on it. */
  value: string;
  title: string;
  /** The leading glyph: a page's icon, a company's initials. */
  visual: React.ReactNode;
  /** Dimmed, beside the title: the company and region a location sits in. */
  detail?: string;
  /** What the app is already pointed at, so the row carries a check. */
  checked?: boolean;
  /** Matched alongside the value, and never shown. */
  keywords?: string[];
  select: () => void;
};

type RowGroup = { label: string; rows: PaletteRow[]; searchOnly?: boolean };

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const { account: active, location, select } = useActiveAccount();

  /** A fresh palette every time, however it was closed. */
  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

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

  const groups: RowGroup[] = [
    ...navGroups.map((group) => ({
      label: group.label,
      searchOnly: group.searchOnly,
      rows: group.items.map((item) => ({
        value: `${item.title} ${group.label}`,
        title: item.title,
        visual: <item.icon />,
        keywords: item.keywords,
        select: () => navigate(item.url),
      })),
    })),
    /**
     * The companies and locations the switcher holds. Both are search-only,
     * like Settings: the resting palette stays about the handful of things
     * done most, and the placeholder says the companies are in here.
     */
    {
      label: "Companies",
      searchOnly: true,
      rows: accounts.map((account) => ({
        value: `${account.name} company`,
        title: account.name,
        visual: <AccountAvatar account={account} size="sm" />,
        checked: account.id === active.id,
        keywords: ["switch", account.initials],
        select: () => select(account),
      })),
    },
    {
      label: "Locations",
      searchOnly: true,
      rows: [
        /* The company-wide view, the way the switcher opens with it. */
        {
          value: `All locations ${active.name}`,
          title: "All locations",
          visual: <BuildingIcon />,
          detail: active.name,
          checked: location === null,
          keywords: ["switch", "company", "every"],
          select: () => select(active),
        },
        /* Every company's locations, not just the open one's, so typing a
           city switches the company and the location in one keystroke. */
        ...accounts.flatMap((account) =>
          account.locations.map((item) => ({
            value: `${item.name} ${account.name} location`,
            title: item.name,
            visual: <MapPinIcon />,
            /* Company first, region second, on every row: the list mixes
               companies, so a row that left its company out read as though
               it belonged to whichever one was open. The company also
               survives the truncation, since the region is what gets cut. */
            detail: `${account.name} · ${item.region}`,
            checked: account.id === active.id && item.id === location?.id,
            keywords: ["switch", item.region],
            select: () => select(account, item),
          })),
        ),
      ],
    },
  ];

  const visibleGroups = search.trim()
    ? groups
    : groups.filter((group) => !group.searchOnly);

  return (
    <>
      <SidebarMenuButton
        tooltip="Search"
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
        title="Search"
        description="Search for a page to jump to, or a company or location to switch to"
      >
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search pages, companies, locations..."
            hint={
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            }
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {visibleGroups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.rows.map((row) => (
                  <CommandItem
                    key={row.value}
                    value={row.value}
                    keywords={row.keywords}
                    data-checked={row.checked}
                    onSelect={() => {
                      setOpen(false);
                      row.select();
                    }}
                  >
                    {row.visual}
                    <span>{row.title}</span>
                    {row.detail ? (
                      <span className="text-muted-foreground truncate text-xs">
                        {row.detail}
                      </span>
                    ) : null}
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
