import { useEffect, useMemo, useState } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";

import { useActiveAccount } from "@components/active-account";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
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

import {
  FilterChips,
  FilterMenu,
  filterOptions,
  matchesFilters,
  type Filter,
} from "./filters";
import { rosterFor, type Employee } from "./roster";

const tabs = [
  { value: "active", label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "on-leave", label: "On leave" },
  { value: "offboarding", label: "Offboarding" },
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

/** The leading cell every table shares: a photo beside the name, falling back
 *  to the initials whenever the picture is missing or fails to load. */
function Person({ name, photo }: { name: string; photo: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        <AvatarImage src={photo} alt="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{name}</span>
    </div>
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

  const [tab, setTab] = useState(tabs[0].value);
  // One query across every tab: searching, then switching tabs to see who else
  // turns up, is the whole reason the tabs sit beside each other.
  const [query, setQuery] = useState("");
  // The filters run alongside it, and across the tabs for the same reason.
  const [filters, setFilters] = useState<Filter[]>([]);

  const roster = useMemo(
    () => rosterFor(account, location),
    [account, location],
  );

  /* The menu offers what this company -- or this location -- actually employs,
     so switching away from a location never leaves a dead value behind. */
  const options = useMemo(() => filterOptions(roster.all), [roster]);

  /* A filter on a value that just left the roster would hide everyone, so the
     switch drops it rather than asking why the table came back empty. */
  useEffect(() => {
    setFilters((current) => {
      const kept = current
        .map((filter) => ({
          ...filter,
          values: filter.values.filter((value) =>
            options[filter.field].includes(value),
          ),
        }))
        .filter((filter) => filter.values.length > 0);

      return kept.length === current.length &&
        kept.every(
          (filter, index) =>
            filter.values.length === current[index].values.length,
        )
        ? current
        : kept;
    });
  }, [options]);

  /* With one location picked, a Location column would repeat that location on
     every row, so it only shows on the company-wide view. */
  const showLocation = location === null;

  const locationNames = useMemo(
    () => new Map(account.locations.map((item) => [item.id, item.name])),
    [account],
  );

  const nameOf = (employee: { locationId: string }) =>
    locationNames.get(employee.locationId) ?? "—";

  const search = <T extends Employee>(rows: T[]) =>
    rows.filter(
      (employee) =>
        matches(employee, query, showLocation ? nameOf(employee) : undefined) &&
        matchesFilters(employee, filters),
    );

  const activeRows = search(roster.active);
  const onboardingRows = search(roster.onboarding);
  const onLeaveRows = search(roster.onLeave);
  const offboardingRows = search(roster.offboarding);
  const inactiveRows = search(roster.inactive);
  const allRows = search(roster.all);

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

  /** Every table gains a column on the company-wide view. */
  const columns = (base: number) => base + (showLocation ? 1 : 0);

  const locationHead = showLocation ? <TableHead>Location</TableHead> : null;

  const locationCell = (employee: { locationId: string }) =>
    showLocation ? <TableCell>{nameOf(employee)}</TableCell> : null;

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
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* The filters themselves sit on their own band under the search,
              there only while something is filtered: a strip of grey that
              says, before the rows do, that the table is a subset. */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted p-2">
              <FilterChips
                options={options}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          )}
        </CardHeader>

        <TabDefaultContent value="active">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  {locationHead}
                  <TableHead>Started</TableHead>
                  <TableHead>Employment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {activeRows.map((employee) => (
                  <TableRow key={employee.id}>
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
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  {locationHead}
                  <TableHead>Start date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onboardingRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {onboardingRows.map((employee) => (
                  <TableRow key={employee.id}>
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
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  {locationHead}
                  <TableHead>Leave</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Returns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onLeaveRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {onLeaveRows.map((employee) => (
                  <TableRow key={employee.id}>
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
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  {locationHead}
                  <TableHead>Last day</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offboardingRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {offboardingRows.map((employee) => (
                  <TableRow key={employee.id}>
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
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  {locationHead}
                  <TableHead>Last day</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inactiveRows.length === 0 && (
                  <NoResults columns={columns(5)} message={emptyMessage} />
                )}
                {inactiveRows.map((employee) => (
                  <TableRow key={employee.id}>
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
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  {locationHead}
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRows.length === 0 && (
                  <NoResults columns={columns(4)} message={emptyMessage} />
                )}
                {allRows.map((employee) => (
                  <TableRow key={employee.id}>
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
