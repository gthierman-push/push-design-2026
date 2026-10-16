/**
 * The roster's filters: a menu that adds one, a dialog that asks for one in
 * words, and the chips that show what the table is narrowed to. They work the
 * way Linear's do -- pick a field, tick the values, and the filter stays on
 * screen as something you can edit rather than a setting you have to reopen a
 * menu to remember.
 *
 * The menu reaches the fields with a fixed set of values, which is all a menu
 * can ever offer. Everything else on an employee's record -- when a permit
 * expires, what they are paid, how long since anyone reviewed them -- is
 * reachable only by asking for it, which is what the A.I. filter is for.
 */

import * as React from "react";
import {
  ActivityIcon,
  BookmarkIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  HashIcon,
  IdCardIcon,
  ListFilterIcon,
  MapPinIcon,
  UsersIcon,
  XIcon,
  ZapIcon,
  type IconComponent,
} from "@components/icons";

import { Button } from "@components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@components/ui/button-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Spinner } from "@components/ui/spinner";
import { Textarea } from "@components/ui/textarea";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuEmpty,
  ContextMenuFilterProvider,
  ContextMenuGroup,
  ContextMenuInput,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuList,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@components/ui/context-menu";

import { toast } from "@components/ui/toast";

import { ask, engine, examples, type Engine } from "./ask";
import {
  fieldFor,
  fields,
  phrase,
  type Condition,
  type Options,
} from "./query";

/** A set of conditions kept for next time, named after what it narrows to. */
export type SavedFilter = { name: string; conditions: Condition[] };

/** What each field looks like on a chip and in the menu. A field with no icon
 *  of its own takes the one for the kind of thing it holds. */
const icons: { [key: string]: IconComponent } = {
  position: BriefcaseIcon,
  department: UsersIcon,
  location: MapPinIcon,
  status: ActivityIcon,
  employment: ClockIcon,
  permitStatus: IdCardIcon,
};

function iconFor(key: string) {
  const field = fieldFor(key);
  return icons[key] ?? (field?.kind === "date" ? CalendarIcon : HashIcon);
}

const describe = (key: string) => fieldFor(key)!;

/** The fields a menu can offer: the ones whose values are a known list. */
const pickable = fields.filter((field) => field.kind === "enum");

/** What a field's values are called together, for the box that searches them. */
const plural = (label: string) => `${label.toLowerCase()}s`;

/** Ticking the last value off a field drops the filter rather than leaving a
 *  chip that matches everything. */
function withValues(
  conditions: Condition[],
  key: string,
  values: string[],
): Condition[] {
  if (values.length === 0) {
    return conditions.filter((condition) => condition.field !== key);
  }

  const next: Condition = { field: key, op: "is", values };

  return conditions.some((condition) => condition.field === key)
    ? conditions.map((condition) =>
        condition.field === key ? next : condition,
      )
    : [...conditions, next];
}

/** The values a field is currently ticked to, if it is ticked to any. */
const valuesOf = (conditions: Condition[], key: string) => {
  const found = conditions.find(
    (condition) => condition.field === key && condition.op === "is",
  );

  return found && "values" in found ? found.values : [];
};

/** A saved set is only offered where the roster can still satisfy it: a view
 *  built at one location would otherwise empty the table at the next. Only
 *  the ticked-value conditions can be checked that way; a date is a date
 *  wherever you are. */
const fits = (view: SavedFilter, options: Options) =>
  view.conditions.every((condition) =>
    "values" in condition
      ? condition.values.every((value) =>
          (options[condition.field] ?? [value]).includes(value),
        )
      : true,
  );

const toggle = (values: string[], value: string) =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

/**
 * A context menu opens on right click, and the toolbar wants these on a plain
 * left click. Re-firing the click as a contextmenu is all it takes: its
 * submenus, keyboard handling and ticking come along unchanged, and
 * right-clicking the button still works too.
 *
 * The menu anchors on the button rather than the cursor, the way a dropdown
 * would -- a toolbar control that opens somewhere slightly different on every
 * click is harder to aim at the second time. A context menu anchors to a
 * point, so the point is the button's bottom corner.
 */
function openOnClick(event: React.MouseEvent) {
  const trigger = event.currentTarget as HTMLElement;
  const rect = trigger.getBoundingClientRect();

  trigger.dispatchEvent(
    new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: rect.left,
      clientY: rect.bottom,
    }),
  );
}

/**
 * A field's values, ticked or not: the same rows in the menu that adds a
 * filter and in the chip that shows it, so editing one is the same gesture as
 * making it. Checkbox items leave the menu open, so picking two departments
 * takes two clicks rather than two trips through the menu.
 */
function ValueItems({
  options,
  values,
  onValuesChange,
}: {
  options: string[];
  values: string[];
  onValuesChange: (values: string[]) => void;
}) {
  return options.map((option) => (
    <ContextMenuCheckboxItem
      key={option}
      checked={values.includes(option)}
      onCheckedChange={() => onValuesChange(toggle(values, option))}
    >
      {option}
    </ContextMenuCheckboxItem>
  ));
}

/** Long lists get their own box to type into, the menu doing the matching. */
function ValueSearch({ label }: { label: string }) {
  return (
    <>
      <ContextMenuInput
        placeholder={`Filter ${plural(label)}...`}
        aria-label={`Filter ${plural(label)}`}
      />
      <ContextMenuEmpty>No {plural(label)} found.</ContextMenuEmpty>
    </>
  );
}

/**
 * The saved sets, under the fields and behind a rule of their own. It is not
 * there at all until something has been saved, so the menu stays as short as
 * it starts for anyone who never saves one.
 */
function SavedSection({
  views,
  onApply,
}: {
  views: SavedFilter[];
  onApply: (conditions: Condition[]) => void;
}) {
  if (views.length === 0) return null;

  return (
    <>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuLabel>Saved</ContextMenuLabel>
        {views.map((view) => (
          <ContextMenuItem
            key={view.name}
            onClick={() => onApply(view.conditions)}
          >
            <BookmarkIcon className="text-muted-foreground" />
            <span className="truncate">{view.name}</span>
          </ContextMenuItem>
        ))}
      </ContextMenuGroup>
    </>
  );
}

/** What the dialog says about who is answering. */
const engines: { [key in Engine]: string } = {
  api: "Answered by Claude, on this machine's API key.",
  cli: "Answered by Claude, through the CLI on this machine.",
  none: "No Claude here, so prompts are read on the page -- simple ones only.",
};

/**
 * Asking for a filter in words. Its own component for the same reason the
 * save form is: the dialog unmounts it, so the next ask opens on an empty box
 * rather than on the prompt somebody typed and thought better of.
 */
function AskForm({
  options,
  initial,
  onApply,
}: {
  options: Options;
  initial: string;
  onApply: (
    conditions: Condition[],
    columns: string[],
    summary: string,
  ) => void;
}) {
  /* Whatever had been typed into the menu's own box comes through as the
     start of the prompt, rather than being typed a second time. */
  const [prompt, setPrompt] = React.useState(initial);
  const [asking, setAsking] = React.useState(false);
  /* What came back when nothing came of it: the model's own account of why,
     which is more use than anything this page could say on its behalf. */
  const [missed, setMissed] = React.useState<string | null>(null);
  const [backend, setBackend] = React.useState<Engine | null>(null);
  const live = React.useRef(true);

  React.useEffect(() => {
    live.current = true;
    void engine().then((found) => live.current && setBackend(found));

    return () => {
      live.current = false;
    };
  }, []);

  const edit = (value: string) => {
    setPrompt(value);
    setMissed(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (prompt.trim() === "" || asking) return;

    setAsking(true);
    setMissed(null);

    const answer = await ask(prompt.trim(), options);
    if (!live.current) return;

    setAsking(false);
    setBackend(answer.engine);

    if (answer.conditions.length === 0) {
      setMissed(answer.summary);
      return;
    }

    onApply(answer.conditions, answer.columns, answer.summary);
  };

  return (
    <form className="grid gap-8" onSubmit={submit}>
      <FieldGroup>
        <Field data-invalid={missed !== null || undefined}>
          <FieldLabel htmlFor="ask-filter">Ask for a filter</FieldLabel>
          <Textarea
            id="ask-filter"
            rows={3}
            autoFocus
            placeholder={examples[0]}
            value={prompt}
            onChange={(event) => edit(event.target.value)}
            onKeyDown={(event) => {
              /* Enter sends, the way it does anywhere else a prompt is
                 typed. A line break is still there on shift. */
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            aria-invalid={missed !== null || undefined}
            disabled={asking}
          />
          <FieldDescription>
            {missed ??
              "It reads the whole record -- permits, certificates, pay, hours, reviews -- not just the fields the menu can offer."}
          </FieldDescription>
          {/* Prompts worth starting from: picking one fills the box rather
              than sending it, so it can be edited into the thing that was
              actually wanted. */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {examples.map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                /* The field turns red when nothing came back, and these are
                   the way out of that rather than part of what went wrong. */
                className="font-normal text-foreground"
                disabled={asking}
                onClick={() => edit(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </Field>
      </FieldGroup>

      <DialogFooter className="sm:items-center sm:justify-between">
        {/* Who is answering, said quietly and only once it is known. */}
        <p className="text-muted-foreground max-w-xs text-xs">
          {backend ? engines[backend] : null}
        </p>

        <div className="flex items-center gap-2">
          {/* Base UI buttons are type="button" unless told otherwise, so
              Cancel cannot submit the form it sits in. */}
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button type="submit" disabled={prompt.trim() === "" || asking}>
            {asking ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <ZapIcon data-icon="inline-start" />
            )}
            {asking ? "Reading the roster" : "Filter"}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

/**
 * The ghost button beside search. Resting, it offers the fields whose values
 * are a list to pick from; typing searches those values themselves, so "cook"
 * reaches Line cook without knowing it lives under Position. Under all of it
 * sits the way past it: say what you want and let Claude set the conditions.
 */
export function FilterMenu({
  options,
  conditions,
  saved,
  onConditionsChange,
  onColumnsChange,
}: {
  options: Options;
  conditions: Condition[];
  saved: SavedFilter[];
  onConditionsChange: (conditions: Condition[]) => void;
  /** Fields the answer asked to see, which the table then shows. */
  onColumnsChange: (columns: string[]) => void;
}) {
  /* The query drives what the menu is a list of, so the menu's own filtering
     is off (`filter={null}`) and these rows are the matches. */
  const [query, setQuery] = React.useState("");
  /* The prompt the A.I. dialog opens on, and null when it is shut. */
  const [prompt, setPrompt] = React.useState<string | null>(null);

  const needle = query.trim().toLowerCase();

  /** Values worth showing for the query -- all of a field's, when it is the
   *  field's own name that matched. */
  const matches = pickable
    .map((field) => {
      const all = options[field.key] ?? [];

      return {
        ...field,
        matched: field.label.toLowerCase().includes(needle)
          ? all
          : all.filter((value) => value.toLowerCase().includes(needle)),
      };
    })
    .filter((field) => field.matched.length > 0);

  /** Saved sets this roster can still satisfy, narrowed by the query the
   *  same way the values are. */
  const views = saved
    .filter((view) => fits(view, options))
    .filter((view) => view.name.toLowerCase().includes(needle));

  const update = (key: string, values: string[]) =>
    onConditionsChange(withValues(conditions, key, values));

  /* Whatever was typed moves into the prompt, so the menu is not left holding
     a search the dialog has taken over. */
  const openAsk = () => {
    setPrompt(query.trim());
    setQuery("");
  };

  /* What it read, set on the fields it names and nowhere else: a condition on
     a field it said nothing about is left standing. */
  const applyAsked = (
    asked: Condition[],
    columns: string[],
    summary: string,
  ) => {
    const kept = conditions.filter(
      (condition) => !asked.some((one) => one.field === condition.field),
    );

    onConditionsChange([...kept, ...asked]);
    onColumnsChange(columns);
    setPrompt(null);

    toast.add({
      type: "success",
      title: "Filtered with A.I.",
      description: summary,
    });
  };

  return (
    <ContextMenuFilterProvider
      filter={null}
      value={query}
      onValueChange={setQuery}
      autoHighlight
    >
      <ContextMenu>
        <ContextMenuTrigger
          onClick={openOnClick}
          render={<Button variant="ghost" />}
        >
          <ListFilterIcon data-icon="inline-start" />
          Filter
        </ContextMenuTrigger>
        <ContextMenuContent className="w-60 overflow-hidden p-0">
          <ContextMenuInput
            placeholder="Filter..."
            aria-label="Filter employees by"
          />
          <ContextMenuList>
            {needle === "" ? (
              <>
                {pickable.map((field) => {
                  const Icon = iconFor(field.key);

                  return (
                    <ContextMenuFilterProvider key={field.key} autoHighlight>
                      <ContextMenuSub>
                        {/* No count beside the field: what it is narrowed to
                            is on the band below, in the chip's own words. */}
                        <ContextMenuSubTrigger>
                          <Icon />
                          {field.label}
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-56 overflow-hidden p-0">
                          <ValueSearch label={field.label} />
                          <ContextMenuList>
                            <ValueItems
                              options={options[field.key] ?? []}
                              values={valuesOf(conditions, field.key)}
                              onValuesChange={(next) => update(field.key, next)}
                            />
                          </ContextMenuList>
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                    </ContextMenuFilterProvider>
                  );
                })}
                <SavedSection views={views} onApply={onConditionsChange} />
              </>
            ) : matches.length === 0 && views.length === 0 ? (
              <div className="px-1.5 py-6 text-center text-sm text-muted-foreground">
                No matches.
              </div>
            ) : (
              <>
                {matches.map((field) => (
                  <ContextMenuGroup key={field.key}>
                    <ContextMenuLabel>{field.label}</ContextMenuLabel>
                    <ValueItems
                      options={field.matched}
                      values={valuesOf(conditions, field.key)}
                      onValuesChange={(next) => update(field.key, next)}
                    />
                  </ContextMenuGroup>
                ))}
                <SavedSection views={views} onApply={onConditionsChange} />
              </>
            )}

            {/* Last in the list, where a way out of a menu belongs -- and
                where a search that found nothing lands on it, carrying what
                was typed. */}
            <ContextMenuSeparator />
            <ContextMenuItem onClick={openAsk}>
              <ZapIcon className="text-muted-foreground" />
              <span className="truncate">
                {needle === ""
                  ? "Filter with A.I."
                  : `Filter with A.I.: ${query.trim()}`}
              </span>
            </ContextMenuItem>
          </ContextMenuList>
        </ContextMenuContent>
      </ContextMenu>

      {/* Outside the menu, which closes on the way here. */}
      <Dialog
        open={prompt !== null}
        onOpenChange={(open) => !open && setPrompt(null)}
      >
        <DialogContent className="sm:max-w-xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Filter with A.I.</DialogTitle>
            <DialogDescription>
              Describe who you want to see. It sets the filters, and they are
              yours to edit afterwards like any others.
            </DialogDescription>
          </DialogHeader>

          <AskForm
            options={options}
            initial={prompt ?? ""}
            onApply={applyAsked}
          />
        </DialogContent>
      </Dialog>
    </ContextMenuFilterProvider>
  );
}

/**
 * One live condition, reading as a sentence: Permit expiry is between Oct 13
 * and Jan 13. A field with a list behind it opens that list on a click, since
 * editing it is the same gesture as making it; a date or an amount came from
 * a sentence, so it reads as one and goes back the way it came.
 */
function FilterChip({
  condition,
  options,
  onValuesChange,
  onRemove,
}: {
  condition: Condition;
  options: string[] | undefined;
  onValuesChange: (values: string[]) => void;
  onRemove: () => void;
}) {
  const { label } = describe(condition.field);
  const Icon = iconFor(condition.field);
  const { operator, summary, more } = phrase(condition);
  const editable = options !== undefined && "values" in condition;

  return (
    <ButtonGroup>
      {/* The chip sits on the grey filter band, so its leading segment takes
          the card's background rather than the band's own grey. */}
      <ButtonGroupText className="gap-1.5 bg-background text-sm">
        <Icon className="size-3.5 text-muted-foreground" />
        {label}
      </ButtonGroupText>

      {editable ? (
        <ContextMenuFilterProvider autoHighlight>
          <ContextMenu>
            <ContextMenuTrigger
              onClick={openOnClick}
              render={<Button variant="outline" className="font-normal" />}
            >
              <span className="text-muted-foreground">{operator}</span>
              {/* The count rides outside the truncation, so a long first
                  value is what gives way and the +2 stays readable. */}
              <span className="flex min-w-0 font-medium">
                <span className="max-w-40 truncate">{summary}</span>
                {more > 0 && <span className="shrink-0">, +{more}</span>}
              </span>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56 overflow-hidden p-0">
              <ValueSearch label={label} />
              <ContextMenuList>
                <ValueItems
                  options={options}
                  values={"values" in condition ? condition.values : []}
                  onValuesChange={onValuesChange}
                />
              </ContextMenuList>
            </ContextMenuContent>
          </ContextMenu>
        </ContextMenuFilterProvider>
      ) : (
        <ButtonGroupText className="gap-1.5 bg-background text-sm font-normal">
          <span className="text-muted-foreground">{operator}</span>
          <span className="max-w-48 truncate font-medium">{summary}</span>
        </ButtonGroupText>
      )}

      <Button
        variant="outline"
        size="icon"
        aria-label={`Remove ${label} filter`}
        onClick={onRemove}
      >
        <XIcon className="text-muted-foreground" />
      </Button>
    </ButtonGroup>
  );
}

/**
 * Naming the set before it joins the menu. Its own component, so closing the
 * dialog unmounts it and the next save opens on a fresh suggestion rather
 * than whatever was typed and abandoned last time.
 */
function SaveViewForm({
  saved,
  onSave,
}: {
  saved: SavedFilter[];
  onSave: (name: string) => void;
}) {
  /* The box starts empty: what to call a set is the one thing the filters
     cannot say for you. */
  const [name, setName] = React.useState("");

  /* Two views under one name are indistinguishable in the menu, which is the
     only place either of them is ever picked. */
  const taken = saved.some(
    (view) => view.name.toLowerCase() === name.trim().toLowerCase(),
  );
  const canSubmit = name.trim() !== "" && !taken;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSave(name.trim());
  };

  return (
    <form className="grid gap-8" onSubmit={submit}>
      <FieldGroup>
        <Field data-invalid={taken || undefined}>
          <FieldLabel htmlFor="view-name">Name</FieldLabel>
          {/* A lone text field inside a form reads as a credential to a
              password manager, which then offers to fill or save it. These
              are the opt-outs 1Password, LastPass, Dashlane and Bitwarden
              each look for; between them they cover the usual suspects. */}
          <Input
            id="view-name"
            autoFocus
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
            data-bwignore
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={taken || undefined}
          />
          {taken && (
            <FieldDescription>
              A view called {name.trim()} is already saved.
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <DialogFooter>
        {/* Base UI buttons are type="button" unless told otherwise, so Cancel
            cannot submit the form it sits in. */}
        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
        <Button type="submit" disabled={!canSubmit}>
          Save view
        </Button>
      </DialogFooter>
    </form>
  );
}

/**
 * What the band offers beyond the chips: drop the lot, or name this set and
 * keep it. A saved set goes into the Filter menu rather than anywhere
 * durable -- it lasts as long as the session does, which is as much as the
 * rest of the prototype promises.
 */
export function FilterActions({
  conditions,
  saved,
  onConditionsChange,
  onSavedChange,
}: {
  conditions: Condition[];
  saved: SavedFilter[];
  onConditionsChange: (conditions: Condition[]) => void;
  onSavedChange: (saved: SavedFilter[]) => void;
}) {
  const [saving, setSaving] = React.useState(false);

  return (
    <div className="ml-auto flex items-center gap-1">
      {/* Ghost's hover is the band's own grey, so it lifts to the card's
          background instead of hovering to the colour it already sits on. */}
      <Button
        variant="ghost"
        className="hover:bg-background"
        onClick={() => onConditionsChange([])}
      >
        Clear
      </Button>
      <Button variant="outline" onClick={() => setSaving(true)}>
        Save
      </Button>

      <Dialog open={saving} onOpenChange={setSaving}>
        {/* Cancel is right there in the footer; a second way out in the
            corner is one more thing on a dialog this small. */}
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Save view</DialogTitle>
          </DialogHeader>

          <SaveViewForm
            saved={saved}
            onSave={(name) => {
              onSavedChange([...saved, { name, conditions }]);
              setSaving(false);

              toast.add({
                type: "success",
                title: "View saved",
                description: `${name} is in the Filter menu, under Saved.`,
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** The chips sit on the band under search, in the order they were added. */
export function FilterChips({
  options,
  conditions,
  onConditionsChange,
}: {
  options: Options;
  conditions: Condition[];
  onConditionsChange: (conditions: Condition[]) => void;
}) {
  return conditions.map((condition, index) => (
    <FilterChip
      key={`${condition.field}-${condition.op}-${index}`}
      condition={condition}
      options={options[condition.field]}
      onValuesChange={(values) =>
        onConditionsChange(withValues(conditions, condition.field, values))
      }
      onRemove={() =>
        onConditionsChange(conditions.filter((item) => item !== condition))
      }
    />
  ));
}
