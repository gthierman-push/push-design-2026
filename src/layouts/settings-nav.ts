import type { LucideIcon } from "lucide-react";

import {
  AlarmClockIcon,
  BadgeDollarSignIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  ClockIcon,
  CoffeeIcon,
  CoinsIcon,
  FileTextIcon,
  FilesIcon,
  FolderTreeIcon,
  GaugeIcon,
  HeartHandshakeIcon,
  KeyRoundIcon,
  LandmarkIcon,
  NetworkIcon,
  PalmtreeIcon,
  PlugIcon,
  ReceiptTextIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  TagsIcon,
  TrendingUpIcon,
  UserCogIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

/**
 * The settings nav, kept beside the layout so the search index and the sidebar
 * read the same list of pages.
 */
export type SettingsNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type SettingsNavSection = {
  label: string;
  items: SettingsNavItem[];
};

export const sections: SettingsNavSection[] = [
  {
    label: "Company",
    items: [
      { title: "Company Setup", url: "/settings", icon: BuildingIcon },
      {
        title: "Departments",
        url: "/settings/departments",
        icon: FolderTreeIcon,
      },
      { title: "Positions", url: "/settings/positions", icon: BriefcaseIcon },
      {
        title: "Profit Centers",
        url: "/settings/profit-centers",
        icon: TrendingUpIcon,
      },
      {
        title: "Period Labels",
        url: "/settings/period-labels",
        icon: TagsIcon,
      },
      { title: "Alarms", url: "/settings/alarms", icon: AlarmClockIcon },
    ],
  },
  {
    label: "Admins & Security",
    items: [
      {
        title: "Administrators",
        url: "/settings/administrators",
        icon: UserCogIcon,
      },
      { title: "Roles", url: "/settings/roles", icon: KeyRoundIcon },
      {
        title: "Security Settings",
        url: "/settings/security",
        icon: ShieldCheckIcon,
      },
      {
        title: "Fraud Reviews",
        url: "/settings/fraud-reviews",
        icon: ShieldAlertIcon,
      },
    ],
  },
  {
    label: "Payroll & Compensation",
    items: [
      { title: "Tax Setup", url: "/settings/tax-setup", icon: LandmarkIcon },
      {
        title: "Statutory Holidays",
        url: "/settings/statutory-holidays",
        icon: CalendarDaysIcon,
      },
      {
        title: "Hours Structures",
        url: "/settings/hours-structures",
        icon: ClockIcon,
      },
      {
        title: "Pay Stub Settings",
        url: "/settings/pay-stubs",
        icon: ReceiptTextIcon,
      },
      {
        title: "Journal Entry Settings",
        url: "/settings/journal-entries",
        icon: FileTextIcon,
      },
      {
        title: "Bulk Salary Updates",
        url: "/settings/bulk-salary-updates",
        icon: BadgeDollarSignIcon,
      },
      {
        title: "Benefits Setup",
        url: "/settings/benefits",
        icon: HeartHandshakeIcon,
      },
    ],
  },
  {
    label: "Scheduling",
    items: [
      {
        title: "Clock Settings",
        url: "/settings/clock-settings",
        icon: SlidersHorizontalIcon,
      },
      {
        title: "Clock Surveys",
        url: "/settings/clock-surveys",
        icon: ClipboardListIcon,
      },
      { title: "Breaks", url: "/settings/breaks", icon: CoffeeIcon },
      { title: "Tips Settings", url: "/settings/tips", icon: CoinsIcon },
      { title: "Time Off", url: "/settings/time-off", icon: PalmtreeIcon },
      { title: "Labor Guide", url: "/settings/labor-guide", icon: GaugeIcon },
    ],
  },
  {
    label: "Employees & Onboarding",
    items: [
      {
        title: "Employee Settings",
        url: "/settings/employee-settings",
        icon: UsersIcon,
      },
      {
        title: "Employee Attributes",
        url: "/settings/employee-attributes",
        icon: NetworkIcon,
      },
      {
        title: "Onboarding Settings",
        url: "/settings/onboarding",
        icon: UserPlusIcon,
      },
      { title: "Forms", url: "/settings/forms", icon: FileTextIcon },
    ],
  },
  {
    label: "Files",
    items: [
      {
        title: "File Categories",
        url: "/settings/file-categories",
        icon: FolderTreeIcon,
      },
      {
        title: "Company Files",
        url: "/settings/company-files",
        icon: FilesIcon,
      },
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        title: "POS / Integrations",
        url: "/settings/integrations",
        icon: PlugIcon,
      },
    ],
  },
];
