import type { Params, UIMatch } from "react-router";

import type { Account } from "@components/accounts";

/**
 * How a page one level down -- a profile, a record -- names itself in the
 * breadcrumb. The route carries one in its `handle`, and the header reads it
 * off the matched routes, so the bar never has to know which pages have
 * records behind them.
 *
 * It is handed the account as well as the url because the record is looked up
 * in the company the app is pointed at: the same id under another company is
 * nobody, and the crumb says nothing rather than the wrong name.
 */
export type Crumb = (context: {
  params: Params;
  account: Account;
}) => string | undefined;

/** What a route may put in `handle` for the header to read. */
export type RouteHandle = { crumb?: Crumb };

/**
 * The names the matched routes contribute, outermost first. A route without a
 * crumb, or one whose record is not there to name, adds nothing -- so a
 * profile opened at an id nobody has leaves the trail at the page above it.
 */
export function crumbsFor(matches: UIMatch[], account: Account): string[] {
  return matches
    .map((match) =>
      (match.handle as RouteHandle | undefined)?.crumb?.({
        params: match.params,
        account,
      }),
    )
    .filter((name): name is string => Boolean(name));
}
