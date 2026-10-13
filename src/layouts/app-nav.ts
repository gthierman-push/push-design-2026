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

/** The page the logo and the breadcrumb fall back to. */
export const home: NavItem = {
  title: "Dashboard",
  url: "/",
  icon: LayoutDashboardIcon,
};

export const sections: NavSection[] = [
  {
    label: "Scheduling",
    icon: CalendarRangeIcon,
    items: [
      { title: "Scheduler", url: "/scheduler", icon: CalendarRangeIcon },
      { title: "Clocks", url: "/clocks", icon: ClockIcon, notify: true },
      {
        title: "Shifts",
        url: "/shifts",
        icon: ClipboardListIcon,
        notify: true,
      },
    ],
  },
  {
    label: "Workforce Management",
    icon: UsersIcon,
    short: "Workforce",
    items: [
      {
        title: "Employees",
        url: "/employees",
        icon: UsersIcon,
        settingsUrl: "/settings/employee-settings",
      },
      { title: "Milestones", url: "/milestones", icon: FlagIcon },
      { title: "Performance", url: "/performance", icon: TrophyIcon },
      { title: "Surveys", url: "/surveys", icon: ClipboardCheckIcon },
      { title: "Time Off", url: "/time-off", icon: PalmtreeIcon },
      { title: "Tasks", url: "/tasks", icon: ListChecksIcon },
    ],
  },
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

export const footerNavigation: NavItem[] = [
  { title: "Help", url: "/help", icon: CircleHelpIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];
