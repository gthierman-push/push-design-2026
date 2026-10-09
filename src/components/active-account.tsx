import * as React from "react";

import type { Account, Location } from "@components/accounts";
import { accounts as seedAccounts } from "@components/accounts";

/**
 * Which company and location the app is pointed at. It lives above the
 * sidebar because more than one thing switches it: the account switcher in
 * the header, and the command palette right below it.
 */
type ActiveAccountValue = {
  /**
   * Every company the user can switch between. It comes from here rather
   * than straight off the stub data because locations can be added, and the
   * switcher and the palette both have to see the new one.
   */
  accounts: Account[];
  account: Account;
  /** null is the company-wide view -- every location the company runs. */
  location: Location | null;
  /**
   * Point the app somewhere. The company comes along with the location so a
   * location can be picked out of a company that is not open yet, which is
   * how the palette gets there in one keystroke.
   */
  select: (account: Account, location?: Location | null) => void;
  /** Open a location under a company. Returns it, so the caller can point
      the app at what it just created. */
  addLocation: (account: Account, draft: Omit<Location, "id">) => Location;
};

const ActiveAccountContext = React.createContext<ActiveAccountValue | null>(
  null,
);

export function useActiveAccount() {
  const context = React.useContext(ActiveAccountContext);
  if (!context) {
    throw new Error(
      "useActiveAccount must be used within an ActiveAccountProvider.",
    );
  }
  return context;
}

/** A readable id from the location's name, kept unique within the company so
 *  two locations named the same way never collide. */
function nextLocationId(account: Account, name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "location";

  let id = base;
  for (let n = 2; account.locations.some((item) => item.id === id); n += 1) {
    id = `${base}-${n}`;
  }
  return id;
}

export function ActiveAccountProvider({ children }: React.PropsWithChildren) {
  const [accounts, setAccounts] = React.useState(seedAccounts);
  const [accountId, setAccountId] = React.useState(seedAccounts[0].id);
  const [locationId, setLocationId] = React.useState<string | null>(null);

  /** Ids, not objects, so the state survives the data being refetched. */
  const account = accounts.find((item) => item.id === accountId)!;
  const location =
    account.locations.find((item) => item.id === locationId) ?? null;

  const value = React.useMemo<ActiveAccountValue>(
    () => ({
      accounts,
      account,
      location,
      select: (next, nextLocation = null) => {
        setAccountId(next.id);
        setLocationId(nextLocation?.id ?? null);
      },
      addLocation: (target, draft) => {
        const added: Location = {
          ...draft,
          id: nextLocationId(target, draft.name),
        };

        setAccounts((current) =>
          current.map((item) =>
            item.id === target.id
              ? { ...item, locations: [...item.locations, added] }
              : item,
          ),
        );

        return added;
      },
    }),
    [accounts, account, location],
  );

  return (
    <ActiveAccountContext.Provider value={value}>
      {children}
    </ActiveAccountContext.Provider>
  );
}
