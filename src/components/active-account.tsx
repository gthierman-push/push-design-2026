import * as React from "react";

import type { Account, Location } from "@components/accounts";
import { accounts } from "@components/accounts";

/**
 * Which company and location the app is pointed at. It lives above the
 * sidebar because more than one thing switches it: the account switcher in
 * the header, and the command palette right below it.
 */
type ActiveAccountValue = {
  account: Account;
  /** null is the company-wide view -- every location the company runs. */
  location: Location | null;
  /**
   * Point the app somewhere. The company comes along with the location so a
   * location can be picked out of a company that is not open yet, which is
   * how the palette gets there in one keystroke.
   */
  select: (account: Account, location?: Location | null) => void;
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

export function ActiveAccountProvider({ children }: React.PropsWithChildren) {
  const [accountId, setAccountId] = React.useState(accounts[0].id);
  const [locationId, setLocationId] = React.useState<string | null>(null);

  /** Ids, not objects, so the state survives the data being refetched. */
  const account = accounts.find((item) => item.id === accountId)!;
  const location =
    account.locations.find((item) => item.id === locationId) ?? null;

  const value = React.useMemo<ActiveAccountValue>(
    () => ({
      account,
      location,
      select: (next, nextLocation = null) => {
        setAccountId(next.id);
        setLocationId(nextLocation?.id ?? null);
      },
    }),
    [account, location],
  );

  return (
    <ActiveAccountContext.Provider value={value}>
      {children}
    </ActiveAccountContext.Provider>
  );
}
