/**
 * The roster's filters: a menu that adds one, and the chips that show what a
 * table is narrowed to. Both work the way Linear's do -- pick a field, tick
 * the values, and the filter stays on screen as something you can edit rather
 * than a setting you have to reopen a menu to remember.
 */

import * as React from "react";
import { BriefcaseIcon, ListFilterIcon, UsersIcon, XIcon } from "lucide-react";

import { Button } from "@components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@components/ui/button-group";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuEmpty,
  ContextMenuFilterProvider,
  ContextMenuGroup,
  ContextMenuInput,
  ContextMenuLabel,
  ContextMenuList,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@components/ui/context-menu";

import type { Employee } from "./roster";

/**
 * What the roster can be narrowed by. Both fields are on every employee
 * whatever their status, so a filter survives switching tabs -- which is the
 * point of filtering rather than searching.
 */
const fields = [
  {
    field: "department",
    label: "Department",
    plural: "departments",
    icon: UsersIcon,
  },
  {
    field: "position",
    label: "Position",
    plural: "positions",
    icon: BriefcaseIcon,
  },
] as const;

export type FilterField = (typeof fields)[number]["field"];

/** A field narrowed to a set of values: the row matches any one of them. */
export type Filter = { field: FilterField; values: string[] };

/** Every value the roster actually uses, so the menu offers nothing empty. */
export function filterOptions(employees: Employee[]) {
  const unique = (field: FilterField) =>
    [...new Set(employees.map((employee) => employee[field]))].sort((a, b) =>
      a.localeCompare(b),
    );

  return {
    department: unique("department"),
    position: unique("position"),
  } satisfies Record<FilterField, string[]>;
}

export type FilterOptions = ReturnType<typeof filterOptions>;

/** Filters narrow together: an employee has to clear every one of them. */
export function matchesFilters(employee: Employee, filters: Filter[]) {
  return filters.every(
    ({ field, values }) =>
      values.length === 0 || values.includes(employee[field]),
  );
}

const describe = (field: FilterField) =>
  fields.find((item) => item.field === field)!;

/** Ticking the last value off a field drops the filter rather than leaving a
 *  chip that matches everything. */
function withValues(
  filters: Filter[],
  field: FilterField,
  values: string[],
): Filter[] {
  if (values.length === 0) {
    return filters.filter((filter) => filter.field !== field);
  }

  return filters.some((filter) => filter.field === field)
    ? filters.map((filter) =>
        filter.field === field ? { ...filter, values } : filter,
      )
    : [...filters, { field, values }];
}

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
function ValueSearch({ plural }: { plural: string }) {
  return (
    <>
      <ContextMenuInput
        placeholder={`Filter ${plural}...`}
        aria-label={`Filter ${plural}`}
      />
      <ContextMenuEmpty>No {plural} found.</ContextMenuEmpty>
    </>
  );
}

/**
 * The ghost button beside search. Resting, it offers the two fields and their
 * submenus; typing searches the values themselves, so "cook" reaches Line cook
 * without knowing it lives under Position.
 */
export function FilterMenu({
  options,
  filters,
  onFiltersChange,
}: {
  options: FilterOptions;
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
}) {
  /* The query drives what the menu is a list of, so the menu's own filtering
     is off (`filter={null}`) and these rows are the matches. */
  const [query, setQuery] = React.useState("");

  const valuesFor = (field: FilterField) =>
    filters.find((filter) => filter.field === field)?.values ?? [];

  const needle = query.trim().toLowerCase();

  /** Values worth showing for the query -- all of a field's, when it is the
   *  field's own name that matched. */
  const matches = fields
    .map((item) => {
      const all = options[item.field];

      return {
        ...item,
        matched: item.label.toLowerCase().includes(needle)
          ? all
          : all.filter((value) => value.toLowerCase().includes(needle)),
      };
    })
    .filter((item) => item.matched.length > 0);

  const update = (field: FilterField, values: string[]) =>
    onFiltersChange(withValues(filters, field, values));

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
              fields.map((item) => {
                const values = valuesFor(item.field);

                return (
                  <ContextMenuFilterProvider key={item.field} autoHighlight>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger>
                        <item.icon />
                        {item.label}
                        {/* What the field is already narrowed to, without
                            opening it: the count the chip spells out. */}
                        {values.length > 0 && (
                          <span className="ml-auto text-xs tabular-nums">
                            {values.length}
                          </span>
                        )}
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent className="w-56 overflow-hidden p-0">
                        <ValueSearch plural={item.plural} />
                        <ContextMenuList>
                          <ValueItems
                            options={options[item.field]}
                            values={values}
                            onValuesChange={(next) => update(item.field, next)}
                          />
                        </ContextMenuList>
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                  </ContextMenuFilterProvider>
                );
              })
            ) : matches.length === 0 ? (
              <div className="px-1.5 py-6 text-center text-sm text-muted-foreground">
                No matches.
              </div>
            ) : (
              matches.map((item) => (
                <ContextMenuGroup key={item.field}>
                  <ContextMenuLabel>{item.label}</ContextMenuLabel>
                  <ValueItems
                    options={item.matched}
                    values={valuesFor(item.field)}
                    onValuesChange={(next) => update(item.field, next)}
                  />
                </ContextMenuGroup>
              ))
            )}
          </ContextMenuList>
        </ContextMenuContent>
      </ContextMenu>
    </ContextMenuFilterProvider>
  );
}

/** One live filter, reading as a sentence: Department is any of 2 departments. */
function FilterChip({
  filter,
  options,
  onValuesChange,
  onRemove,
}: {
  filter: Filter;
  options: string[];
  onValuesChange: (values: string[]) => void;
  onRemove: () => void;
}) {
  const { field, values } = filter;
  const { label, plural, icon: Icon } = describe(field);

  /* One value reads itself; past that the count does, since three positions
     spelled out would push the search off the line. */
  const summary =
    values.length === 1 ? values[0] : `${values.length} ${plural}`;

  return (
    <ButtonGroup>
      <ButtonGroupText className="gap-1.5 text-sm">
        <Icon className="size-3.5 text-muted-foreground" />
        {label}
      </ButtonGroupText>
      <ContextMenuFilterProvider autoHighlight>
        <ContextMenu>
          <ContextMenuTrigger
            onClick={openOnClick}
            render={<Button variant="outline" className="font-normal" />}
          >
            <span className="text-muted-foreground">
              {values.length === 1 ? "is" : "is any of"}
            </span>
            <span className="max-w-40 truncate font-medium">{summary}</span>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56 overflow-hidden p-0">
            <ValueSearch plural={plural} />
            <ContextMenuList>
              <ValueItems
                options={options}
                values={values}
                onValuesChange={onValuesChange}
              />
            </ContextMenuList>
          </ContextMenuContent>
        </ContextMenu>
      </ContextMenuFilterProvider>
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

/** The chips sit in the toolbar beside search, in the order they were added. */
export function FilterChips({
  options,
  filters,
  onFiltersChange,
}: {
  options: FilterOptions;
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
}) {
  return filters.map((filter) => (
    <FilterChip
      key={filter.field}
      filter={filter}
      options={options[filter.field]}
      onValuesChange={(values) =>
        onFiltersChange(withValues(filters, filter.field, values))
      }
      onRemove={() => onFiltersChange(withValues(filters, filter.field, []))}
    />
  ));
}
