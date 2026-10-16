/**
 * The rest of what one person's page shows. The roster says who they are and
 * `records.ts` says what is on file for them; this says how to reach them,
 * who they answer to, what they are rostered on next, what they have asked
 * for and what has happened to their record lately.
 *
 * Generated the way the records are -- deterministic in the employee's id --
 * so a profile is the same profile on every visit, off a seed of its own so
 * the wage and the phone number are not drawn from the same numbers. Swap the
 * whole module for whatever an API hands back.
 */

import {
  addDays,
  addMonths,
  format,
  isAfter,
  parse,
  parseISO,
  startOfWeek,
  subYears,
} from "date-fns";

import { accounts, type Account } from "@components/accounts";

import { between, iso, stream, today } from "./records";
import { rosterFor, type Employee, type RosterRow } from "./roster";

export type Contact = {
  email: string;
  phone: string;
  street: string;
  city: string;
  bornOn: string;
};

export type EmergencyContact = {
  name: string;
  relation: string;
  phone: string;
};

export type Pay = {
  /** When the current rate started, which is not when they were hired. */
  effectiveFrom: string;
  cycle: string;
  method: string;
  /** Every rate before this one, newest first. */
  history: { from: string; wage: number; reason: string }[];
};

export type Shift = {
  id: string;
  on: string;
  start: string;
  end: string;
  hours: number;
  position: string;
  location: string;
  published: boolean;
};

/** One bar of the hours chart: a week, and what it came to. */
export type Week = {
  week: string;
  scheduled: number;
  worked: number;
};

export type TimeOffRequest = {
  id: string;
  type: string;
  dates: string;
  days: number;
  status: "Approved" | "Pending" | "Declined";
};

export type EmployeeFile = {
  id: string;
  name: string;
  category: string;
  addedOn: string;
  status: "Signed" | "On file" | "Awaiting signature";
};

export type ActivityEvent = {
  id: string;
  on: string;
  title: string;
  detail: string;
};

export type Profile = {
  employeeNumber: string;
  contact: Contact;
  emergency: EmergencyContact;
  pay: Pay;
  shifts: Shift[];
  weeks: Week[];
  timeOff: TimeOffRequest[];
  files: EmployeeFile[];
  activity: ActivityEvent[];
};

/**
 * Where each site is, for the addresses and the phone numbers around it. The
 * switcher only ever needed a name and a region, so the city lives here with
 * the one thing that reads it.
 */
const places: { [locationId: string]: { city: string; areaCode: string } } = {
  gastown: { city: "Vancouver, BC", areaCode: "604" },
  yaletown: { city: "Vancouver, BC", areaCode: "604" },
  kitsilano: { city: "Vancouver, BC", areaCode: "604" },
  "burnaby-heights": { city: "Burnaby, BC", areaCode: "604" },
  beltline: { city: "Calgary, AB", areaCode: "403" },
  banff: { city: "Banff, AB", areaCode: "403" },
  pearl: { city: "Portland, OR", areaCode: "503" },
  hawthorne: { city: "Portland, OR", areaCode: "503" },
  "capitol-hill": { city: "Seattle, WA", areaCode: "206" },
  ballard: { city: "Seattle, WA", areaCode: "206" },
  "victoria-harbour": { city: "Victoria, BC", areaCode: "250" },
  langford: { city: "Langford, BC", areaCode: "250" },
};

const streets = [
  "Cordova St",
  "Alder Ave",
  "Pender St",
  "Birchwood Lane",
  "Harbour Rd",
  "Granville St",
  "Maple Crescent",
  "Clement Way",
  "Ferndale Rd",
  "Willow Grove",
  "Dunbar St",
  "Semlin Dr",
];

const relations = ["Spouse", "Partner", "Parent", "Sibling", "Friend"];

const givenNames = [
  "Ruth",
  "Avery",
  "Malik",
  "Jen",
  "Oscar",
  "Nadine",
  "Theo",
  "Priscilla",
  "Owen",
  "Lena",
];

/** The company's mail domain, from its own name: accents off, spaces out. */
const domainFor = (accountId: string) => {
  const name =
    accounts.find((item) => item.id === accountId)?.name ?? accountId;
  return `${name
    .normalize("NFD")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase()}.com`;
};

/** Pick one, by the stream rather than by chance. */
const oneOf = <T>(next: () => number, items: T[]) =>
  items[between(next, 0, items.length - 1)];

/** A time of day written the way a schedule writes one. */
const clock = (hour: number, minutes: number) =>
  format(new Date(2000, 0, 1, hour, minutes), "h:mm a");

/** 555-01xx is the number a phone book is allowed to print. */
const phoneIn = (next: () => number, areaCode: string) =>
  `(${areaCode}) 555-${String(between(next, 100, 199)).padStart(4, "0")}`;

/** Roughly when a department's day starts, which is what decides a shift. */
const startsBetween = (department: string): [number, number] =>
  /kitchen|production/i.test(department)
    ? [6, 11]
    : /bar|taproom/i.test(department)
      ? [15, 18]
      : [8, 15];

/** Who, if anyone, this person answers to: someone senior at their own site,
 *  else whoever runs one of the company's others. Nobody is their own
 *  manager, and the most senior people on a small roster simply have none. */
export function managerFor(account: Account, employee: Employee) {
  const seniors = rosterFor(account, null)
    .all.filter(
      (person) =>
        person.id !== employee.id &&
        person.status === "Active" &&
        /manager|supervisor|lead|chef/i.test(person.position),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    seniors.find((person) => person.locationId === employee.locationId) ??
    seniors[0]
  );
}

/** The people they actually work beside: their own site, their own part of
 *  it. Used for a row of faces, so the order only has to be stable. */
export function teamOf(account: Account, employee: Employee) {
  return rosterFor(account, null)
    .all.filter(
      (person) =>
        person.id !== employee.id &&
        person.locationId === employee.locationId &&
        person.department === employee.department &&
        person.status !== "Inactive",
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}

function contactFor(employee: Employee): Contact {
  const next = stream(`${employee.id}:contact`);
  const place = places[employee.locationId] ?? {
    city: employee.location,
    areaCode: "604",
  };

  return {
    email: `${employee.id.replace("-", ".")}@${domainFor(employee.accountId)}`,
    phone: phoneIn(next, place.areaCode),
    street: `${between(next, 100, 4800)} ${oneOf(next, streets)}`,
    city: place.city,
    /* Their age is already on file, so the birthday has to land inside the
       year that age implies rather than somewhere of its own. */
    bornOn: iso(
      addDays(subYears(today(), employee.age), -between(next, 0, 364)),
    ),
  };
}

function emergencyFor(employee: Employee): EmergencyContact {
  const next = stream(`${employee.id}:emergency`);
  const place = places[employee.locationId];
  const relation = oneOf(next, relations);
  const surname = employee.name.split(" ").slice(-1)[0];

  return {
    name: `${oneOf(next, givenNames)} ${
      /* A relative shares the surname; a friend does not. */
      relation === "Friend"
        ? oneOf(next, givenNames.slice().reverse())
        : surname
    }`,
    relation,
    phone: phoneIn(next, place?.areaCode ?? "604"),
  };
}

function payFor(employee: Employee): Pay {
  const next = stream(`${employee.id}:pay`);
  const hired = parseISO(employee.hiredOn);

  /* A rate starts somewhere after the hire date and before today, unless
     they have not started yet, in which case it starts when they do. */
  const months = between(next, 4, 20);
  const started = addMonths(today(), -months);
  const effectiveFrom = iso(isAfter(hired, started) ? hired : started);

  const history: Pay["history"] = [];
  let wage = employee.wage;
  let from = parseISO(effectiveFrom);

  for (let raises = between(next, 0, 2); raises > 0; raises -= 1) {
    const earlier = addMonths(from, -between(next, 9, 16));
    if (!isAfter(earlier, hired)) break;

    wage = Math.round((wage - between(next, 2, 7) / 4) * 4) / 4;
    from = earlier;
    history.push({
      from: iso(earlier),
      wage,
      reason: oneOf(next, ["Annual review", "Promotion", "Starting rate"]),
    });
  }

  return {
    effectiveFrom,
    cycle: between(next, 0, 1) === 0 ? "Biweekly" : "Semi-monthly",
    method: "Direct deposit",
    history,
  };
}

/**
 * What they are on next. Nobody on leave or off the roster is rostered, and
 * someone still onboarding only picks up shifts once they have started -- so
 * the fortnight the schedule looks over begins at whichever is later, today
 * or their first day.
 */
function shiftsFor(employee: RosterRow): Shift[] {
  if (employee.status === "Inactive" || employee.status === "On leave") {
    return [];
  }

  const next = stream(`${employee.id}:shifts`);
  const now = today();
  const hired = parseISO(employee.hiredOn);
  const first = isAfter(hired, now) ? hired : now;
  /* Someone being offboarded stops being rostered the day they leave. */
  const last =
    "lastDay" in employee ? parse(employee.lastDay, "MMM d, yyyy", now) : null;
  const [low, high] = startsBetween(employee.department);

  const shifts: Shift[] = [];

  for (let day = 1; day <= 16 && shifts.length < 6; day += 1) {
    const on = addDays(first, day);
    if (last && isAfter(on, last)) break;
    if (next() > 0.52) continue;

    const hour = between(next, low, high);
    const minutes = next() < 0.6 ? 0 : 30;
    const hours = between(next, 8, 19) / 2;
    const ends = hour + minutes / 60 + hours;

    shifts.push({
      id: `${employee.id}-${iso(on)}`,
      on: iso(on),
      start: clock(hour, minutes),
      end: clock(Math.floor(ends) % 24, Math.round((ends % 1) * 60)),
      hours,
      position: employee.position,
      location: employee.location,
      /* The near fortnight is posted; the far end of it is still a draft. */
      published: day <= 9,
    });
  }

  return shifts;
}

/**
 * The day a leave began, out of the span the roster writes it as. The first
 * half of "Aug 1 – Dec 19, 2026" carries no year of its own, so it borrows
 * the one the second half ends on.
 */
function leaveStarted(dates: string) {
  const [start, end] = dates.split("–").map((part) => part.trim());
  const year = end.match(/\d{4}$/)?.[0] ?? String(today().getFullYear());

  return parse(
    /\d{4}$/.test(start) ? start : `${start}, ${year}`,
    "MMM d, yyyy",
    today(),
  );
}

/** The stretch of those eight weeks they were actually on the clock. Nobody
 *  logs hours before their first day, after their last, or while away. */
function workingBetween(employee: RosterRow) {
  return {
    from: parseISO(employee.hiredOn),
    to:
      "reason" in employee
        ? parse(employee.lastDay, "MMM d, yyyy", today())
        : "dates" in employee
          ? leaveStarted(employee.dates)
          : null,
  };
}

/** Eight weeks of hours behind them: what they were rostered for, and what
 *  the clocks came back with. Centred on the hours their record carries, so
 *  a part-timer's chart reads like a part-timer's, and flat at nothing for
 *  any week they were not here to work. */
function weeksFor(employee: RosterRow): Week[] {
  const next = stream(`${employee.id}:weeks`);
  const monday = startOfWeek(today(), { weekStartsOn: 1 });
  const { from, to } = workingBetween(employee);

  return Array.from({ length: 8 }, (_, index) => {
    const week = addDays(monday, (index - 8) * 7);
    const scheduled = Math.max(
      0,
      employee.weeklyHours + between(next, -6, 6) / 2,
    );
    /* Worked lands either side of scheduled: shifts run long more often than
       they run short, which is where overtime comes from. */
    const worked = Math.max(0, scheduled + between(next, -3, 7) / 2);

    /* The week is measured by the Friday in it, so a hire date mid-week
       counts that week and one the week before it does not. */
    const working =
      !isAfter(from, addDays(week, 4)) && (to === null || !isAfter(week, to));

    return {
      week: format(week, "MMM d"),
      scheduled: working ? scheduled : 0,
      worked: working ? worked : 0,
    };
  });
}

const timeOffTypes = ["Vacation", "Sick", "Unpaid", "Personal"];

/** What they have asked for lately, newest first: a couple behind them, and
 *  whatever is still in front of someone to approve. */
function timeOffFor(employee: RosterRow): TimeOffRequest[] {
  const next = stream(`${employee.id}:time-off`);
  const now = today();

  /* Someone away right now has that leave at the top of their list, written
     the way the roster already writes it. */
  const current: TimeOffRequest[] =
    "type" in employee && "dates" in employee
      ? [
          {
            id: `${employee.id}-leave`,
            type: `${employee.type} leave`,
            dates: employee.dates,
            days: 0,
            status: "Approved",
          },
        ]
      : [];

  const asked = Array.from({ length: between(next, 2, 4) }, (_, index) => {
    const days = between(next, 1, 8);
    const start = addDays(now, between(next, -210, 40) + index);
    const end = addDays(start, days - 1);
    const draw = next();

    const request: TimeOffRequest = {
      id: `${employee.id}-off-${index}`,
      type: oneOf(next, timeOffTypes),
      dates:
        days === 1
          ? format(start, "MMM d, yyyy")
          : `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`,
      days,
      /* Only something still ahead of them can be waiting on an answer. */
      status: isAfter(start, now)
        ? draw < 0.5
          ? "Pending"
          : "Approved"
        : draw < 0.12
          ? "Declined"
          : "Approved",
    };

    return { start, request };
  });

  return [
    ...current,
    ...asked
      .sort((a, b) => b.start.getTime() - a.start.getTime())
      .map((entry) => entry.request),
  ];
}

/** What is in their file. The certificates are the ones their record says
 *  they hold, so the list never offers a FoodSafe to someone who needs none. */
function filesFor(employee: Employee): EmployeeFile[] {
  const next = stream(`${employee.id}:files`);
  const hired = parseISO(employee.hiredOn);
  const added = (months: number) => iso(addMonths(hired, months));
  /* The tax form is the one the country they work in asks for, which the
     state or province on the end of the city tells us. */
  const american = /, (OR|WA)$/.test(places[employee.locationId]?.city ?? "");

  const files: EmployeeFile[] = [
    {
      id: "agreement",
      name: "Employment agreement",
      category: "Contracts",
      addedOn: added(0),
      status: "Signed",
    },
    {
      id: "tax",
      name: american ? "W-4 withholding" : "TD1 personal tax credits",
      category: "Payroll",
      addedOn: added(0),
      status: next() < 0.85 ? "Signed" : "Awaiting signature",
    },
    {
      id: "deposit",
      name: "Direct deposit authorization",
      category: "Payroll",
      addedOn: added(0),
      status: "Signed",
    },
    {
      id: "handbook",
      name: "Employee handbook acknowledgement",
      category: "Onboarding",
      addedOn: added(between(next, 0, 2)),
      status: next() < 0.78 ? "Signed" : "Awaiting signature",
    },
  ];

  if (employee.permitExpires) {
    files.push({
      id: "permit",
      name: `${employee.permitStatus} and passport`,
      category: "Right to work",
      addedOn: added(0),
      status: "On file",
    });
  }

  if (employee.foodSafeExpires) {
    files.push({
      id: "food-safe",
      name: "FoodSafe Level 1 certificate",
      category: "Certificates",
      addedOn: iso(addMonths(parseISO(employee.foodSafeExpires), -60)),
      status: "On file",
    });
  }

  if (employee.servingItRightExpires) {
    files.push({
      id: "serving-it-right",
      name: "Serving It Right certificate",
      category: "Certificates",
      addedOn: iso(addMonths(parseISO(employee.servingItRightExpires), -60)),
      status: "On file",
    });
  }

  return files.sort((a, b) => b.addedOn.localeCompare(a.addedOn));
}

/** What has happened to the record, newest first. Every entry is something
 *  the rest of the profile already states, said as the day it happened. */
function activityFor(employee: RosterRow, pay: Pay): ActivityEvent[] {
  const next = stream(`${employee.id}:activity`);
  const events: ActivityEvent[] = [
    {
      id: "hired",
      on: employee.hiredOn,
      title: isAfter(parseISO(employee.hiredOn), today())
        ? "Start date set"
        : "Hired",
      detail: `${employee.position}, ${employee.department} at ${employee.location}`,
    },
    {
      id: "rate",
      on: pay.effectiveFrom,
      title: `Pay rate set to $${employee.wage.toFixed(2)}`,
      detail: `${pay.cycle}, paid by ${pay.method.toLowerCase()}`,
    },
  ];

  if (employee.lastReviewOn && employee.rating !== null) {
    events.push({
      id: "review",
      on: employee.lastReviewOn,
      title: `Performance review completed`,
      detail: `Rated ${employee.rating} of 5 by their manager`,
    });
  }

  for (const [id, label, expires] of [
    ["food-safe", "FoodSafe", employee.foodSafeExpires],
    ["sir", "Serving It Right", employee.servingItRightExpires],
  ] as const) {
    if (!expires) continue;
    events.push({
      id,
      on: iso(addMonths(parseISO(expires), -60)),
      title: `${label} certificate filed`,
      detail: `Valid to ${format(parseISO(expires), "MMM d, yyyy")}`,
    });
  }

  if ("progress" in employee) {
    events.push({
      id: "checklist",
      on: iso(addDays(today(), -between(next, 1, 20))),
      title:
        employee.status === "Onboarding"
          ? "Onboarding checklist updated"
          : "Offboarding checklist updated",
      detail: `${employee.progress} of the checklist are done`,
    });
  }

  events.push({
    id: "availability",
    on: iso(addDays(today(), -between(next, 3, 90))),
    title: "Availability updated",
    detail: oneOf(next, [
      "Unavailable Sunday mornings",
      "Available for any shift Monday to Thursday",
      "No late closes on weeknights",
      "Open to picking up extra shifts",
    ]),
  });

  return events.sort((a, b) => b.on.localeCompare(a.on));
}

/** Everything the profile page shows that the roster row does not say. */
export function profileFor(employee: RosterRow): Profile {
  const next = stream(`${employee.id}:number`);
  const pay = payFor(employee);

  return {
    employeeNumber: `${
      accounts
        .find((item) => item.id === employee.accountId)
        ?.initials.toUpperCase() ?? "EM"
    }-${String(between(next, 1000, 9999))}`,
    contact: contactFor(employee),
    emergency: emergencyFor(employee),
    pay,
    shifts: shiftsFor(employee),
    weeks: weeksFor(employee),
    timeOff: timeOffFor(employee),
    files: filesFor(employee),
    activity: activityFor(employee, pay),
  };
}
