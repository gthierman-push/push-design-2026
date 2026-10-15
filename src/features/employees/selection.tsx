/**
 * Picking people off the roster, and the two things worth doing to several of
 * them at once.
 *
 * The row menu answers "what about this person"; the header answers "what
 * about these twelve". So it only carries what means something in the plural:
 * looking at a profile does not, taking a list of them away does, and ending
 * their time with the company does -- which is why that one asks first.
 *
 * The selection is whoever is ticked and on screen. Narrowing the table with
 * the search or the filters drops the people it hides, so the count in the
 * header and the rows a button acts on are never two different sets.
 */

import * as React from "react";
import { DownloadIcon, UserRoundCheckIcon, UserRoundXIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { toast } from "@components/ui/toast";

import type { Employee } from "./roster";

/** How many people an action is about, said the way a sentence would. */
const people = (count: number) =>
  `${count} ${count === 1 ? "employee" : "employees"}`;

/** Who a toast is about: one person by name, a pair by both names, and any
 *  more than that as "they" -- the title has already counted them, and a
 *  toast cannot hold a list. */
function them(rows: Employee[]) {
  if (rows.length === 1) return rows[0].name;
  if (rows.length === 2) return `${rows[0].name} and ${rows[1].name}`;
  return "They";
}

/**
 * Who is ticked, and the ways somebody joins them: their own box, an
 * alt-click that adds one person and leaves their neighbours alone, and a
 * shift-click that reaches back to the last one picked and takes everyone in
 * between.
 *
 * A range is measured over the rows as they stand -- this tab's, after the
 * search and the filters have had their say -- so it is the people you can
 * see between the two you clicked, never the ones something is hiding
 * between them.
 */
export type Selection = {
  has: (id: string) => boolean;
  /** Tick or untick one person, and make them where a range measures from. */
  toggle: (id: string) => void;
  /** Everyone from the last person ticked to this one. */
  extendTo: (id: string) => void;
  /** Whoever is named, and nobody else: the header's box, either way up. */
  set: (ids: string[]) => void;
  clear: () => void;
};

/** Where a range measures from: the last person ticked on their own, and who
 *  was already ticked when they were. Keeping the second is what lets a range
 *  run back over itself -- the people it no longer covers go back to however
 *  they were before it started, rather than being left behind ticked. */
type Anchor = { id: string; were: string[] };

export function useSelection(rows: Employee[]): {
  picked: string[];
  selection: Selection;
} {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [anchor, setAnchor] = React.useState<Anchor | null>(null);

  const ids = rows.map((row) => row.id);

  /* Anyone the view stops showing -- a tab switched away from, a search typed
     past them -- is let go of, so the count on the bar and the people a
     button acts on can never drift apart. Compared as a string: the rows are
     rebuilt every render, and only the names in them matter. */
  const onScreen = ids.join(" ");

  React.useEffect(() => {
    const here = onScreen.split(" ");

    setPicked((current) => {
      const kept = current.filter((id) => here.includes(id));
      return kept.length === current.length ? current : kept;
    });

    /* And a range cannot be measured from someone who is no longer there. */
    setAnchor((current) =>
      current === null || here.includes(current.id) ? current : null,
    );
  }, [onScreen]);

  const toggle = (id: string) => {
    const next = picked.includes(id)
      ? picked.filter((other) => other !== id)
      : [...picked, id];

    setPicked(next);
    setAnchor({ id, were: next });
  };

  const extendTo = (id: string) => {
    const start = anchor ? ids.indexOf(anchor.id) : -1;
    const end = ids.indexOf(id);

    /* Nothing to reach back to yet: the first shift-click is an ordinary
       click, and becomes the end the next one measures from. */
    if (anchor === null || start === -1 || end === -1) {
      toggle(id);
      return;
    }

    const between = ids.slice(Math.min(start, end), Math.max(start, end) + 1);

    setPicked([
      ...anchor.were.filter(
        (other) => ids.includes(other) && !between.includes(other),
      ),
      ...between,
    ]);
  };

  return {
    picked,
    selection: {
      has: (id) => picked.includes(id),
      toggle,
      extendTo,
      set: (next) => {
        setPicked(next);
        setAnchor(null);
      },
      clear: () => {
        setPicked([]);
        setAnchor(null);
      },
    },
  };
}

/** Whether the key that means "and everyone in between" was held down. */
const ranged = (event: Event) =>
  (event instanceof MouseEvent || event instanceof KeyboardEvent) &&
  event.shiftKey;

/** The header's tick: on when every row on the tab is picked, half-on while
 *  only some of them are, and off the moment it is clicked in either state --
 *  one box that both selects everything and gets you back out. */
export function SelectAll({
  rows,
  selection,
}: {
  rows: Employee[];
  selection: Selection;
}) {
  const ids = rows.map((row) => row.id);
  const count = ids.filter((id) => selection.has(id)).length;
  const every = count > 0 && count === ids.length;

  return (
    <Checkbox
      aria-label={
        every ? "Clear the selection" : "Select every employee on this tab"
      }
      checked={every}
      indeterminate={count > 0 && !every}
      disabled={rows.length === 0}
      onCheckedChange={(checked) => selection.set(checked ? ids : [])}
    />
  );
}

/** A row's own tick, named after the person so a screen reader says who it
 *  belongs to rather than "checkbox, checkbox, checkbox".
 *
 *  Shift means here what it means on the rows themselves: ticking one box and
 *  shift-ticking another further down is the oldest way there is of saying
 *  "these ones", and it works from the keyboard for the same reason. */
export function SelectRow({
  employee,
  selection,
}: {
  employee: Employee;
  selection: Selection;
}) {
  return (
    <Checkbox
      aria-label={`Select ${employee.name}`}
      checked={selection.has(employee.id)}
      onCheckedChange={(_, details) =>
        ranged(details.event)
          ? selection.extendTo(employee.id)
          : selection.toggle(employee.id)
      }
    />
  );
}

/** Ending several people's time at once is the one action here that cannot be
 *  taken back from the table, so it says who it is about and what happens to
 *  them before it will do it. */
function Deactivating({
  rows,
  skipped,
  open,
  onOpenChange,
  onConfirm,
}: {
  rows: Employee[];
  skipped: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <UserRoundXIcon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>Deactivate {people(rows.length)}?</AlertDialogTitle>
          <AlertDialogDescription>
            They lose access to Push today and come off the schedule. Their
            records, timesheets and pay history stay on file.
            {skipped > 0 &&
              ` The other ${skipped} are already inactive and stay as they are.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * What a selection can be done to, shown in place of the column headings the
 * moment anyone is ticked.
 *
 * The headings are what a table says when it is waiting to be read; these are
 * what it says when it is being worked on. Putting them in the same row keeps
 * the table from growing a band every time a box is ticked, and leaves the
 * actions beside the ticks that chose them.
 */
export function SelectionActions({
  chosen,
  onClear,
}: {
  chosen: Employee[];
  onClear: () => void;
}) {
  const [ending, setEnding] = React.useState(false);

  /* Deactivating only means anything for someone still working here, and
     reactivating only for someone who is not. A selection made on one tab is
     all one or all the other; only the All tab can mix them, and there the
     button follows the people it can actually act on. */
  const working = chosen.filter((employee) => employee.status !== "Inactive");

  return (
    <div className="flex items-center gap-2">
      {/* The buttons lead the row, where the headings they stand in for
          start, and the count trails them: what you are about to act on,
          read after what you can do to it. */}
      <div className="flex items-center gap-1">
        {/* The one that ends something leads, since it is what a selection is
            usually made for; taking a copy away follows it. */}
        {working.length === 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.add({
                type: "success",
                title: `Reactivated ${people(chosen.length)}`,
                description: `${them(chosen)} can sign in again, and go back on the schedule.`,
              });
              onClear();
            }}
          >
            <UserRoundCheckIcon data-icon="inline-start" />
            Reactivate
          </Button>
        ) : (
          /* Neutral like the rest: the row is a set of things that can be
             done, not a warning. The red comes later, on the dialog that
             actually ends someone's time here. */
          <Button variant="outline" size="sm" onClick={() => setEnding(true)}>
            <UserRoundXIcon data-icon="inline-start" />
            Deactivate
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.add({
              type: "info",
              title: `Exporting ${people(chosen.length)}`,
              description: "The file will download as soon as it is ready.",
            })
          }
        >
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>

        {/* Not something done to anybody -- the way back out of the selection,
            so it sits last, beside the count it empties. */}
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>

      <span>{people(chosen.length)} selected</span>

      <Deactivating
        rows={working}
        skipped={chosen.length - working.length}
        open={ending}
        onOpenChange={setEnding}
        onConfirm={() => {
          setEnding(false);
          toast.add({
            type: "success",
            title: `Deactivated ${people(working.length)}`,
            description: `${them(working)} lost access today. Their records stay on file.`,
          });
          onClear();
        }}
      />
    </div>
  );
}
