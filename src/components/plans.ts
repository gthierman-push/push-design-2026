import type { LucideIcon } from "lucide-react";

import {
  BadgeDollarSignIcon,
  BrainCircuitIcon,
  CalendarRangeIcon,
  CalendarSyncIcon,
  ChartPieIcon,
  ClockIcon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  ScanFaceIcon,
  TrophyIcon,
  UserSearchIcon,
  UsersIcon,
} from "lucide-react";

/**
 * The packages on pushoperations.com/pushpricing, and the one this account is
 * on. Stub data, kept beside the upgrade dialog the way the accounts list
 * lives beside the switcher: swap it for whatever billing hands back.
 *
 * Only Essentials carries a published price — the rest are quoted on employee
 * count — so the dialog sells a conversation rather than a checkout.
 */

export type PlanFeature = {
  /** Falls back to a check when the feature is just another line on the list. */
  icon?: LucideIcon;
  /** Also what an upgrade prompt matches on to find the plan that unlocks it. */
  label: string;
  /** The line that hangs under the label — what the feature covers. */
  detail?: string;
  /** Sold on top of the plan rather than included in it. */
  addOn?: boolean;
};

export type Plan = {
  id: string;
  name: string;
  /** What the pricing page publishes. Not every package has a number. */
  price: string;
  /** What that price is per, or what the quote is based on. */
  priceNote: string;
  /** Who the package is for, shown under the plan tabs. */
  note: string;
  /** Everything the package adds over the one below it, in the page's order. */
  features: PlanFeature[];
};

export const plans: Plan[] = [
  {
    id: "essentials",
    name: "Essentials",
    price: "$200",
    priceNote: "per month, per location",
    note: "For single-location businesses with 15 employees or fewer.",
    features: [
      { icon: BadgeDollarSignIcon, label: "Payroll" },
      { icon: ClockIcon, label: "Time tracking" },
    ],
  },
  {
    id: "signature",
    name: "Signature",
    price: "Custom",
    priceNote: "quoted on your employee count",
    note: "Everything in Essentials, plus:",
    features: [
      {
        icon: MapPinnedIcon,
        label: "Multi-Province, Multi-Location Payroll Management",
        detail: "Includes full-service payroll migration",
      },
      { icon: UsersIcon, label: "Paperless Digital Onboarding" },
      { icon: UserSearchIcon, label: "Applicant Tracking System (ATS)" },
      { icon: CalendarRangeIcon, label: "Team Scheduling" },
      { label: "Turnover Reporting" },
      { label: "License and Visa Expiration Tracking" },
      { label: "Seamless POS Integrations" },
      { label: "Labor Forecasting" },
      { label: "Mobile-First Team Management" },
      { label: "Labor Cost Controls" },
      { label: "Shift Swapping" },
      { label: "Real-Time Compliance Alerts" },
      { label: "Photo Capture (Buddy Punching Prevention)" },
      { label: "In-Depth Reporting and Analytics" },
      { label: "E-Sign capabilities" },
      { label: "Workforce Costing and Reports" },
      { label: "Sales vs Labor Reporting" },
      { label: "Employee Statistics" },
      { label: "Comprehensive Leave Management", addOn: true },
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: "Custom",
    priceNote: "quoted on your employee count",
    note: "Everything in Signature, plus:",
    features: [
      {
        icon: CalendarSyncIcon,
        label: "Auto Scheduling",
        detail: "With advanced labor forecasting",
      },
      {
        icon: ScanFaceIcon,
        label: "Enhanced Time Tracking (Facial Recognition)",
      },
      {
        icon: LayoutDashboardIcon,
        label: "Centralized Enterprise Dashboard",
      },
      { icon: MapPinnedIcon, label: "Multi-Location Employee Linking" },
      { label: "Comprehensive Leave Management" },
      { label: "Province-Specific Automatic Break Compliance" },
      { label: "Instant Employee Communication (Chat)" },
      { label: "BI Insights", addOn: true },
      { label: "Employee Engagement", addOn: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceNote: "quoted for 50+ employees",
    note: "Everything in Supreme, plus:",
    features: [
      {
        icon: TrophyIcon,
        label: "Employee Engagement",
        detail: "Performance reviews, surveys and milestones",
      },
      {
        icon: ChartPieIcon,
        label: "BI Insights",
        detail: "Cross-location dashboards and exports",
      },
      { icon: BrainCircuitIcon, label: "Advanced Forecasting" },
    ],
  },
];

/** The package the signed-in account is on. */
export const currentPlanId = "signature";

/** The package that includes a feature outright, rather than as an add-on. */
export function planIncluding(feature: string) {
  return plans.find((plan) =>
    plan.features.some((item) => item.label === feature && !item.addOn),
  );
}

/** The package that sells a feature as an add-on, if one does. */
export function planOfferingAddOn(feature: string) {
  return plans.find((plan) =>
    plan.features.some((item) => item.label === feature && item.addOn),
  );
}
