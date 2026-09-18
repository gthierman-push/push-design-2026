import { sections } from "./settings-nav";
import type { SettingsNavItem } from "./settings-nav";

/**
 * A single control on a settings page, addressable from the sidebar search.
 *
 * `anchor` is the DOM id of the control itself — the same id its `FieldLabel`
 * points at — so a result can scroll to and focus the real field rather than a
 * separate marker. `tab` names the panel the field lives in, and travels in the
 * URL so the page can open that panel before the field is looked for.
 */
export type SettingsField = {
  /** The page the field belongs to, matched against the nav by url. */
  url: string;
  label: string;
  tab?: string;
  /** The tab's display name, or the card heading when a tab has sections. */
  section?: string;
  anchor?: string;
  /** Extra words a field should match on, such as its description. */
  keywords?: string;
};

export type SettingsSearchResult = {
  page: SettingsNavItem;
  /** True when the page's own name matched the query. */
  pageMatched: boolean;
  fields: SettingsField[];
};

const companySetup = "/settings";

/** Tab values are url-safe; these are the names the tabs actually show. */
const tabLabels: Record<string, string> = {
  "company-setup": "Company Setup",
  "timezone-weather": "Timezone & Weather",
  "roe-contact": "ROE Contact",
  taxes: "Taxes",
  "payroll-configuration": "Payroll Configuration",
  "compliance-filing": "Compliance & Filing",
  account: "Account",
  organization: "Organization",
  "eft-debit": "EFT Debit",
  history: "History",
};

/**
 * Hand-kept for now: the pages that are still placeholders have no fields to
 * index, and Company Setup is the one built-out screen. A field belongs here as
 * soon as it exists on screen.
 */
export const settingsFields: SettingsField[] = [
  // Company Setup
  { url: companySetup, tab: "company-setup", section: "Company Profile", label: "Logo", anchor: "logo", keywords: "shown on pay stubs and the employee app" },
  { url: companySetup, tab: "company-setup", section: "Company Profile", label: "Company Name", anchor: "company-name" },
  { url: companySetup, tab: "company-setup", section: "Company Profile", label: "Legal Name", anchor: "legal-name", keywords: "leave blank if this is the same as the company name" },
  { url: companySetup, tab: "company-setup", section: "Company Address", label: "Street", anchor: "street", keywords: "address" },
  { url: companySetup, tab: "company-setup", section: "Company Address", label: "City", anchor: "city", keywords: "address" },
  { url: companySetup, tab: "company-setup", section: "Company Address", label: "Province", anchor: "province", keywords: "address state" },
  { url: companySetup, tab: "company-setup", section: "Company Address", label: "Country", anchor: "country", keywords: "address" },
  { url: companySetup, tab: "company-setup", section: "Company Address", label: "Postal Code", anchor: "postal-code", keywords: "address zip" },

  // Timezone & Weather
  { url: companySetup, tab: "timezone-weather", label: "Timezone", anchor: "timezone" },
  { url: companySetup, tab: "timezone-weather", label: "Temperature Location", anchor: "temperature-location", keywords: "weather" },
  { url: companySetup, tab: "timezone-weather", label: "Temperature Units", anchor: "temperature-units", keywords: "weather celsius fahrenheit" },

  // ROE Contact
  { url: companySetup, tab: "roe-contact", label: "First Name", anchor: "roe-first-name", keywords: "roe contact" },
  { url: companySetup, tab: "roe-contact", label: "Last Name", anchor: "roe-last-name", keywords: "roe contact" },
  { url: companySetup, tab: "roe-contact", label: "Phone Number", anchor: "roe-phone", keywords: "roe contact" },
  { url: companySetup, tab: "roe-contact", label: "Extension", anchor: "roe-extension", keywords: "roe contact phone" },

  // Taxes
  { url: companySetup, tab: "taxes", label: "Federal Payroll Account", anchor: "federal-account", keywords: "tax cra business number" },
  { url: companySetup, tab: "taxes", label: "Provincial Health Tax", anchor: "health-tax", keywords: "eht tax" },

  // Payroll Configuration
  { url: companySetup, tab: "payroll-configuration", label: "Pay Frequency", anchor: "pay-frequency", keywords: "payroll biweekly semi-monthly" },
  { url: companySetup, tab: "payroll-configuration", label: "Yearly Pay Periods", anchor: "yearly-pay-periods", keywords: "payroll" },

  // Compliance & Filing
  { url: companySetup, tab: "compliance-filing", label: "Vacation Payroll Managed By", anchor: "vacation-payroll" },
  { url: companySetup, tab: "compliance-filing", label: "Gov't Remittance Completed By", anchor: "govt-remittance", keywords: "government" },
  { url: companySetup, tab: "compliance-filing", label: "Remittance Due", anchor: "remittance-due" },
  { url: companySetup, tab: "compliance-filing", label: "WCB/WSIB Completed By", anchor: "wcb-completed-by", keywords: "workers compensation" },
  { url: companySetup, tab: "compliance-filing", label: "EHT Completed By", anchor: "eht-completed-by", keywords: "employer health tax" },
  { url: companySetup, tab: "compliance-filing", label: "WCB Account #", anchor: "wcb-account", keywords: "workers compensation number" },
  { url: companySetup, tab: "compliance-filing", label: "Require Paystub Delivery?", anchor: "require-paystub-delivery", keywords: "pay stub" },
  { url: companySetup, tab: "compliance-filing", label: "Require ROE", anchor: "require-roe", keywords: "record of employment" },

  // Account
  { url: companySetup, tab: "account", label: "Demo Account?", anchor: "demo-account" },
  { url: companySetup, tab: "account", label: "Industry", anchor: "industry" },
  { url: companySetup, tab: "account", label: "Account Status", anchor: "account-status" },
  { url: companySetup, tab: "account", label: "Cancel Date", anchor: "cancel-date" },
  { url: companySetup, tab: "account", label: "Inactivation Status", anchor: "inactivation-status" },
  { url: companySetup, tab: "account", label: "Inactivation Date", anchor: "inactivation-date" },
  { url: companySetup, tab: "account", label: "Note", anchor: "account-note" },
  { url: companySetup, tab: "account", label: "Show Employee Numbers", anchor: "show-employee-numbers" },
  { url: companySetup, tab: "account", label: "Covers Applicable", anchor: "covers-applicable" },
  { url: companySetup, tab: "account", label: "Employees Compose Messages", anchor: "employees-compose-messages" },
  { url: companySetup, tab: "account", label: "ROE Access", anchor: "roe-access", keywords: "record of employment" },
  { url: companySetup, tab: "account", label: "Timesheet Approvals", anchor: "timesheet-approvals" },
  { url: companySetup, tab: "account", label: "Rooms Applicable", anchor: "rooms-applicable" },
  { url: companySetup, tab: "account", label: "Contractors Only", anchor: "contractors-only" },

  // Organization
  { url: companySetup, tab: "organization", label: "Organization", anchor: "organization" },
  { url: companySetup, tab: "organization", section: "Company Groups", label: "Demo Enterprises (organization)", anchor: "company-group-organization" },
  { url: companySetup, tab: "organization", section: "Company Groups", label: "Demo Enterprises (company)", anchor: "company-group-company" },

  // EFT Debit
  { url: companySetup, tab: "eft-debit", label: "Institution", anchor: "institution", keywords: "bank eft" },
  { url: companySetup, tab: "eft-debit", label: "Transit Number", anchor: "transit-number", keywords: "bank eft" },
  { url: companySetup, tab: "eft-debit", label: "Account Number", anchor: "account-number", keywords: "bank eft" },
];

/** The page a field sits on, so a result can carry its icon and title. */
const pagesByUrl = new Map(
  sections.flatMap((section) => section.items).map((item) => [item.url, item]),
);

function matches(haystack: string, query: string) {
  return haystack.toLowerCase().includes(query);
}

/**
 * Pages whose name matches, plus pages holding a field that matches. A page
 * that matches on its own name still lists its matching fields, so searching
 * "company" offers both the page and the fields named after it.
 */
export function searchSettings(query: string): SettingsSearchResult[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const fieldsByUrl = new Map<string, SettingsField[]>();
  for (const field of settingsFields) {
    if (
      !matches(field.label, needle) &&
      !matches(field.keywords ?? "", needle) &&
      !matches(field.section ?? "", needle)
    ) {
      continue;
    }
    const found = fieldsByUrl.get(field.url);
    if (found) found.push(field);
    else fieldsByUrl.set(field.url, [field]);
  }

  const results: SettingsSearchResult[] = [];
  for (const section of sections) {
    for (const page of section.items) {
      const fields = fieldsByUrl.get(page.url) ?? [];
      const pageMatched = matches(page.title, needle);
      if (!pageMatched && fields.length === 0) continue;
      results.push({ page, pageMatched, fields });
    }
  }
  return results;
}

/** The url that opens a field: its page, with the tab and field to reveal. */
export function fieldHref(field: SettingsField) {
  const params = new URLSearchParams();
  if (field.tab) params.set("tab", field.tab);
  if (field.anchor) params.set("field", field.anchor);
  const query = params.toString();
  return query ? `${field.url}?${query}` : field.url;
}

/** The page title a field belongs to, for the result's second line. */
export function fieldPageTitle(field: SettingsField) {
  return pagesByUrl.get(field.url)?.title ?? "Settings";
}

/** Where a field sits within its page: the tab, then the card it is under. */
export function fieldContext(field: SettingsField) {
  const tab = field.tab ? (tabLabels[field.tab] ?? field.tab) : null;
  return [tab, field.section].filter(Boolean).join(" › ");
}
