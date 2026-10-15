import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ClockIcon,
  EllipsisIcon,
  PlusIcon,
  SearchIcon,
  UserRoundCheckIcon,
  UserRoundIcon,
  UserRoundXIcon,
} from "lucide-react";

import { useActiveAccount } from "@components/active-account";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { TabSelect } from "@components/ui/tab-select";
import {
  TabDefault,
  TabDefaultContent,
  TabDefaultList,
  TabDefaultTrigger,
} from "@components/ui/tab-default";

import { EmployeeAvatar } from "./EmployeeAvatar";
import {
  FilterActions,
  FilterChips,
  FilterMenu,
  type SavedFilter,
} from "./filters";
import {
  display,
  fieldFor,
  matchesQuery,
  optionsFor,
  type Condition,
} from "./query";
import { rosterFor, type Employee } from "./roster";
import { SelectAll, SelectRow, SelectionActions } from "./selection";
import { useRosterQuery } from "./use-roster-query";

const tabs = [
  { value: "active", label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "offboarding", label: "Offboarding" },
  { value: "on-leave", label: "On leave" },
  { value: "inactive", label: "Inactive" },
  { value: "all", label: "All" },
];

/** Search runs over the fields every tab's table puts on screen -- including
 *  the location, but only while the Location column is there to show it. */
function matches(
  employee: { name: string; position: string; department: string },
  query: string,
  location?: string,
) {
  const needle = query.trim().toLowerCase();

  return (
    needle === "" ||
    [
      employee.name,
      employee.position,
      employee.department,
      location ?? "",
    ].some((field) => field.toLowerCase().includes(needle))
  );
}

/** The leading cell every table shares: a photo beside the name. */
function Person({ name, photo }: { name: string; photo: string }) {
  return (
    <div className="flex items-center gap-2">
      <EmployeeAvatar employee={{ name, photo }} />
      <span className="font-medium">{name}</span>
    </div>
  );
}

/** The trailing cell every table shares: what can be done to one person.
 *  Deactivating is the one that ends something, so it sits apart from the two
 *  that only go and look -- and on someone already inactive it reads the other
 *  way, since there is nothing left to end. */
function RowActions({ name, inactive }: { name: string; inactive?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${name}`}
          />
        }
      >
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserRoundIcon />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ClockIcon />
            View clocks
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {inactive ? (
          <DropdownMenuItem>
            <UserRoundCheckIcon />
            Reactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem variant="destructive">
            <UserRoundXIcon />
            Deactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchField({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <InputGroup className="min-w-40 max-w-xs flex-1">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="Search"
        aria-label="Search employees"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </InputGroup>
  );
}

function NoResults({ columns, message }: { columns: number; message: string }) {
  return (
    <TableRow>
      <TableCell
        colSpan={columns}
        className="text-muted-foreground py-6 text-center"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}

export function Employees() {
  // The roster follows whatever the app is pointed at: every location the
  // company runs, or the one picked in the switcher.
  const { account, location } = useActiveAccount();

  // One query across every tab: searching, then switching tabs to see who else
  // turns up, is the whole reason the tabs sit beside each other. The palette
  // can set both through the url when it sends someone here.
  const { query, setQuery, tab, setTab } = useRosterQuery(tabs[0].value);
  // The filters run alongside the query, and across the tabs for the same
  // reason.
  const [filters, setFilters] = useState<Condition[]>([]);
  // Sets worth coming back to, kept for as long as the session lasts.
  const [saved, setSaved] = useState<SavedFilter[]>([]);
  // Fields an answer asked to see rather than filter by: "what are they paid"
  // wants the wage beside the names.
  const [asked, setAsked] = useState<string[]>([]);
  // Who is ticked, by id. Held here rather than per tab so the bar, the
  // header's tick and the rows are all reading the same list.
  const [picked, setPicked] = useState<string[]>([]);

  const roster = useMemo(
    () => rosterFor(account, location),
    [account, location],
  );

  /* The menu offers what this company -- or this location -- actually employs,
     so switching away from a location never leaves a dead value behind. */
  const options = useMemo(() => optionsFor(roster.all), [roster]);

  /* A filter on a value that just left the roster would hide everyone, so the
     switch drops it rather than asking why the table came back empty. Only
     the ticked-value conditions can go stale that way: a date or an amount
     means the same thing at every location. */
  useEffect(() => {
    setFilters((current) => {
      const kept = current
        .map((condition) =>
          "values" in condition
            ? {
                ...condition,
                values: condition.values.filter((value) =>
                  (options[condition.field] ?? [value]).includes(value),
                ),
              }
            : condition,
        )
        .filter(
          (condition) =>
            !("values" in condition) || condition.values.length > 0,
        );

      const unchanged =
        kept.length === current.length &&
        kept.every((condition, index) => {
          const was = current[index];
          return "values" in condition && "values" in was
            ? condition.values.length === was.values.length
            : condition === was;
        });

      return unchanged ? current : kept;
    });
  }, [options]);

  /* With one location picked, a Location column would repeat that location on
     every row, so it only shows on the company-wide view. */
  const showLocation = location === null;

  const search = <T extends Employee>(rows: T[]) =>
    rows.filter(
      (employee) =>
        matches(
          employee,
          query,
          showLocation ? employee.location : undefined,
        ) && matchesQuery(employee, filters),
    );

  const activeRows = search(roster.active);
  const onboardingRows = search(roster.onboarding);
  const offboardingRows = search(roster.offboarding);
  const onLeaveRows = search(roster.onLeave);
  const inactiveRows = search(roster.inactive);
  const allRows = search(roster.all);

  /* The selection belongs to the rows in front of you: the tab's, after the
     search and the filters have had their say. */
  const visible: Employee[] =
    {
      active: activeRows,
      onboarding: onboardingRows,
      offboarding: offboardingRows,
      "on-leave": onLeaveRows,
      inactive: inactiveRows,
      all: allRows,
    }[tab] ?? [];

  const chosen = visible.filter((employee) => picked.includes(employee.id));

  /* Anyone the view stops showing -- a tab switched away from, a search typed
     past them -- is let go of, so the count on the bar and the people a
     button acts on can never drift apart. Compared as a string: the rows are
     rebuilt every render, and only the names in them matter. */
  const onScreen = visible.map((employee) => employee.id).join(" ");

  useEffect(() => {
    const ids = onScreen.split(" ");

    setPicked((current) => {
      const kept = current.filter((id) => ids.includes(id));
      return kept.length === current.length ? current : kept;
    });
  }, [onScreen]);

  /* An empty table means one of two things, and "no match" is the wrong thing
     to say about a location nobody has been hired into yet. When it is a
     no match, it names what to loosen: the search, the filters, or both. */
  const narrowedBy = [
    query.trim() !== "" ? "that search" : null,
    filters.length > 0 ? "those filters" : null,
  ].filter(Boolean);

  const emptyMessage =
    narrowedBy.length > 0
      ? `No employees match ${narrowedBy.join(" and ")}.`
      : location
        ? `No employees at ${location.name} yet.`
        : `No employees at ${account.name} yet.`;

  /* Filtering on something the table does not show leaves a list of names
     with no sign of what they have in common, which is the wrong half of the
     answer. Anything filtered on that no column already carries gets one. */
  const shown = [
    "name",
    "position",
    "department",
    "location",
    "employment",
    "status",
    "hiredOn",
  ];

  const extras = [...filters.map((condition) => condition.field), ...asked]
    .filter((key, index, keys) => keys.indexOf(key) === index)
    .filter((key) => !shown.includes(key))
    .map((key) => fieldFor(key))
    .filter((field) => field !== undefined);

  const extraHeads = extras.map((field) => (
    <TableHead key={field.key}>{field.label}</TableHead>
  ));

  const extraCells = (employee: Employee) =>
    extras.map((field) => (
      <TableCell key={field.key} className="whitespace-nowrap">
        {display(field, employee)}
      </TableCell>
    ));

  /** Counted from the columns a tab names: every table carries the tick and
   *  the actions column, gains another on the company-wide view, and one more
   *  for each thing the filters asked about. */
  const columns = (base: number) =>
    base + 2 + (showLocation ? 1 : 0) + extras.length;

  const locationHead = showLocation ? <TableHead>Location</TableHead> : null;

  const locationCell = (employee: Employee) =>
    showLocation ? <TableCell>{employee.location}</TableCell> : null;

  /* The tick column is first on every tab, and narrow: the header's box takes
     the whole tab, each row's takes one person. */
  const selectHead = (rows: Employee[]) => (
    <TableHead className="w-8">
      <SelectAll rows={rows} picked={picked} onPickedChange={setPicked} />
    </TableHead>
  );

  const selectCell = (employee: Employee) => (
    <TableCell>
      <SelectRow
        employee={employee}
        picked={picked}
        onPickedChange={setPicked}
      />
    </TableCell>
  );

  /* A picked row takes the table's own selected grey, so the selection reads
     off the rows as much as off the header. */
  const rowState = (employee: Employee) =>
    picked.includes(employee.id) ? "selected" : undefined;

  /** Every tab's header row: its own columns while the table is being read,
   *  and what can be done to a selection once one exists. The tick stays
   *  where it is through both, since it is what moves between them. */
  const headRow = (rows: Employee[], base: number, heads: ReactNode) => (
    <TableRow>
      {selectHead(rows)}
      {chosen.length > 0 ? (
        <TableHead colSpan={columns(base) - 1}>
          <SelectionActions chosen={chosen} onClear={() => setPicked([])} />
        </TableHead>
      ) : (
        <>
          {heads}
          {actionsHead}
        </>
      )}
    </TableRow>
  );

  /* The actions column is last on every tab, and narrow: a header with nothing
     to say, and one button per row. */
  const actionsHead = (
    <TableHead className="w-12">
      <span className="sr-only">Actions</span>
    </TableHead>
  );

  return (
    <TabDefault value={tab} onValueChange={(value) => setTab(value as string)}>
      <Card>
        {/* The card's header carries the whole control surface: the tab rail
            and the actions on one line, the search beneath them. */}
        <CardHeader className="gap-(--card-spacing)">
          <div className="flex items-center justify-between gap-4">
            <TabSelect
              tabs={tabs}
              value={tab}
              onValueChange={setTab}
              className="md:hidden"
            />

            <TabDefaultList className="hidden md:inline-flex">
              {tabs.map((item) => (
                <TabDefaultTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabDefaultTrigger>
              ))}
            </TabDefaultList>

            <div className="flex items-center gap-2">
              <Button variant="outline">Export</Button>
              <Button>
                <PlusIcon data-icon="inline-start" />
                Add employee
              </Button>
            </div>
          </div>

          {/* Search and the way into a filter, on one line. */}
          <div className="flex flex-wrap items-center gap-2">
            <SearchField value={query} onValueChange={setQuery} />
            <FilterMenu
              options={options}
              conditions={filters}
              saved={saved}
              onConditionsChange={setFilters}
              onColumnsChange={setAsked}
            />
          </div>

          {/* The filters themselves sit on their own band under the search,
              there only while something is filtered: a strip of grey that
              says, before the rows do, that the table is a subset. */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted p-2">
              <FilterChips
                options={options}
                conditions={filters}
                onConditionsChange={setFilters}
              />
              <FilterActions
                conditions={filters}
                saved={saved}
                /* Clearing the filters clears what they asked to see with
                   them: a wage column nobody asked for twice over. */
                onConditionsChange={(next) => {
                  setFilters(next);
                  if (next.length === 0) setAsked([]);
                }}
                onSavedChange={setSaved}
              />
            </div>
          )}
        </CardHeader>

        <TabDefaultContent value="active">
          <CardContent>
            <Table>
              <TableHeader>
                {headRow(
                  activeRows,
                  5,
                  <>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    {locationHead}
                    <TableHead>Started</TableHead>
                    <TableHead>Employment</TableHead>
                    {extraHeads}
                  </>,
                )}
              </TableHeader>
              <TableBody>
                {activeRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {activeRows.map((employee) => (
                  <TableRow key={employee.id} data-state={rowState(employee)}>
                    {selectCell(employee)}
                    <TableCell>
                      <Person name={employee.name} photo={employee.photo} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    {locationCell(employee)}
                    <TableCell>{employee.started}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.employment === "Full-time"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {employee.employment}
                      </Badge>
                    </TableCell>
                    {extraCells(employee)}
                    <TableCell>
                      <RowActions name={employee.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </TabDefaultContent>

        <TabDefaultContent value="onboarding">
          <CardContent>
            <Table>
              <TableHeader>
                {headRow(
                  onboardingRows,
                  5,
                  <>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    {locationHead}
                    <TableHead>Start date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    {extraHeads}
                  </>,
                )}
              </TableHeader>
              <TableBody>
                {onboardingRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {onboardingRows.map((employee) => (
                  <TableRow key={employee.id} data-state={rowState(employee)}>
                    {selectCell(employee)}
                    <TableCell>
                      <Person name={employee.name} photo={employee.photo} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    {locationCell(employee)}
                    <TableCell>{employee.starts}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.progress}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === "Ready to start"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    {extraCells(employee)}
                    <TableCell>
                      <RowActions name={employee.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </TabDefaultContent>

        <TabDefaultContent value="offboarding">
          <CardContent>
            <Table>
              <TableHeader>
                {headRow(
                  offboardingRows,
                  5,
                  <>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    {locationHead}
                    <TableHead>Last day</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    {extraHeads}
                  </>,
                )}
              </TableHeader>
              <TableBody>
                {offboardingRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {offboardingRows.map((employee) => (
                  <TableRow key={employee.id} data-state={rowState(employee)}>
                    {selectCell(employee)}
                    <TableCell>
                      <Person name={employee.name} photo={employee.photo} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    {locationCell(employee)}
                    <TableCell>{employee.lastDay}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.progress}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === "Ready to close"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    {extraCells(employee)}
                    <TableCell>
                      <RowActions name={employee.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </TabDefaultContent>

        <TabDefaultContent value="on-leave">
          <CardContent>
            <Table>
              <TableHeader>
                {headRow(
                  onLeaveRows,
                  5,
                  <>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    {locationHead}
                    <TableHead>Leave</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Returns</TableHead>
                    {extraHeads}
                  </>,
                )}
              </TableHeader>
              <TableBody>
                {onLeaveRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {onLeaveRows.map((employee) => (
                  <TableRow key={employee.id} data-state={rowState(employee)}>
                    {selectCell(employee)}
                    <TableCell>
                      <Person name={employee.name} photo={employee.photo} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    {locationCell(employee)}
                    <TableCell>
                      <Badge variant="outline">{employee.type}</Badge>
                    </TableCell>
                    <TableCell>{employee.dates}</TableCell>
                    <TableCell>{employee.returns}</TableCell>
                    {extraCells(employee)}
                    <TableCell>
                      <RowActions name={employee.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </TabDefaultContent>

        <TabDefaultContent value="inactive">
          <CardContent>
            <Table>
              <TableHeader>
                {headRow(
                  inactiveRows,
                  5,
                  <>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    {locationHead}
                    <TableHead>Last day</TableHead>
                    <TableHead>Reason</TableHead>
                    {extraHeads}
                  </>,
                )}
              </TableHeader>
              <TableBody>
                {inactiveRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {inactiveRows.map((employee) => (
                  <TableRow key={employee.id} data-state={rowState(employee)}>
                    {selectCell(employee)}
                    <TableCell>
                      <Person name={employee.name} photo={employee.photo} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    {locationCell(employee)}
                    <TableCell>{employee.lastDay}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.reason === "Terminated"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {employee.reason}
                      </Badge>
                    </TableCell>
                    {extraCells(employee)}
                    <TableCell>
                      <RowActions name={employee.name} inactive />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </TabDefaultContent>

        <TabDefaultContent value="all">
          <CardContent>
            <Table>
              <TableHeader>
                {headRow(
                  allRows,
                  4,
                  <>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    {locationHead}
                    <TableHead>Status</TableHead>
                    {extraHeads}
                  </>,
                )}
              </TableHeader>
              <TableBody>
                {allRows.length === 0 && (
                  <NoResults columns={columns(4)} message={emptyMessage} />
                )}
                {allRows.map((employee) => (
                  <TableRow key={employee.id} data-state={rowState(employee)}>
                    {selectCell(employee)}
                    <TableCell>
                      <Person name={employee.name} photo={employee.photo} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    {locationCell(employee)}
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === "Active" ? "secondary" : "outline"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    {extraCells(employee)}
                    <TableCell>
                      <RowActions
                        name={employee.name}
                        inactive={employee.status === "Inactive"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </TabDefaultContent>
      </Card>
    </TabDefault>
  );
}
