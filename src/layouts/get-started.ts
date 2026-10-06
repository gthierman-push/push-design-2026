/**
 * The setup checklist the sidebar carries until an account has worked through
 * it. Kept beside the nav because every step is a page the nav already knows
 * about — the list is a reading order through the app, not a place of its own.
 */
export type GetStartedStep = {
  /** Stable key: what gets written to storage when the step is done. */
  id: string;
  title: string;
  url: string;
};

export const getStartedSteps: GetStartedStep[] = [
  { id: "company", title: "Set up your company", url: "/settings" },
  { id: "employees", title: "Add your employees", url: "/employees" },
  { id: "schedule", title: "Build your first schedule", url: "/scheduler" },
  {
    id: "clocks",
    title: "Set up your time clocks",
    url: "/settings/clock-settings",
  },
  { id: "payroll", title: "Run your first payroll", url: "/payroll" },
];

/** Where the checklist's state lives in `localStorage`. */
export const getStartedStorageKey = "push-design:get-started";

/** What the prototype opens on: signup covers the company, so that one is done. */
export const seededSteps = ["company"];
