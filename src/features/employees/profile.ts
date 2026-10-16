/**
 * The rest of what one person's page shows. The roster says who they are and
 * `records.ts` says what is on file for them; this says how to reach them,
 * who they answer to, every job they hold rather than the one the roster
 * names, what they are rostered on next, what they have asked for and what
 * has happened to their record lately.
 *
 * Generated the way the records are -- deterministic in the employee's id --
 * so a profile is the same profile on every visit, off a seed of its own so
 * the wage and the phone number are not drawn from the same numbers. Swap the
 * whole module for whatever an API hands back.
 */

import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  format,
  isAfter,
  parse,
  parseISO,
  subYears,
} from "date-fns";

import { accounts, type Account } from "@components/accounts";

import { between, iso, stream, today, wageFor } from "./records";
import { rosterFor, type Employee, type RosterRow } from "./roster";

export type Contact = {
  email: string;
  phone: string;
  street: string;
  city: string;
  bornOn: string;
};

/**
 * The name-and-number half of the record, the part somebody fills in on
 * their first day. Half of it is optional and most people leave it that way,
 * so the nullable fields here are usually null -- which is what the card
 * drawing them has to be built to show.
 */
export type Personal = {
  firstName: string;
  lastName: string;
  /** What they go by, where that is not what the record says. */
  preferredFirst: string | null;
  preferredLast: string | null;
  /** A second number, which most people never give. */
  altPhone: string | null;
  language: string;
  /** Whatever the country they work in issues, in full. */
  governmentId: GovernmentId;
};

/**
 * The number a government knows somebody by: a SIN at the Canadian sites, an
 * SSN at the American ones. Neither is a number anybody could actually hold
 * -- see `governmentIdFor` -- which is what makes them safe to print in full
 * on a page this one shows to anybody who can open it.
 */
export type GovernmentId = {
  label: "SIN" | "SSN";
  number: string;
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

/**
 * One of the jobs somebody holds. Most people hold one -- the one the roster
 * names and the rest of the app shows -- but a kitchen that is short on a
 * Friday trains its servers to prep, and the second job is paid at its own
 * rate, in its own department, often at another of the company's sites.
 */
export type Position = {
  id: string;
  name: string;
  department: string;
  location: string;
  /** Dollars an hour, or dollars a year where the job is a salaried one. */
  rate: number;
  basis: "Hourly" | "Salary";
  /** The day they took the job on. The one the roster names started the day
   *  they were hired; a second job starts whenever they were given it. */
  startedOn: string;
  /** The one the roster row, the schedule and this page's heading name. */
  primary: boolean;
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
  personal: Personal;
  contact: Contact;
  emergency: EmergencyContact;
  pay: Pay;
  positions: Position[];
  shifts: Shift[];
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

/**
 * Who goes by a short form of their name, and who by another surname
 * altogether. A table rather than a generator: a preferred name is a thing
 * somebody types in, so most of the roster has none and the few who do have
 * one that follows from the name they were given.
 */
const shortForms: { [firstName: string]: string } = {
  Alicia: "Ali",
  Beatrix: "Bea",
  Camille: "Cam",
  Cassandra: "Cassie",
  Desmond: "Des",
  Gregor: "Greg",
  Harriet: "Hattie",
  Henry: "Hank",
  Marisol: "Mari",
  Priya: "Pri",
};

const usedSurnames: { [lastName: string]: string } = {
  Nandakumar: "Nanda",
  Lindqvist: "Lind",
};

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

/**
 * A social insurance or social security number, written out in full. Both
 * are built so they cannot belong to a real person -- the page prints every
 * digit, and demo data that reads as somebody's actual number is not a thing
 * to leave lying around in a repository.
 *
 * The American side takes an area number in the 900s, which the SSA has
 * never issued and never will. The Canadian side has no reserved range, so
 * the check digit is set one past the one that would make the number add up,
 * leaving it a SIN that fails the arithmetic every SIN is checked by.
 */
function governmentIdFor(next: () => number, inCanada: boolean): GovernmentId {
  const pad = (value: number, width: number) =>
    String(value).padStart(width, "0");

  if (!inCanada) {
    return {
      label: "SSN",
      number: `${between(next, 900, 999)}-${pad(between(next, 1, 99), 2)}-${pad(
        between(next, 1, 9999),
        4,
      )}`,
    };
  }

  /* Eight digits of their own, then a ninth that is wrong on purpose. */
  const digits = [
    between(next, 1, 7),
    ...Array.from({ length: 7 }, () => between(next, 0, 9)),
  ];
  const sum = digits.reduce((total, digit, index) => {
    /* Every second digit counts double, and a double that runs past nine
       counts as its own two digits added together. */
    const counted = index % 2 === 1 ? digit * 2 : digit;
    return total + (counted > 9 ? counted - 9 : counted);
  }, 0);
  const checks = (10 - (sum % 10)) % 10;
  digits.push((checks + 1) % 10);

  const number = digits.join("");
  return {
    label: "SIN",
    number: `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`,
  };
}

function personalFor(employee: Employee, homePhone: string): Personal {
  const next = stream(`${employee.id}:personal`);
  const [firstName, ...rest] = employee.name.split(" ");
  const lastName = rest.join(" ");
  const place = places[employee.locationId];
  /* The company's Canadian sites and its American ones are offered a
     different pair of languages, which is the only thing the country
     decides here. */
  const inCanada = /, (BC|AB)$/.test(place?.city ?? "");

  /* A second number is asked for and mostly left blank, so most people here
     do not have one either. The printable range is only a hundred numbers
     wide, so draw again where it lands on the first number -- two identical
     rows read as a bug rather than as a coincidence. */
  let altPhone: string | null = null;
  if (between(next, 1, 3) === 1) {
    do {
      altPhone = phoneIn(next, place?.areaCode ?? "604");
    } while (altPhone === homePhone);
  }

  return {
    firstName,
    lastName,
    preferredFirst: shortForms[firstName] ?? null,
    preferredLast: usedSurnames[lastName] ?? null,
    altPhone,
    language: inCanada
      ? between(next, 1, 5) === 1
        ? "French (Canada)"
        : "English (Canada)"
      : between(next, 1, 5) === 1
        ? "Spanish (United States)"
        : "English (United States)",
    governmentId: governmentIdFor(next, inCanada),
  };
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

/** The jobs that are paid for the year rather than for the shift: on a
 *  hospitality roster that is the ones that run a kitchen or a building. */
const salaried = (position: string) => /chef|manager/i.test(position);

/** The jobs somebody is promoted into rather than picks up a shift of, which
 *  is the same list the profile reads a manager off. */
const senior = (position: string) =>
  /manager|supervisor|lead|chef/i.test(position);

/** A salary from what the job pays an hour -- a full year of full weeks,
 *  which is the arithmetic payroll does in reverse to pay a salaried person
 *  for a statutory holiday. Exact both ways, so the two never disagree. */
const salaryFrom = (wage: number) => wage * 2080;

/** What a position pays, written the way that kind of pay is written: a
 *  salary in whole dollars, an hourly rate to the cent. */
export const rateOf = (position: Position) =>
  position.basis === "Salary"
    ? `$${position.rate.toLocaleString("en-US")}`
    : `$${position.rate.toFixed(2)}`;

/** Every job this company has anyone doing, with the department it belongs
 *  to. Taken off its own roster rather than listed here, so a second position
 *  is something somebody at the company already does. */
function jobsAt(accountId: string) {
  const account = accounts.find((item) => item.id === accountId);
  if (!account) return [];

  const jobs = new Map<string, { name: string; department: string }>();
  for (const person of rosterFor(account, null).all) {
    jobs.set(person.position, {
      name: person.position,
      department: person.department,
    });
  }

  return [...jobs.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Every job they hold. The first is the one the roster names, at the site and
 * in the department it names, paid what their record says -- so the tab and
 * the rest of the page can never disagree about their main job.
 *
 * The rest are the ones an operator ends up giving somebody: a server who
 * also bars, a prep cook who covers dish, usually at their own site and
 * sometimes at another of the company's. Each is paid for what it is, which
 * is the reason they are worth keeping apart.
 */
function positionsFor(employee: RosterRow): Position[] {
  const next = stream(`${employee.id}:positions`);
  const salary = salaried(employee.position);

  const primary: Position = {
    id: `${employee.id}-0`,
    name: employee.position,
    department: employee.department,
    location: employee.location,
    rate: salary ? salaryFrom(employee.wage) : employee.wage,
    basis: salary ? "Salary" : "Hourly",
    startedOn: employee.hiredOn,
    primary: true,
  };

  /* Nobody on a salary is picking up a shift at the hourly rate, and nobody
     who has not started yet has been given a second job to do. */
  if (salary || "starts" in employee) return [primary];

  const draw = next();
  const extras = draw < 0.38 ? 1 : draw < 0.56 ? 2 : 0;
  if (extras === 0) return [primary];

  /* Their own job is not a second one, and running a floor is a job you are
     given rather than one you cover a shift of. */
  const choices = jobsAt(employee.accountId).filter(
    (job) => job.name !== employee.position && !senior(job.name),
  );

  const elsewhere = (
    accounts.find((item) => item.id === employee.accountId)?.locations ?? []
  )
    .filter((location) => location.id !== employee.locationId)
    .map((location) => location.name);

  const positions = [primary];
  /* A second job is given to somebody who has been here a while, so it
     starts in the back half of their time rather than on their first day. */
  const hired = parseISO(employee.hiredOn);
  const since = Math.max(differenceInCalendarDays(today(), hired), 0);

  for (let index = 1; index <= extras && choices.length > 0; index += 1) {
    const [job] = choices.splice(between(next, 0, choices.length - 1), 1);
    const [low, high] = wageFor(job.name);

    positions.push({
      id: `${employee.id}-${index}`,
      name: job.name,
      department: job.department,
      /* Mostly the site they already work at: covering a shift across town
         is the rarer half of why anybody holds a second position. */
      location:
        next() < 0.74 || elsewhere.length === 0
          ? employee.location
          : oneOf(next, elsewhere),
      rate: between(next, low * 4, high * 4) / 4,
      basis: "Hourly",
      startedOn: iso(
        addDays(hired, between(next, Math.round(since / 2), since)),
      ),
      primary: false,
    });
  }

  return positions;
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
  const contact = contactFor(employee);

  return {
    employeeNumber: `${
      accounts
        .find((item) => item.id === employee.accountId)
        ?.initials.toUpperCase() ?? "EM"
    }-${String(between(next, 1000, 9999))}`,
    personal: personalFor(employee, contact.phone),
    contact,
    emergency: emergencyFor(employee),
    pay,
    positions: positionsFor(employee),
    shifts: shiftsFor(employee),
    timeOff: timeOffFor(employee),
    files: filesFor(employee),
    activity: activityFor(employee, pay),
  };
}
