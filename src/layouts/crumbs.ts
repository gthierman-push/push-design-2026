import type { ReactNode } from "react";
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

/**
 * What a record says about itself beside its name -- the badges on an
 * employee, say. It is handed the same context the crumb is, for the same
 * reason: the record is looked up in the company the app is pointed at, and
 * a record that is not there shows nothing rather than an empty pill.
 */
export type Marks = (context: {
  params: Params;
  account: Account;
}) => ReactNode;

/** What a route may put in `handle` for the header to read. */
export type RouteHandle = { crumb?: Crumb; marks?: Marks };

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

/** The badges the matched routes hang off the end of the trail. Shaped like
 *  `crumbsFor`, and empty on every page that does not set any. */
export function marksFor(matches: UIMatch[], account: Account): ReactNode[] {
  return matches
    .map((match) =>
      (match.handle as RouteHandle | undefined)?.marks?.({
        params: match.params,
        account,
      }),
    )
    .filter(Boolean);
}
