/**
 * The review cycles on the Performance screen. Stub data, kept beside the
 * feature the way the dashboard's chart figures sit beside their charts:
 * swap it for whatever the API hands back.
 */

export type ReviewStatus = "Draft" | "Complete";

export type Review = {
  id: string;
  title: string;
  /** One name, or a team when a whole group reviews together. */
  reviewers: string;
  reviewee: string;
  status: ReviewStatus;
  /** Reviews are only dated once they leave draft, so this is often unset. */
  deadline?: string;
};

/** What the account can run before it has to upgrade. */
export const freeReviewLimit = 5;

export const reviews: Review[] = [
  {
    id: "rev-1",
    title: "Annual Review with Dana Whitfield",
    reviewers: "Marcus Poole",
    reviewee: "Dana Whitfield",
    status: "Draft",
  },
  {
    id: "rev-3",
    title: "90 Day Review with Tomas Alvarez",
    reviewers: "Gastown Leads",
    reviewee: "Tomas Alvarez",
    status: "Draft",
  },
  {
    id: "rev-6",
    title: "Annual Review with Frank Smith",
    reviewers: "Marcus Poole",
    reviewee: "Frank Smith",
    status: "Complete",
    deadline: "Jun 14 2026",
  },
  {
    id: "rev-9",
    title: "Mid Year Review with Sam Okafor",
    reviewers: "Marcus Poole",
    reviewee: "Sam Okafor",
    status: "Complete",
    deadline: "May 28 2026",
  },
  {
    id: "rev-10",
    title: "Annual Review with Priya Raman",
    reviewers: "Marcus Poole",
    reviewee: "Priya Raman",
    status: "Complete",
    deadline: "May 18 2026",
  },
];
