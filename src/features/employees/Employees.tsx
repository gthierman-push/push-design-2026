import { useMemo } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";

import { useActiveAccount } from "@components/active-account";
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

import { EmployeeAvatar } from "./EmployeeAvatar";
import { rosterFor, type Employee } from "./roster";
import { useRosterQuery } from "./use-roster-query";

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

/** The leading cell every table shares: a photo beside the name. */
function Person({ name, photo }: { name: string; photo: string }) {
  return (
    <div className="flex items-center gap-2">
      <EmployeeAvatar employee={{ name, photo }} />
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
    <InputGroup className="w-full max-w-xs">
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

  const roster = useMemo(
    () => rosterFor(account, location),
    [account, location],
  );

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
    rows.filter((employee) =>
      matches(employee, query, showLocation ? nameOf(employee) : undefined),
    );

  const activeRows = search(roster.active);
  const onboardingRows = search(roster.onboarding);
  const onLeaveRows = search(roster.onLeave);
  const offboardingRows = search(roster.offboarding);
  const inactiveRows = search(roster.inactive);
  const allRows = search(roster.all);

  /* An empty table means one of two things, and "no match" is the wrong thing
     to say about a location nobody has been hired into yet. */
  const emptyMessage =
    query.trim() !== ""
      ? "No employees match that search."
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

          <SearchField value={query} onValueChange={setQuery} />
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
