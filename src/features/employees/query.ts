/**
 * What the roster can be asked. One list of fields -- the roster's own columns
 * and the paperwork behind them -- and a small set of conditions over them.
 *
 * The same list does three jobs: it evaluates a filter against a row, it
 * writes the chips the filter shows as, and it is handed to Claude as the
 * vocabulary a prompt has to come back in. Adding a field here teaches the
 * A.I. filter about it without touching the prompt or the UI.
 */

import { format, isValid, parseISO } from "date-fns";

import { today } from "./records";
import type { Employee } from "./roster";

/** The kinds of value a field holds, which is what decides what can be asked
 *  of it: a department can only be one of a list, a date can be compared. */
export type FieldKind = "text" | "enum" | "date" | "number";

export type Field = {
  key: string;
  label: string;
  kind: FieldKind;
  /** What it means, in the words the model is given. */
  note: string;
  read: (employee: Employee) => string | number | null;
  /** How a number reads once it is on a chip: "$21.50", "40 hrs". */
  write?: (value: number) => string;
  /** True where a row can simply not have one, which is a thing to ask about. */
  optional?: boolean;
};

const money = (value: number) => `$${value.toFixed(2)}`;

export const fields: Field[] = [
  {
    key: "name",
    label: "Name",
    kind: "text",
    note: "The employee's full name.",
    read: (employee) => employee.name,
  },
  {
    key: "position",
    label: "Position",
    kind: "enum",
    note: "Job title.",
    read: (employee) => employee.position,
  },
  {
    key: "department",
    label: "Department",
    kind: "enum",
    note: "Which part of the business they work in.",
    read: (employee) => employee.department,
  },
  {
    key: "location",
    label: "Location",
    kind: "enum",
    note: "The site they are based at.",
    read: (employee) => employee.location,
  },
  {
    key: "status",
    label: "Status",
    kind: "enum",
    note: "Where they are in their time with the company.",
    read: (employee) => employee.status,
  },
  {
    key: "employment",
    label: "Employment",
    kind: "enum",
    note: "Full-time or part-time.",
    read: (employee) => employee.employment,
  },
  {
    key: "wage",
    label: "Wage",
    kind: "number",
    note: "Hourly rate in dollars.",
    read: (employee) => employee.wage,
    write: money,
  },
  {
    key: "weeklyHours",
    label: "Weekly hours",
    kind: "number",
    note: "Hours a week they are scheduled for. Over 40 is overtime.",
    read: (employee) => employee.weeklyHours,
    write: (value) => `${value} hrs`,
  },
  {
    key: "age",
    label: "Age",
    kind: "number",
    note: "Age in years. Under 19 cannot serve liquor in British Columbia.",
    read: (employee) => employee.age,
  },
  {
    key: "hiredOn",
    label: "Hired",
    kind: "date",
    note: "The day they started, or are due to start. Tenure is measured from here.",
    read: (employee) => employee.hiredOn,
  },
  {
    key: "permitStatus",
    label: "Right to work",
    kind: "enum",
    note: "Citizen, Permanent resident, Work permit or Study permit.",
    read: (employee) => employee.permitStatus,
  },
  {
    key: "permitExpires",
    label: "Permit expiry",
    kind: "date",
    note: "When their work or study permit runs out. Not set for citizens and permanent residents, who have no expiry.",
    read: (employee) => employee.permitExpires,
    optional: true,
  },
  {
    key: "foodSafeExpires",
    label: "FoodSafe expiry",
    kind: "date",
    note: "When their food safety certificate lapses. Not set for roles that do not need one. A date in the past means it has already lapsed.",
    read: (employee) => employee.foodSafeExpires,
    optional: true,
  },
  {
    key: "servingItRightExpires",
    label: "Serving It Right expiry",
    kind: "date",
    note: "When their liquor service certificate lapses. Not set for roles that do not pour. A date in the past means it has already lapsed.",
    read: (employee) => employee.servingItRightExpires,
    optional: true,
  },
  {
    key: "timeOffDays",
    label: "Time off banked",
    kind: "number",
    note: "Days of time off accrued and not yet taken.",
    read: (employee) => employee.timeOffDays,
    write: (value) => `${value} days`,
  },
  {
    key: "lastReviewOn",
    label: "Last review",
    kind: "date",
    note: "When they were last reviewed. Not set for anyone never reviewed.",
    read: (employee) => employee.lastReviewOn,
    optional: true,
  },
  {
    key: "rating",
    label: "Rating",
    kind: "number",
    note: "Their last review score, 1 to 5. Not set for anyone never reviewed.",
    read: (employee) => employee.rating,
    write: (value) => `${value} of 5`,
    optional: true,
  },
];

export const fieldFor = (key: string) =>
  fields.find((field) => field.key === key);

/** A field narrowed one way. Filters narrow together: a row has to clear all
 *  of them, which is how anybody reads a list of conditions. */
export type Condition =
  | { field: string; op: "is" | "is not"; values: string[] }
  | { field: string; op: "contains"; text: string }
  | { field: string; op: "before" | "after"; date: string }
  | { field: string; op: "between"; from: string; to: string }
  | { field: string; op: "at least" | "at most"; value: number }
  | { field: string; op: "is set" | "is not set" };

/** Which conditions suit which kind of field. */
const allowed: Record<FieldKind, Condition["op"][]> = {
  text: ["contains", "is", "is not"],
  enum: ["is", "is not", "is set", "is not set"],
  date: ["before", "after", "between", "is set", "is not set"],
  number: ["at least", "at most", "is set", "is not set"],
};

/** Every value the roster actually uses for a field, so a menu never offers
 *  an empty one and the model is never told about a department nobody is in. */
export function optionsFor(employees: Employee[]) {
  const options: { [key: string]: string[] } = {};

  for (const field of fields) {
    if (field.kind !== "enum") continue;

    options[field.key] = [
      ...new Set(
        employees
          .map((employee) => field.read(employee))
          .filter((value): value is string => typeof value === "string"),
      ),
    ].sort((a, b) => a.localeCompare(b));
  }

  return options;
}

export type Options = ReturnType<typeof optionsFor>;

const date = (value: string | number | null) =>
  typeof value === "string" ? parseISO(value) : null;

/** Whether one row clears one condition. A field a row has nothing in fails
 *  every test but "is not set" -- an empty permit date is not before a date. */
function clears(employee: Employee, condition: Condition) {
  const field = fieldFor(condition.field);
  if (!field) return true;

  const value = field.read(employee);

  switch (condition.op) {
    case "is set":
      return value !== null && value !== "";
    case "is not set":
      return value === null || value === "";
    case "is":
      return condition.values.some(
        (option) => String(value).toLowerCase() === option.toLowerCase(),
      );
    case "is not":
      return !condition.values.some(
        (option) => String(value).toLowerCase() === option.toLowerCase(),
      );
    case "contains":
      return String(value ?? "")
        .toLowerCase()
        .includes(condition.text.toLowerCase());
    case "before":
      return (
        (date(value)?.getTime() ?? Infinity) <
        parseISO(condition.date).getTime()
      );
    case "after":
      return (
        (date(value)?.getTime() ?? -Infinity) >
        parseISO(condition.date).getTime()
      );
    case "between": {
      const at = date(value)?.getTime();
      return (
        at !== undefined &&
        at >= parseISO(condition.from).getTime() &&
        at <= parseISO(condition.to).getTime()
      );
    }
    case "at least":
      return typeof value === "number" && value >= condition.value;
    case "at most":
      return typeof value === "number" && value <= condition.value;
  }
}

/** Filters narrow together: an employee has to clear every one of them. */
export const matchesQuery = (employee: Employee, conditions: Condition[]) =>
  conditions.every((condition) => clears(employee, condition));

const day = (value: string) => format(parseISO(value), "MMM d, yyyy");

/** How a condition reads on its chip: an operator and what follows it, so the
 *  chip is a sentence -- Permit expiry is between Oct 13 and Jan 13. A list
 *  of values keeps its count apart from its summary, so a long first value
 *  is what truncates and the +2 after it survives. */
export const phrase = (condition: Condition) => ({
  more: 0,
  ...said(condition),
});

function said(condition: Condition) {
  const field = fieldFor(condition.field);
  const write = (value: number) =>
    field?.write ? field.write(value) : String(value);

  switch (condition.op) {
    case "is":
    case "is not":
      /* The one picked first, and a count of the rest. "3 of them" says
         nothing about who any of them are; Bartender, +2 names one. */
      return {
        operator: condition.op,
        summary: condition.values[0] ?? "",
        more: condition.values.length - 1,
      };
    case "contains":
      return { operator: "contains", summary: condition.text };
    case "before":
      return { operator: "is before", summary: day(condition.date) };
    case "after":
      return { operator: "is after", summary: day(condition.date) };
    case "between":
      return {
        operator: "is between",
        summary: `${format(parseISO(condition.from), "MMM d")} and ${day(condition.to)}`,
      };
    case "at least":
      return { operator: "is at least", summary: write(condition.value) };
    case "at most":
      return { operator: "is at most", summary: write(condition.value) };
    case "is set":
      return { operator: "is", summary: "on file" };
    case "is not set":
      return { operator: "is", summary: "not on file" };
  }
}

/** A field's value on one row, as a cell would put it: a date written out, a
 *  wage with its dollars, and a dash where there is nothing on file. */
export function display(field: Field, employee: Employee) {
  const value = field.read(employee);

  if (value === null || value === "") return "—";
  if (field.kind === "date") return day(String(value));

  return typeof value === "number" && field.write
    ? field.write(value)
    : String(value);
}

/** A whole filter in one line: what the toast reads back, and what a saved
 *  view is named after when nobody types a name. */
export const readout = (conditions: Condition[]) =>
  conditions
    .map((condition) => {
      const { operator, summary, more } = phrase(condition);
      const values = more > 0 ? `${summary}, +${more}` : summary;
      return `${fieldFor(condition.field)?.label} ${operator} ${values}`;
    })
    .join(", ");

const isDay = (value: unknown) =>
  typeof value === "string" && isValid(parseISO(value));

/**
 * What came back, kept only where it makes sense. Claude is given the field
 * list and the operators, but a model that invents a field, misspells a
 * department or asks a date question of a wage would otherwise filter the
 * table down to nothing with no way to see why.
 */
export function readConditions(input: unknown, options: Options): Condition[] {
  if (!Array.isArray(input)) return [];

  return input.flatMap((raw): Condition[] => {
    if (typeof raw !== "object" || raw === null) return [];

    const { field: key, op } = raw as { field?: unknown; op?: unknown };
    const field = typeof key === "string" ? fieldFor(key) : undefined;

    if (!field || typeof op !== "string") return [];
    if (!(allowed[field.kind] as string[]).includes(op)) return [];

    const condition = raw as Record<string, unknown>;

    switch (op) {
      case "is":
      case "is not": {
        const values = Array.isArray(condition.values) ? condition.values : [];
        /* Back to the roster's own spelling: a model answering "kitchen"
           should still tick Kitchen. */
        const known = (options[field.key] ?? []).filter((option) =>
          values.some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase() === option.toLowerCase(),
          ),
        );

        if (field.kind === "text") {
          return values.every((value) => typeof value === "string")
            ? [{ field: field.key, op, values: values as string[] }]
            : [];
        }

        return known.length > 0
          ? [{ field: field.key, op, values: known }]
          : [];
      }
      case "contains":
        return typeof condition.text === "string" && condition.text !== ""
          ? [{ field: field.key, op, text: condition.text }]
          : [];
      case "before":
      case "after":
        return isDay(condition.date)
          ? [{ field: field.key, op, date: condition.date as string }]
          : [];
      case "between":
        return isDay(condition.from) && isDay(condition.to)
          ? [
              {
                field: field.key,
                op,
                from: condition.from as string,
                to: condition.to as string,
              },
            ]
          : [];
      case "at least":
      case "at most":
        return typeof condition.value === "number"
          ? [{ field: field.key, op, value: condition.value }]
          : [];
      case "is set":
      case "is not set":
        return [{ field: field.key, op }];
      default:
        return [];
    }
  });
}

/**
 * The vocabulary, written out for the model: every field, what it holds, and
 * -- for the ones with a fixed set of values -- this roster's own spellings.
 * Generated from the list above rather than written beside it, so the prompt
 * cannot drift from what the page can actually evaluate.
 */
export function vocabulary(options: Options) {
  const lines = fields.map((field) => {
    const values = options[field.key];
    const kind =
      field.kind === "enum" && values?.length
        ? `enum, one of: ${values.join(" | ")}`
        : field.kind;

    return `- ${field.key} (${kind})${field.optional ? ", may be unset" : ""}: ${field.note}`;
  });

  return lines.join("\n");
}

/** The operators, by the kind of field they can be used on. */
export const operators = Object.entries(allowed)
  .map(([kind, ops]) => `- ${kind}: ${ops.join(", ")}`)
  .join("\n");

/** Today, as the model needs to be told it, since every "next three months"
 *  is measured from it. */
export const asOf = () => format(today(), "yyyy-MM-dd (EEEE d MMMM yyyy)");
