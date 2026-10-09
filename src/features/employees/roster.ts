/**
 * Who works where. Stub data, kept beside the feature the way the review
 * cycles sit beside Performance: swap it for whatever an API hands back.
 *
 * Every row names the company and the location it belongs to, so the page can
 * narrow to the location the app is pointed at -- and show the whole company
 * when it is pointed at all of them.
 */

import type { Account, Location } from "@components/accounts";

/** What every row on the page shares, whatever its status. */
export type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  accountId: string;
  locationId: string;
};

export type ActiveEmployee = Employee & {
  started: string;
  employment: "Full-time" | "Part-time";
};

export type OnboardingEmployee = Employee & {
  starts: string;
  progress: string;
  status: string;
};

export type OnLeaveEmployee = Employee & {
  type: string;
  dates: string;
  returns: string;
};

export type InactiveEmployee = Employee & {
  lastDay: string;
  reason: string;
};

const active: ActiveEmployee[] = [
  {
    id: "mara-ellison",
    name: "Mara Ellison",
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
    position: "Brewer",
    department: "Production",
    accountId: "harbourline",
    locationId: "langford",
    type: "Parental",
    dates: "Jun 1, 2026 – Jan 15, 2027",
    returns: "Jan 18, 2027",
  },
];

const inactive: InactiveEmployee[] = [
  {
    id: "gavin-turnbull",
    name: "Gavin Turnbull",
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
    position: "Cellar hand",
    department: "Production",
    accountId: "harbourline",
    locationId: "victoria-harbour",
    lastDay: "Mar 20, 2026",
    reason: "Resigned",
  },
];

/**
 * The All tab is the four status lists in one, so it stays in step with them
 * rather than carrying its own copy of everyone. Sorted by name, since without
 * a status to group by the only useful order is alphabetical.
 */
const all: (Employee & { status: string })[] = [
  ...active.map((employee) => ({ ...employee, status: "Active" })),
  ...onboarding.map((employee) => ({ ...employee, status: "Onboarding" })),
  ...onLeave.map((employee) => ({ ...employee, status: "On leave" })),
  ...inactive.map((employee) => ({ ...employee, status: "Inactive" })),
].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Everyone the page should be looking at: the company's whole roster, or just
 * the one location when the app is pointed at one. The company is matched
 * first because location ids are only unique within a company -- two companies
 * can both run a Gastown, and only one of them employs these people.
 */
export function rosterFor(account: Account, location: Location | null) {
  const inScope = (employee: Employee) =>
    employee.accountId === account.id &&
    (location === null || employee.locationId === location.id);

  return {
    active: active.filter(inScope),
    onboarding: onboarding.filter(inScope),
    onLeave: onLeave.filter(inScope),
    inactive: inactive.filter(inScope),
    all: all.filter(inScope),
  };
}
