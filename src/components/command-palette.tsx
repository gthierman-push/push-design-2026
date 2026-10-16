import * as React from "react";
import { useNavigate } from "react-router";
import { BuildingIcon, MapPinIcon, PlusIcon, SearchIcon } from "@components/icons";

import type { NavItem } from "@layouts/app-nav";
import { footerNavigation, pages } from "@layouts/app-nav";
import { sections as settingsSections } from "@layouts/settings-nav";
import { EmployeeAvatar, rosterFor } from "@features/employees";
import { AccountAvatar } from "@components/account-switcher";
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
    items: [...pages, ...footerNavigation],
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

/**
 * Which rows a query keeps, and how they rank.
 *
 * cmdk scores subsequences by default, so "alici" turned up Cassandra Liu off
 * the stray a-l-i-c-i scattered through her row. A list with the whole roster
 * in it cannot carry that, so a row has to actually contain every word of the
 * query; where each word lands is what sorts the survivors. Order does not
 * matter either -- "reyes alicia" finds her the same as "alicia reyes".
 */
function score(value: string, search: string, keywords?: string[]) {
  const haystack = [value, ...(keywords ?? [])].join(" ").toLowerCase();
  /* Hyphens start a word too, so an id reads the way the name does. */
  const words = haystack.split(/[\s-]+/);
  const query = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (query.length === 0) return 1;

  let total = 0;
  for (const word of query) {
    if (!haystack.includes(word)) return 0;

    total += haystack.startsWith(word)
      ? 1
      : words.some((item) => item.startsWith(word))
        ? 0.75
        : 0.5;
  }

  /* The mean, so a two-word query that matches both halves well beats one
     that only grazes them. */
  return total / query.length;
}

export function CommandPalette({
  trigger,
}: {
  /**
   * What opens the palette. Defaults to a sidebar row; a layout that keeps
   * search somewhere else — the icon rail, say — hands in its own.
   */
  trigger?: (open: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const { accounts, account: active, location, select } = useActiveAccount();

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

  /**
   * Everyone the open company employs, whichever location they work at and
   * whatever their status -- the palette is how you find a person you only
   * half remember, so narrowing it to the location the app happens to be
   * pointed at would hide most of the people worth finding.
   */
  const people = React.useMemo(() => rosterFor(active, null).all, [active]);

  const locationNames = React.useMemo(
    () => new Map(active.locations.map((item) => [item.id, item.name])),
    [active],
  );

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
     * The roster, search-only like the groups below it: a list this long has
     * no business in the resting palette.
     */
    {
      label: "Employees",
      searchOnly: true,
      rows: people.map((employee) => ({
        /* The id rides along because two people can share a name, and cmdk
           keys every row on its value. */
        value: `${employee.name} employee ${employee.id}`,
        title: employee.name,
        visual: <EmployeeAvatar employee={employee} />,
        detail: `${employee.position} · ${locationNames.get(employee.locationId) ?? "—"}`,
        keywords: [
          employee.position,
          employee.department,
          employee.status,
          locationNames.get(employee.locationId) ?? "",
        ],
        /* Straight to the person, the way a roster row goes. The profile
           reads the whole company's roster, so someone at another location
           opens without the app having to follow them there. */
        select: () => navigate(`/employees/${employee.id}`),
      })),
    },
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
      {trigger ? (
        trigger(() => setOpen(true))
      ) : (
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
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search for a page or a person to jump to, or a company or location to switch to"
      >
        <Command filter={score}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search pages, people, companies..."
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
