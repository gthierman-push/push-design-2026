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
  UserSearchIcon,
  UsersIcon,
} from "lucide-react";

/**
 * Every page the app publishes, grouped the way the sidebar shows them. It
 * lives apart from the layout so the breadcrumb and the command palette can
 * read it without importing a component.
 */
export const appHome = {
  title: "Dashboard",
  url: "/",
  icon: LayoutDashboardIcon,
};

export const appSections = [
  {
    label: "Scheduling",
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
    items: [
      { title: "Employees", url: "/employees", icon: UsersIcon },
      { title: "Milestones", url: "/milestones", icon: FlagIcon },
      { title: "Performance", url: "/performance", icon: TrophyIcon },
      { title: "Surveys", url: "/surveys", icon: ClipboardCheckIcon },
      { title: "Time Off", url: "/time-off", icon: PalmtreeIcon },
      { title: "Tasks", url: "/tasks", icon: ListChecksIcon },
    ],
  },
  {
    label: "Hiring",
    items: [
      { title: "Jobs", url: "/jobs", icon: BriefcaseBusinessIcon },
      { title: "Candidates", url: "/candidates", icon: UserSearchIcon },
      { title: "Interviews", url: "/interviews", icon: CalendarCheckIcon },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Chat", url: "/chat", icon: MessagesSquareIcon },
      { title: "Message Board", url: "/message-board", icon: MegaphoneIcon },
    ],
  },
  {
    label: "Payroll",
    items: [
      { title: "Payroll", url: "/payroll", icon: BadgeDollarSignIcon },
      { title: "Timesheets", url: "/timesheets", icon: TableIcon },
    ],
  },
  {
    label: "Reporting",
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

export const appFooterNavigation = [
  { title: "Help", url: "/help", icon: CircleHelpIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];
