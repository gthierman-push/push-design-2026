/**
 * The companies the signed-in user can switch between, the locations each one
 * runs, and who the user is. Stub data, kept beside the switcher the way the
 * nav lists live beside the layouts: swap it for whatever an API hands back.
 */

export type Location = {
  id: string;
  name: string;
  /** The province or state the location is grouped under in the switcher. */
  region: string;
};

export type Account = {
  id: string;
  name: string;
  initials: string;
  /** Optional: without a logo the avatar falls back to the initials. */
  image?: string;
  locations: Location[];
};

export const accounts: Account[] = [
  {
    id: "northwind",
    name: "Northwind Hospitality",
    initials: "NH",
    locations: [
      { id: "gastown", name: "Gastown", region: "British Columbia" },
      { id: "yaletown", name: "Yaletown", region: "British Columbia" },
      { id: "kitsilano", name: "Kitsilano", region: "British Columbia" },
      {
        id: "burnaby-heights",
        name: "Burnaby Heights",
        region: "British Columbia",
      },
      { id: "beltline", name: "Calgary Beltline", region: "Alberta" },
      { id: "banff", name: "Banff Avenue", region: "Alberta" },
    ],
  },
  {
    id: "blue-fig",
    name: "Blue Fig Café Group",
    initials: "BF",
    locations: [
      { id: "pearl", name: "Pearl District", region: "Oregon" },
      { id: "hawthorne", name: "Hawthorne", region: "Oregon" },
      { id: "capitol-hill", name: "Capitol Hill", region: "Washington" },
      { id: "ballard", name: "Ballard", region: "Washington" },
    ],
  },
  {
    id: "harbourline",
    name: "Harbourline Brewing",
    initials: "HB",
    locations: [
      {
        id: "victoria-harbour",
        name: "Victoria Harbour",
        region: "British Columbia",
      },
      { id: "langford", name: "Langford", region: "British Columbia" },
    ],
  },
];

/**
 * A company's locations, bucketed by region. A Map keeps the regions in the
 * order the locations were authored in, so the list does not reshuffle.
 */
export function regionsOf(account: Account) {
  const regions = new Map<string, Location[]>();

  for (const location of account.locations) {
    const group = regions.get(location.region);
    if (group) group.push(location);
    else regions.set(location.region, [location]);
  }

  return [...regions].map(([region, locations]) => ({ region, locations }));
}

/** The session user, shown at the top of the switcher. */
export const currentUser = {
  name: "Alex Morgan",
  email: "alex@northwindhospitality.com",
};
