import type { LucideIcon } from "lucide-react";

import {
  BadgeDollarSignIcon,
  BriefcaseBusinessIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  CalendarRangeIcon,
  ChartPieIcon,
  CircleHelpIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  ClockIcon,
  FlagIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  MegaphoneIcon,
  MessagesSquareIcon,
  NotebookTextIcon,
  PalmtreeIcon,
  SettingsIcon,
  TableIcon,
  TrendingUpIcon,
  TrophyIcon,
  UserPlusIcon,
  UserSearchIcon,
  UsersIcon,
} from "lucide-react";

/**
 * The app nav, kept beside the layout so the command palette and the sidebar
 * read the same list of pages.
 */
export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  notify?: boolean;
  settingsUrl?: string;
};

export type NavSection = {
  label: string;
  /** Stands in for the section where only an icon fits, as on the rail. */
  icon: LucideIcon;
  /** The rail's label, for sections whose full name is too long to read there. */
  short?: string;
  items: NavItem[];
};

/** A nav row: either a page on its own, or a section that unfolds into pages. */
export type NavEntry = NavItem | NavSection;

/** Which of the two a row is — a section is the one holding pages. */
export function isSection(entry: NavEntry): entry is NavSection {
  return "items" in entry;
}

/**
 * The nav, read top to bottom. A page sitting at this level is one a manager
 * opens all day and should not have to unfold a section to reach; everything
 * else is grouped, and the two kinds of row are interleaved in whatever order
 * reads best rather than pages-then-sections.
 */
export const nav: NavEntry[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboardIcon },
  { title: "Scheduler", url: "/scheduler", icon: CalendarRangeIcon },
  { title: "Clocks", url: "/clocks", icon: ClockIcon, notify: true },
  { title: "Shifts", url: "/shifts", icon: ClipboardListIcon, notify: true },
  {
    label: "Workforce",
    icon: UsersIcon,
    items: [
      {
        title: "People",
        url: "/employees",
        icon: UsersIcon,
        settingsUrl: "/settings/employee-settings",
      },
      { title: "Milestones", url: "/milestones", icon: FlagIcon },
      { title: "Performance", url: "/performance", icon: TrophyIcon },
      { title: "Surveys", url: "/surveys", icon: ClipboardCheckIcon },
      { title: "Tasks", url: "/tasks", icon: ListChecksIcon },
    ],
  },
  { title: "Time Off", url: "/time-off", icon: PalmtreeIcon },
  {
    label: "Hiring",
    icon: UserPlusIcon,
    items: [
      { title: "Jobs", url: "/jobs", icon: BriefcaseBusinessIcon },
      { title: "Candidates", url: "/candidates", icon: UserSearchIcon },
      { title: "Interviews", url: "/interviews", icon: CalendarCheckIcon },
    ],
  },
  {
    label: "Communication",
    icon: MessagesSquareIcon,
    short: "Comms",
    items: [
      { title: "Chat", url: "/chat", icon: MessagesSquareIcon },
      { title: "Message Board", url: "/message-board", icon: MegaphoneIcon },
    ],
  },
  {
    label: "Payroll",
    icon: BadgeDollarSignIcon,
    items: [
      { title: "Payroll", url: "/payroll", icon: BadgeDollarSignIcon },
      { title: "Timesheets", url: "/timesheets", icon: TableIcon },
    ],
  },
  {
    label: "Reporting",
    icon: ChartPieIcon,
    items: [
      { title: "Sales", url: "/sales", icon: TrendingUpIcon },
      { title: "Reports", url: "/reports", icon: BriefcaseIcon },
      { title: "Logbook", url: "/logbook", icon: NotebookTextIcon },
      {
        title: "Business Intelligence",
        url: "/business-intelligence",
        icon: ChartPieIcon,
      },
    ],
  },
];

/** The sections alone, for the one-open-at-a-time bookkeeping. */
export const sections: NavSection[] = nav.filter(isSection);

/** Every page the nav reaches, flattened, the way the nav reads. */
export const pages: NavItem[] = nav.flatMap((entry) =>
  isSection(entry) ? entry.items : entry,
);

export const footerNavigation: NavItem[] = [
  { title: "Help", url: "/help", icon: CircleHelpIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

/**
 * Which page the app is on, for a path that may sit under one: an employee's
 * profile is still the People page as far as the nav and the breadcrumb are
 * concerned. Dashboard is matched exactly -- every path sits under "/".
 */
export function pageFor(pathname: string): NavItem | undefined {
  return pages.find(
    (item) =>
      item.url === pathname ||
      (item.url !== "/" && pathname.startsWith(`${item.url}/`)),
  );
}
