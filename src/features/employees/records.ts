/**
 * What is on file for someone beyond their roster row: pay, hours, their
 * status to work in the country, the certificates a hospitality shift legally
 * needs, and the dates an operator ends up chasing.
 *
 * This is the half of the record a filter menu can never cover. Anyone can
 * build a department picker; nobody builds a picker for "work permits that
 * expire before the summer", which is why the A.I. filter needs this data to
 * be worth asking anything of.
 *
 * Stub data like the roster, but generated rather than typed out: every value
 * below is a function of the employee's id, so a name always has the same
 * permit and the same wage, and nobody has to hand-write forty wage rates.
 * The handful of rows worth staging for a demo are written out in `staged`.
 */

import { addDays, addMonths, format, parse } from "date-fns";

/** The paperwork behind a roster row. Dates are ISO so they can be compared;
 *  the page formats them on the way out. */
export type EmployeeRecord = {
  employment: "Full-time" | "Part-time";
  wage: number;
  weeklyHours: number;
  hiredOn: string;
  age: number;
  permitStatus:
    | "Citizen"
    | "Permanent resident"
    | "Work permit"
    | "Study permit";
  /** Null for anyone whose right to work does not expire. */
  permitExpires: string | null;
  /** Food safety and liquor service: only the roles that need one hold one. */
  foodSafeExpires: string | null;
  servingItRightExpires: string | null;
  timeOffDays: number;
  lastReviewOn: string | null;
  rating: number | null;
};

/** The roster row a record is built from -- whatever of it is already known. */
type Row = {
  id: string;
  position: string;
  department: string;
  started?: string;
  starts?: string;
  employment?: "Full-time" | "Part-time";
};

/** Today, as the rest of the prototype sees it. */
export const today = () => new Date();

export const iso = (date: Date) => format(date, "yyyy-MM-dd");

/** The roster writes dates the way a table shows them; records compare them. */
const isoFrom = (written: string) =>
  iso(parse(written, "MMM d, yyyy", new Date()));

/**
 * One number per employee, and a stream of them from it. A hash rather than
 * a random seed, so a record survives a reload -- a demo where everybody's
 * wage changes on refresh is not a demo of anything.
 *
 * Exported because the profile page generates its own half of the record the
 * same way, off a seed of its own, so the two never draw the same numbers.
 */
export function stream(id: string) {
  let state = 2166136261;
  for (const character of id) {
    state = Math.imul(state ^ character.charCodeAt(0), 16777619) >>> 0;
  }

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

/** A whole number in a range, ends included. */
export const between = (next: () => number, low: number, high: number) =>
  low + Math.floor(next() * (high - low + 1));

/** The first band whose words the position matches, else the last. */
const band = <T>(position: string, bands: [string[], T][]) =>
  bands.find(([words]) =>
    words.some((word) => position.toLowerCase().includes(word)),
  )?.[1] ?? bands[bands.length - 1][1];

/**
 * Roughly what the job pays an hour, before the jitter that makes two line
 * cooks on the same roster paid differently, which they are.
 *
 * Exported because a second position is paid for what it is rather than for
 * what the person's main job pays, and the profile prices one the same way.
 */
export const wageFor = (position: string) =>
  band<[number, number]>(position, [
    [
      ["chef", "manager", "supervisor", "lead"],
      [28, 36],
    ],
    [
      ["brewer", "baker", "bartender"],
      [23, 29],
    ],
    [
      ["cook", "cellar"],
      [19, 26],
    ],
    [
      ["server", "barista", "host"],
      [17, 21],
    ],
    [
      ["dishwasher", "busser"],
      [17, 19],
    ],
    [[], [18, 24]],
  ]);

/** Who needs what on file. Kitchen work wants food safety; anything pouring
 *  wants the liquor certificate; the people who run a floor hold both. */
const certificates = (position: string, department: string) => {
  const kitchen = /kitchen|production/i.test(department);
  const runsAFloor = /manager|supervisor|lead|chef/i.test(position);
  const pours = /bar|taproom|front of house/i.test(department);

  return {
    foodSafe: kitchen || runsAFloor,
    servingItRight: pours || runsAFloor,
  };
};

/**
 * Rows worth staging, so the prompts a demo reaches for first have something
 * to find rather than depending on what the generator happened to deal.
 * Everything not named here is generated.
 */
const staged: { [id: string]: Partial<EmployeeRecord> } = {
  "desmond-park": {
    permitStatus: "Work permit",
    permitExpires: iso(addDays(today(), 48)),
  },
  "tomas-bergeron": {
    permitStatus: "Work permit",
    permitExpires: iso(addDays(today(), 74)),
  },
  "dylan-okonkwo": {
    permitStatus: "Study permit",
    permitExpires: iso(addDays(today(), 69)),
  },
  /* Two certificates lapsed: the other thing an operator wants a list of,
     and the reason the dates run either side of today. */
  "noah-fitzgerald": {
    servingItRightExpires: iso(addDays(today(), -24)),
  },
  "mara-ellison": {
    foodSafeExpires: iso(addDays(today(), -62)),
  },
};

/**
 * The paperwork for one person. Deterministic in their id, and deferring to
 * whatever the roster row already states -- a start date on the table and a
 * hire date in the record that disagree would be a bug on screen.
 */
export function recordFor(row: Row): EmployeeRecord {
  const next = stream(row.id);
  const now = today();

  const employment =
    row.employment ?? (next() < 0.55 ? "Full-time" : "Part-time");

  const weeklyHours =
    employment === "Full-time" ? between(next, 36, 46) : between(next, 8, 28);

  const [low, high] = wageFor(row.position);
  const wage = between(next, low * 4, high * 4) / 4;

  const hiredOn = row.started
    ? isoFrom(row.started)
    : row.starts
      ? isoFrom(row.starts)
      : iso(addDays(now, -between(next, 120, 2200)));

  /* Most of a hospitality roster is local; the rest is the reason anyone
     needs to track expiry dates at all. */
  const draw = next();
  const permitStatus =
    draw < 0.54
      ? "Citizen"
      : draw < 0.72
        ? "Permanent resident"
        : draw < 0.92
          ? "Work permit"
          : "Study permit";

  /* Permits run to a date; citizenship and residency do not. Some of these
     land inside the next quarter, which is the point. */
  const permitExpires =
    permitStatus === "Work permit"
      ? iso(addDays(now, between(next, 20, 760)))
      : permitStatus === "Study permit"
        ? iso(addDays(now, between(next, 10, 420)))
        : null;

  const holds = certificates(row.position, row.department);

  /* Certificates last five years here, so a spread either side of today
     leaves a few people lapsed -- which is the thing worth finding. */
  const certificate = () => iso(addDays(now, between(next, -240, 1500)));

  const reviewed = next() < 0.78 && !row.starts;

  return {
    employment,
    wage,
    weeklyHours,
    hiredOn,
    age: between(next, 18, 58),
    permitStatus,
    permitExpires,
    foodSafeExpires: holds.foodSafe ? certificate() : null,
    servingItRightExpires: holds.servingItRight ? certificate() : null,
    timeOffDays: between(next, 0, 34) / 2,
    lastReviewOn: reviewed ? iso(addMonths(now, -between(next, 1, 22))) : null,
    rating: reviewed ? between(next, 5, 10) / 2 : null,
    ...staged[row.id],
  };
}
