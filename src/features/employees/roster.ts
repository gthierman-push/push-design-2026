/**
 * Who works where. Stub data, kept beside the feature the way the review
 * cycles sit beside Performance: swap it for whatever an API hands back.
 *
 * Every row names the company and the location it belongs to, so the page can
 * narrow to the location the app is pointed at -- and show the whole company
 * when it is pointed at all of them.
 */

import type { Account, Location } from "@components/accounts";

import { recordFor, type EmployeeRecord } from "./records";

/**
 * Stand-in staff photos: the free human set from uifaces.co, numbered 1-222.
 * They are hotlinked rather than checked in, so a row whose picture cannot be
 * reached simply falls back to the initials the avatar already draws.
 */
const face = (n: number) =>
  `https://mockmind-api.uifaces.co/content/human/${n}.jpg`;

/** Who someone is: what every row below states outright, whatever its
 *  status. The lists are written in these terms. */
export type Person = {
  id: string;
  name: string;
  photo: string;
  position: string;
  department: string;
  accountId: string;
  locationId: string;
};

/**
 * A row as the page sees one: who they are, what is on file for them, and the
 * two things the lists imply rather than state -- the site they work at and
 * where they are in their time with the company. `rosterFor` fills the rest
 * in, so everything downstream of it can filter on any of it.
 */
export type Employee = Person &
  EmployeeRecord & {
    location: string;
    status: string;
  };

export type ActiveEmployee = Person & {
  started: string;
  employment: "Full-time" | "Part-time";
};

export type OnboardingEmployee = Person & {
  starts: string;
  progress: string;
  status: string;
};

export type OnLeaveEmployee = Person & {
  type: string;
  dates: string;
  returns: string;
};

export type OffboardingEmployee = Person & {
  lastDay: string;
  progress: string;
  status: string;
};

export type InactiveEmployee = Person & {
  lastDay: string;
  reason: string;
};

const active: ActiveEmployee[] = [
  {
    id: "mara-ellison",
    name: "Mara Ellison",
    photo: face(15),
    position: "Line cook",
    department: "Kitchen",
    accountId: "northwind",
    locationId: "gastown",
    started: "Mar 4, 2023",
    employment: "Full-time",
  },
  {
    id: "desmond-park",
    name: "Desmond Park",
    photo: face(7),
    position: "Server",
    department: "Front of house",
    accountId: "northwind",
    locationId: "gastown",
    started: "Jun 19, 2024",
    employment: "Part-time",
  },
  {
    id: "alicia-reyes",
    name: "Alicia Reyes",
    photo: face(38),
    position: "Shift supervisor",
    department: "Front of house",
    accountId: "northwind",
    locationId: "yaletown",
    started: "Nov 2, 2021",
    employment: "Full-time",
  },
  {
    id: "priya-nandakumar",
    name: "Priya Nandakumar",
    photo: face(163),
    position: "Bartender",
    department: "Bar",
    accountId: "northwind",
    locationId: "yaletown",
    started: "Aug 30, 2022",
    employment: "Full-time",
  },
  {
    id: "tomas-bergeron",
    name: "Tomas Bergeron",
    photo: face(21),
    position: "Prep cook",
    department: "Kitchen",
    accountId: "northwind",
    locationId: "kitsilano",
    started: "Feb 12, 2025",
    employment: "Part-time",
  },
  {
    id: "dylan-okonkwo",
    name: "Dylan Okonkwo",
    photo: face(42),
    position: "Host",
    department: "Front of house",
    accountId: "northwind",
    locationId: "burnaby-heights",
    started: "May 6, 2024",
    employment: "Part-time",
  },
  {
    id: "sofia-delgado",
    name: "Sofia Delgado",
    photo: face(26),
    position: "Sous chef",
    department: "Kitchen",
    accountId: "northwind",
    locationId: "beltline",
    started: "Jan 15, 2023",
    employment: "Full-time",
  },
  {
    id: "noah-fitzgerald",
    name: "Noah Fitzgerald",
    photo: face(24),
    position: "Server",
    department: "Front of house",
    accountId: "northwind",
    locationId: "banff",
    started: "Jul 22, 2024",
    employment: "Full-time",
  },
  {
    id: "marisol-vega",
    name: "Marisol Vega",
    photo: face(123),
    position: "Barista",
    department: "Front of house",
    accountId: "blue-fig",
    locationId: "pearl",
    started: "Apr 8, 2022",
    employment: "Full-time",
  },
  {
    id: "theo-brandt",
    name: "Theo Brandt",
    photo: face(22),
    position: "Baker",
    department: "Kitchen",
    accountId: "blue-fig",
    locationId: "pearl",
    started: "Sep 1, 2023",
    employment: "Full-time",
  },
  {
    id: "imani-sowande",
    name: "Imani Sowande",
    photo: face(31),
    position: "Shift lead",
    department: "Front of house",
    accountId: "blue-fig",
    locationId: "hawthorne",
    started: "Feb 2, 2021",
    employment: "Full-time",
  },
  {
    id: "jonah-weiss",
    name: "Jonah Weiss",
    photo: face(3),
    position: "Barista",
    department: "Front of house",
    accountId: "blue-fig",
    locationId: "capitol-hill",
    started: "Jun 24, 2025",
    employment: "Part-time",
  },
  {
    id: "camille-okafor",
    name: "Camille Okafor",
    photo: face(36),
    position: "Pastry cook",
    department: "Kitchen",
    accountId: "blue-fig",
    locationId: "ballard",
    started: "Mar 17, 2024",
    employment: "Part-time",
  },
  {
    id: "kwame-mensah",
    name: "Kwame Mensah",
    photo: face(159),
    position: "Brewer",
    department: "Production",
    accountId: "harbourline",
    locationId: "victoria-harbour",
    started: "Oct 11, 2021",
    employment: "Full-time",
  },
  {
    id: "beatrix-hollins",
    name: "Beatrix Hollins",
    photo: face(16),
    position: "Taproom server",
    department: "Taproom",
    accountId: "harbourline",
    locationId: "victoria-harbour",
    started: "Jul 5, 2023",
    employment: "Part-time",
  },
  {
    id: "freya-lindholm",
    name: "Freya Lindholm",
    photo: face(150),
    position: "Cellar hand",
    department: "Production",
    accountId: "harbourline",
    locationId: "langford",
    started: "Jan 8, 2025",
    employment: "Full-time",
  },
];

const onboarding: OnboardingEmployee[] = [
  {
    id: "jules-whitfield",
    name: "Jules Whitfield",
    photo: face(29),
    position: "Dishwasher",
    department: "Kitchen",
    accountId: "northwind",
    locationId: "gastown",
    starts: "Oct 20, 2026",
    progress: "3 of 6 steps",
    status: "Forms pending",
  },
  {
    id: "nora-vasquez",
    name: "Nora Vasquez",
    photo: face(164),
    position: "Server",
    department: "Front of house",
    accountId: "northwind",
    locationId: "kitsilano",
    starts: "Oct 13, 2026",
    progress: "6 of 6 steps",
    status: "Ready to start",
  },
  {
    id: "henry-oyelaran",
    name: "Henry Oyelaran",
    photo: face(169),
    position: "Line cook",
    department: "Kitchen",
    accountId: "northwind",
    locationId: "banff",
    starts: "Nov 3, 2026",
    progress: "1 of 6 steps",
    status: "Invite sent",
  },
  {
    id: "anaya-bhatt",
    name: "Anaya Bhatt",
    photo: face(155),
    position: "Dishwasher",
    department: "Kitchen",
    accountId: "blue-fig",
    locationId: "hawthorne",
    starts: "Oct 19, 2026",
    progress: "6 of 6 steps",
    status: "Ready to start",
  },
  {
    id: "rhys-donnelly",
    name: "Rhys Donnelly",
    photo: face(20),
    position: "Barista",
    department: "Front of house",
    accountId: "blue-fig",
    locationId: "ballard",
    starts: "Oct 27, 2026",
    progress: "2 of 6 steps",
    status: "Forms pending",
  },
  {
    id: "dov-alderman",
    name: "Dov Alderman",
    photo: face(25),
    position: "Taproom server",
    department: "Taproom",
    accountId: "harbourline",
    locationId: "langford",
    starts: "Nov 10, 2026",
    progress: "1 of 6 steps",
    status: "Invite sent",
  },
];

const onLeave: OnLeaveEmployee[] = [
  {
    id: "cassandra-liu",
    name: "Cassandra Liu",
    photo: face(9),
    position: "Sous chef",
    department: "Kitchen",
    accountId: "northwind",
    locationId: "yaletown",
    type: "Parental",
    dates: "Aug 1 – Dec 19, 2026",
    returns: "Dec 21, 2026",
  },
  {
    id: "ethan-caldwell",
    name: "Ethan Caldwell",
    photo: face(37),
    position: "Server",
    department: "Front of house",
    accountId: "northwind",
    locationId: "burnaby-heights",
    type: "Medical",
    dates: "Sep 28 – Oct 26, 2026",
    returns: "Oct 27, 2026",
  },
  {
    id: "rosa-marchetti",
    name: "Rosa Marchetti",
    photo: face(10),
    position: "Host",
    department: "Front of house",
    accountId: "northwind",
    locationId: "gastown",
    type: "Unpaid",
    dates: "Oct 5 – Nov 2, 2026",
    returns: "Nov 3, 2026",
  },
  {
    id: "gregor-pavlik",
    name: "Gregor Pavlik",
    photo: face(2),
    position: "Baker",
    department: "Kitchen",
    accountId: "blue-fig",
    locationId: "capitol-hill",
    type: "Medical",
    dates: "Sep 14 – Nov 9, 2026",
    returns: "Nov 10, 2026",
  },
  {
    id: "saoirse-bell",
    name: "Saoirse Bell",
    photo: face(1),
    position: "Brewer",
    department: "Production",
    accountId: "harbourline",
    locationId: "langford",
    type: "Parental",
    dates: "Jun 1, 2026 – Jan 15, 2027",
    returns: "Jan 18, 2027",
  },
];

const offboarding: OffboardingEmployee[] = [
  {
    id: "bram-castellanos",
    name: "Bram Castellanos",
    photo: face(44),
    position: "Line cook",
    department: "Kitchen",
    accountId: "northwind",
    locationId: "kitsilano",
    lastDay: "Oct 17, 2026",
    progress: "5 of 5 steps",
    status: "Ready to close",
  },
  {
    id: "elena-marsh",
    name: "Elena Marsh",
    photo: face(11),
    position: "Server",
    department: "Front of house",
    accountId: "northwind",
    locationId: "gastown",
    lastDay: "Oct 23, 2026",
    progress: "4 of 5 steps",
    status: "Equipment pending",
  },
  {
    id: "opal-renner",
    name: "Opal Renner",
    photo: face(17),
    position: "Host",
    department: "Front of house",
    accountId: "northwind",
    locationId: "banff",
    lastDay: "Nov 6, 2026",
    progress: "1 of 5 steps",
    status: "Exit interview booked",
  },
  {
    id: "soren-daugaard",
    name: "Soren Daugaard",
    photo: face(33),
    position: "Barista",
    department: "Front of house",
    accountId: "blue-fig",
    locationId: "capitol-hill",
    lastDay: "Oct 30, 2026",
    progress: "2 of 5 steps",
    status: "Final pay pending",
  },
  {
    id: "nadia-hourani",
    name: "Nadia Hourani",
    photo: face(128),
    position: "Taproom server",
    department: "Taproom",
    accountId: "harbourline",
    locationId: "victoria-harbour",
    lastDay: "Oct 19, 2026",
    progress: "5 of 5 steps",
    status: "Ready to close",
  },
];

const inactive: InactiveEmployee[] = [
  {
    id: "gavin-turnbull",
    name: "Gavin Turnbull",
    photo: face(23),
    position: "Line cook",
    department: "Kitchen",
    accountId: "northwind",
    locationId: "beltline",
    lastDay: "Jul 11, 2026",
    reason: "Resigned",
  },
  {
    id: "simone-adeyemi",
    name: "Simone Adeyemi",
    photo: face(143),
    position: "Bartender",
    department: "Bar",
    accountId: "northwind",
    locationId: "yaletown",
    lastDay: "Apr 2, 2026",
    reason: "Seasonal end",
  },
  {
    id: "luca-fontaine",
    name: "Luca Fontaine",
    photo: face(5),
    position: "Busser",
    department: "Front of house",
    accountId: "northwind",
    locationId: "kitsilano",
    lastDay: "Jan 19, 2026",
    reason: "Terminated",
  },
  {
    id: "harriet-lindqvist",
    name: "Harriet Lindqvist",
    photo: face(179),
    position: "Barista",
    department: "Front of house",
    accountId: "blue-fig",
    locationId: "pearl",
    lastDay: "May 29, 2026",
    reason: "Resigned",
  },
  {
    id: "milo-arrington",
    name: "Milo Arrington",
    photo: face(27),
    position: "Shift lead",
    department: "Front of house",
    accountId: "blue-fig",
    locationId: "hawthorne",
    lastDay: "Feb 6, 2026",
    reason: "Seasonal end",
  },
  {
    id: "vance-pritchard",
    name: "Vance Pritchard",
    photo: face(4),
    position: "Cellar hand",
    department: "Production",
    accountId: "harbourline",
    locationId: "victoria-harbour",
    lastDay: "Mar 20, 2026",
    reason: "Resigned",
  },
];

/**
 * Everyone the page should be looking at: the company's whole roster, or just
 * the one location when the app is pointed at one. The company is matched
 * first because location ids are only unique within a company -- two companies
 * can both run a Gastown, and only one of them employs these people.
 *
 * Each row comes back filled out -- its record, its location by name, its
 * status -- so the page and its filters work in whole employees rather than
 * having to look the rest up a field at a time.
 */
export function rosterFor(account: Account, location: Location | null) {
  const inScope = (employee: Person) =>
    employee.accountId === account.id &&
    (location === null || employee.locationId === location.id);

  const names = new Map(account.locations.map((item) => [item.id, item.name]));

  const fill = <T extends Person>(rows: T[], status: string) =>
    rows.filter(inScope).map((row) => ({
      ...row,
      ...recordFor(row),
      location: names.get(row.locationId) ?? "—",
      status,
    }));

  const filled = {
    active: fill(active, "Active"),
    onboarding: fill(onboarding, "Onboarding"),
    offboarding: fill(offboarding, "Offboarding"),
    onLeave: fill(onLeave, "On leave"),
    inactive: fill(inactive, "Inactive"),
  };

  return {
    ...filled,
    /* The All tab is the five lists in one, so it stays in step with them
       rather than carrying its own copy of everyone. Sorted by name, since
       without a status to group by the only useful order is alphabetical. */
    all: Object.values(filled)
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}
