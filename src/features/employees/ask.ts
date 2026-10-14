/**
 * Turning what somebody typed into conditions the roster can be filtered by.
 *
 * Two readers, same shape of answer. The first is Claude, through the dev
 * server's route -- it reads anything, and it is the one the feature is
 * actually about. The second is this file's own, for when there is no Claude
 * to ask: it knows the handful of shapes a demo reaches for -- a named
 * department, a certificate about to lapse, a number of hours -- and says so
 * plainly when a prompt is past it.
 *
 * Whatever answers, the page validates it before showing it: `readConditions`
 * drops anything that does not fit a field the roster actually has.
 */

import { addDays } from "date-fns";

import { iso, today } from "./records";
import {
  fieldFor,
  fields,
  readConditions,
  type Condition,
  type Options,
} from "./query";

export type Engine = "api" | "cli" | "none";

export type Answer = {
  conditions: Condition[];
  /** Fields the request asked to see rather than filter by. */
  columns: string[];
  summary: string;
  engine: Engine;
};

/* ------------------------------------------------------------------ words */

/** Plurals collapse so "cooks" reaches Line cook. A double s is left alone,
 *  so a Hostess stays one rather than becoming a Hostes. */
const singular = (word: string) =>
  word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word;

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean)
    .map(singular);

/** The noun a value ends on: Line cook and Prep cook are both cooks. */
const noun = (value: string) => words(value).slice(-1)[0];

/**
 * Which of a field's values a prompt names. A value named in full is the one
 * meant -- "front of house" is no way of asking for the back of it. Named by
 * its noun alone, the whole group is: "cooks" takes the line and the prep
 * alike, which only reads as generous on a job title, so only titles and
 * departments get it.
 */
function valuesNamed(options: string[], said: string[], byNoun: boolean) {
  const named = (value: string) =>
    words(value).every((word) => said.includes(word));

  if (!byNoun) return options.filter(named);

  const asked = options.filter((value) => said.includes(noun(value)));

  return asked.filter((value) => {
    const siblings = asked.filter((other) => noun(other) === noun(value));
    return siblings.some(named) ? named(value) : true;
  });
}

/* --------------------------------------------------------- reading it here */

/** How far out "the next three months" reaches, in days. */
function horizon(prompt: string) {
  const counts: { [word: string]: number } = {
    a: 1,
    an: 1,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    six: 6,
    nine: 9,
    twelve: 12,
  };
  const spans: { [word: string]: number } = {
    day: 1,
    week: 7,
    month: 30,
    year: 365,
    quarter: 91,
  };

  const match = prompt
    .toLowerCase()
    .match(
      /(?:next|within|in|coming|before)\s+(?:the\s+)?(\d+|a|an|one|two|three|four|six|nine|twelve)?\s*(day|week|month|year|quarter)/,
    );

  if (!match) return null;

  const [, count, span] = match;
  /* "next month" counts as one of them; "next 3 months" says how many. */
  const many = count ? (counts[count] ?? Number(count)) : 1;

  return (Number.isFinite(many) ? many : 1) * spans[span];
}

/** The date field a prompt is about, if it names one. */
function dateField(prompt: string) {
  const text = prompt.toLowerCase();

  if (/permit|visa|right to work|immigration/.test(text))
    return "permitExpires";
  if (/serving it right|liquor|alcohol|serving/.test(text))
    return "servingItRightExpires";
  if (/foodsafe|food safe|food handling|food safety|cert/.test(text))
    return "foodSafeExpires";
  if (/review/.test(text)) return "lastReviewOn";
  if (/hired|started|joined|tenure|anniversary/.test(text)) return "hiredOn";

  return null;
}

/** The number fields, and the words that mean one of them. */
const amounts: { field: string; words: RegExp; whole?: boolean }[] = [
  { field: "wage", words: /\$|wage|pay|rate|hour(ly)?\s+rate|earn/ },
  { field: "weeklyHours", words: /hour|hr|shift|overtime|schedul/ },
  { field: "age", words: /age|year.?old|minor|birthday|turn/, whole: true },
  { field: "timeOffDays", words: /time off|vacation|banked|accrued|holiday/ },
  { field: "rating", words: /rat(ed|ing)|star|score|perform/ },
];

/** Comparisons the roster can be asked for: "over 40 hours", "under $20". */
function comparisons(prompt: string): Condition[] {
  const text = prompt.toLowerCase();
  const found: Condition[] = [];

  const pattern =
    /(over|more than|above|at least|greater than|under|less than|below|fewer than|at most|up to)\s+\$?(\d+(?:\.\d+)?)/g;

  for (const match of text.matchAll(pattern)) {
    const [, comparison, digits] = match;
    const at = match.index ?? 0;
    /* What the number is counting is usually said right beside it. */
    const around = text.slice(Math.max(0, at - 30), at + digits.length + 30);
    const amount = amounts.find((item) => item.words.test(around));

    if (!amount) continue;

    const value = Number(digits);
    const upwards = /over|more|above|at least|greater/.test(comparison);

    /* "Over 40" and "40 or more" are the same list to anyone reading it off a
       roster, give or take the person sitting exactly on 40. */
    found.push(
      upwards
        ? { field: amount.field, op: "at least", value }
        : {
            field: amount.field,
            op: "at most",
            value: amount.whole ? value - 1 : value,
          },
    );
  }

  /* Overtime names its own threshold. */
  if (
    /overtime/.test(text) &&
    !found.some((item) => item.field === "weeklyHours")
  ) {
    found.push({ field: "weeklyHours", op: "at least", value: 41 });
  }

  return found;
}

/** The reader of last resort: what this file can make of a prompt on its own. */
function here(prompt: string, options: Options): Omit<Answer, "engine"> {
  const said = words(prompt);
  const text = prompt.toLowerCase();
  const now = today();
  const conditions: Condition[] = [];

  for (const field of fields) {
    if (field.kind !== "enum") continue;

    const values = valuesNamed(
      options[field.key] ?? [],
      said,
      field.key === "position" || field.key === "department",
    );

    if (values.length > 0) {
      conditions.push({ field: field.key, op: "is", values });
    }
  }

  const dated = dateField(prompt);
  const reach = horizon(prompt);

  if (dated) {
    const lapsed = /expired|lapsed|out of date|overdue/.test(text);
    const expiring = /expir|renew|lapse|run(s|ning)? out|due/.test(text);

    if (dated === "lastReviewOn" && /never|no review|not been/.test(text)) {
      conditions.push({ field: dated, op: "is not set" });
    } else if (dated === "lastReviewOn" && reach) {
      /* A review is the one date somebody asks about backwards: "nobody
         reviewed in a year" is a date before, not a window ahead. */
      conditions.push({
        field: dated,
        op: "before",
        date: iso(addDays(now, -reach)),
      });
    } else if (lapsed) {
      conditions.push({ field: dated, op: "before", date: iso(now) });
    } else if (expiring || reach) {
      conditions.push({
        field: dated,
        op: "between",
        from: iso(now),
        to: iso(addDays(now, reach ?? 90)),
      });
    }
  }

  /* "Hired in the last year" reads backwards too. */
  if (dated === "hiredOn" && reach && /last|past|since/.test(text)) {
    conditions.push({
      field: "hiredOn",
      op: "after",
      date: iso(addDays(now, -reach)),
    });
  }

  conditions.push(...comparisons(prompt));

  if (/never been reviewed|no review/.test(text)) {
    conditions.push({ field: "lastReviewOn", op: "is not set" });
  }

  return {
    conditions: readConditions(conditions, options),
    columns: [],
    summary:
      conditions.length > 0
        ? "Read here on the page, without Claude."
        : "Claude is not connected here, and that one is past what the page can read on its own.",
  };
}

/* ------------------------------------------------------------- asking out */

/** Which way out the dev server has, so the dialog can say so. */
export async function engine(): Promise<Engine> {
  try {
    const response = await fetch("/api/ai-filter");
    if (!response.ok) return "none";

    const { engine } = (await response.json()) as { engine: Engine };
    return engine;
  } catch {
    return "none";
  }
}

/**
 * The prompt, answered. Claude where there is one to ask -- the roster's own
 * values go along with the question, so it answers in this company's words
 * rather than in general ones -- and the page's own reading where there is
 * not.
 */
export async function ask(prompt: string, options: Options): Promise<Answer> {
  try {
    const response = await fetch("/api/ai-filter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt, options }),
    });

    if (!response.ok) throw new Error(String(response.status));

    const { engine, answer } = (await response.json()) as {
      engine: Engine;
      answer: { conditions?: unknown; columns?: unknown; summary?: unknown };
    };

    return {
      conditions: readConditions(answer.conditions, options),
      /* Only columns the page knows how to draw. */
      columns: (Array.isArray(answer.columns) ? answer.columns : []).filter(
        (key): key is string =>
          typeof key === "string" && Boolean(fieldFor(key)),
      ),
      summary:
        typeof answer.summary === "string" && answer.summary !== ""
          ? answer.summary
          : "Filtered.",
      engine,
    };
  } catch {
    return { ...here(prompt, options), engine: "none" };
  }
}

/** The prompts the dialog offers. All three are shapes the page can read on
 *  its own, so an example taken at face value works with or without Claude. */
export const examples = [
  "Work permits expiring in the next 3 months",
  "Anyone scheduled over 40 hours a week",
  "FoodSafe certificates that have lapsed",
];
