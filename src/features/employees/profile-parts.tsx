/**
 * The small pieces every part of a profile is built from: a tint, a labelled
 * value, and the two badges the page says a state with. They sit here rather
 * than in the page because the tabs under it draw the same ones.
 */

import type { ReactNode } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { cn } from "cn";

import { Badge } from "@components/ui/badge";

import { today } from "./records";

/**
 * The colours a profile reads a state in. Only destructive ships a tint of
 * its own, so the rest follow the shape the Badge page sets out: a light pair
 * for light mode, a dark pair for dark.
 */
export const tint = {
  good: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  warn: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  info: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
};

/** An ISO date as the page writes one. */
export const day = (value: string) => format(parseISO(value), "MMM d, yyyy");

/** Days from today to an ISO date; negative once it is behind us. */
export const daysUntil = (value: string) =>
  differenceInCalendarDays(parseISO(value), today());

/**
 * A card's worth of labelled values, each on its own ruled line. The label
 * holds the left and the value the right, which is what lets a column of them
 * be read down either side.
 */
export function DetailList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <dl className={cn("flex flex-col", className)}>{children}</dl>;
}

export function Detail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2 not-last:border-b">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className="min-w-0 overflow-hidden text-right font-medium">
        {children}
      </dd>
    </div>
  );
}

/**
 * A field nobody filled in. A dash rather than an empty cell, so a row that
 * is blank because there is nothing to say reads differently from one that
 * failed to load -- and the words go to a screen reader, which would
 * otherwise be read a punctuation mark or nothing at all.
 */
export function Unset() {
  return (
    <span className="text-muted-foreground font-normal">
      <span aria-hidden>-</span>
      <span className="sr-only">Not set</span>
    </span>
  );
}

/** Where someone is in their time with the company, in one pill. Active is
 *  the quiet case and everything else is something to notice, so only Active
 *  and Inactive go untinted. */
export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const variant = status === "Offboarding" ? "destructive" : "secondary";

  const tinted =
    status === "Active"
      ? tint.good
      : status === "Onboarding"
        ? tint.info
        : status === "On leave"
          ? tint.warn
          : undefined;

  return (
    <Badge variant={variant} className={cn(tinted, className)}>
      {status}
    </Badge>
  );
}

/**
 * A permit or a certificate, said as what its date means rather than as the
 * date alone: lapsed, running out, or good for a while yet. Two months is the
 * warning, which is about how long a renewal takes to come back.
 *
 * `required` is false for the certificates a role does not need, where no
 * date on file is the right answer rather than a gap in one.
 */
export function Expiry({
  expires,
  required = true,
}: {
  expires: string | null;
  required?: boolean;
}) {
  if (!expires) {
    return required ? (
      <Badge variant="outline">None on file</Badge>
    ) : (
      <Badge variant="outline" className="text-muted-foreground border-dashed">
        Not required
      </Badge>
    );
  }

  const days = daysUntil(expires);

  if (days < 0) {
    return <Badge variant="destructive">Lapsed {day(expires)}</Badge>;
  }

  return (
    <Badge
      variant="secondary"
      className={days <= 60 ? tint.warn : tint.good}
      title={`${days} days`}
    >
      {days <= 60 ? "Expires" : "Valid to"} {day(expires)}
    </Badge>
  );
}
