/**
 * The plans an account can be on and the one it is on today. Stub data, kept
 * beside the upgrade dialog the way the accounts list lives beside the
 * switcher: swap it for whatever billing hands back.
 */

export type Plan = {
  id: string;
  name: string;
  /** Per active employee, per month. */
  price: string;
  description: string;
  /** What this plan adds over the one below it. */
  highlights: string[];
};

export const plans: Plan[] = [
  {
    id: "essentials",
    name: "Essentials",
    price: "$4",
    description: "Everything a single team needs to run its schedule.",
    highlights: ["Scheduling", "Time clocks", "Timesheets"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$8",
    description: "Everything in Essentials, plus the people tools.",
    highlights: ["Performance reviews", "Surveys", "Onboarding", "Milestones"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$12",
    description: "Everything in Professional, across every location you run.",
    highlights: [
      "Business intelligence",
      "Custom roles",
      "API access",
      "Dedicated support",
    ],
  },
];

/** The plan the signed-in account is on. */
export const currentPlanId = "essentials";
