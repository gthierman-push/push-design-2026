/**
 * Who is on the floor right now. The one thing about a person that is
 * different between two looks at the same page, which is why it is drawn as
 * a dot on their face rather than said in words beside their name: you read
 * it without reading it, and it is gone by the next shift.
 *
 * Stub data like the roster, and generated the same way -- except that the
 * day is part of the seed rather than the id alone. Everyone is dealt the
 * shift their department would have given them today, and they are on it
 * while the hour is inside it. A dot lit at random would say nothing; this
 * one empties the building overnight, fills it for lunch and again for
 * dinner, and leaves the taproom on after the kitchen has gone home.
 */

import { subDays } from "date-fns";

import { startHourFor } from "./profile";
import { between, iso, stream, today } from "./records";
import type { Employee } from "./roster";

/** What deciding this takes: who they are, which part of the day their
 *  department works, and whether they are on the roster at all. */
type Rostered = Pick<Employee, "id" | "department" | "status">;

/**
 * The shift that day would have given them, as hours from its own midnight,
 * or null for a day off. Decimal and allowed past 24, so a taproom closing
 * at half one in the morning ends at 25.5 rather than before it began.
 */
function shiftOn(employee: Rostered, date: Date): [number, number] | null {
  const next = stream(`${employee.id}:on-shift:${iso(date)}`);

  /* Five days in seven, which is what a week looks like once the
     part-timers are in the same roster as everybody else. */
  if (next() > 0.68) return null;

  const start = startHourFor(employee.department, next);
  const hours = between(next, 8, 19) / 2;

  return [start, start + hours];
}

/**
 * Whether they are working this minute. Nobody onboarding, on leave, or off
 * the roster is: their status is the page's word for whether they work here
 * today, and only two of the five mean they might be holding a station.
 *
 * Yesterday's shift is asked about as well, because a close that ran past
 * midnight is still the shift somebody is standing in at one in the morning.
 */
export function onShiftNow(employee: Rostered) {
  if (employee.status !== "Active" && employee.status !== "Offboarding") {
    return false;
  }

  const now = today();
  const hour = now.getHours() + now.getMinutes() / 60;

  const holds = (shift: [number, number] | null, at: number) =>
    shift !== null && at >= shift[0] && at < shift[1];

  return (
    holds(shiftOn(employee, now), hour) ||
    holds(shiftOn(employee, subDays(now, 1)), hour + 24)
  );
}
