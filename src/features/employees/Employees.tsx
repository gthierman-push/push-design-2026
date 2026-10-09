import { useState } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@components/ui/avatar";
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

const tabs = [
  { value: "active", label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "on-leave", label: "On leave" },
  { value: "inactive", label: "Inactive" },
  { value: "all", label: "All" },
];

const active = [
  {
    name: "Mara Ellison",
    position: "Line cook",
    department: "Kitchen",
    started: "Mar 4, 2023",
    employment: "Full-time",
  },
  {
    name: "Desmond Park",
    position: "Server",
    department: "Front of house",
    started: "Jun 19, 2024",
    employment: "Part-time",
  },
  {
    name: "Alicia Reyes",
    position: "Shift supervisor",
    department: "Front of house",
    started: "Nov 2, 2021",
    employment: "Full-time",
  },
  {
    name: "Tomas Bergeron",
    position: "Prep cook",
    department: "Kitchen",
    started: "Feb 12, 2025",
    employment: "Part-time",
  },
  {
    name: "Priya Nandakumar",
    position: "Bartender",
    department: "Bar",
    started: "Aug 30, 2022",
    employment: "Full-time",
  },
];

const onboarding = [
  {
    name: "Jules Whitfield",
    position: "Dishwasher",
    department: "Kitchen",
    starts: "Oct 20, 2026",
    progress: "3 of 6 steps",
    status: "Forms pending",
  },
  {
    name: "Nora Vasquez",
    position: "Server",
    department: "Front of house",
    starts: "Oct 13, 2026",
    progress: "6 of 6 steps",
    status: "Ready to start",
  },
  {
    name: "Henry Oyelaran",
    position: "Line cook",
    department: "Kitchen",
    starts: "Nov 3, 2026",
    progress: "1 of 6 steps",
    status: "Invite sent",
  },
];

const onLeave = [
  {
    name: "Cassandra Liu",
    position: "Sous chef",
    department: "Kitchen",
    type: "Parental",
    dates: "Aug 1 – Dec 19, 2026",
    returns: "Dec 21, 2026",
  },
  {
    name: "Ethan Caldwell",
    position: "Server",
    department: "Front of house",
    type: "Medical",
    dates: "Sep 28 – Oct 26, 2026",
    returns: "Oct 27, 2026",
  },
  {
    name: "Rosa Marchetti",
    position: "Host",
    department: "Front of house",
    type: "Unpaid",
    dates: "Oct 5 – Nov 2, 2026",
    returns: "Nov 3, 2026",
  },
];

const inactive = [
  {
    name: "Gavin Turnbull",
    position: "Line cook",
    department: "Kitchen",
    lastDay: "Jul 11, 2026",
    reason: "Resigned",
  },
  {
    name: "Simone Adeyemi",
    position: "Bartender",
    department: "Bar",
    lastDay: "Apr 2, 2026",
    reason: "Seasonal end",
  },
  {
    name: "Luca Fontaine",
    position: "Busser",
    department: "Front of house",
    lastDay: "Jan 19, 2026",
    reason: "Terminated",
  },
];

/**
 * The All tab is the four status lists in one, so it stays in step with them
 * rather than carrying its own copy of everyone. Sorted by name, since without
 * a status to group by the only useful order is alphabetical.
 */
const all = [
  ...active.map((employee) => ({ ...employee, status: "Active" })),
  ...onboarding.map((employee) => ({ ...employee, status: "Onboarding" })),
  ...onLeave.map((employee) => ({ ...employee, status: "On leave" })),
  ...inactive.map((employee) => ({ ...employee, status: "Inactive" })),
].sort((a, b) => a.name.localeCompare(b.name));

/** Search runs over the three fields every tab's table puts on screen. */
function matches(
  employee: { name: string; position: string; department: string },
  query: string,
) {
  const needle = query.trim().toLowerCase();

  return (
    needle === "" ||
    [employee.name, employee.position, employee.department].some((field) =>
      field.toLowerCase().includes(needle),
    )
  );
}

/** The leading cell every table shares: initials beside the name. */
function Person({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
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

function NoResults({ columns }: { columns: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={columns}
        className="text-muted-foreground py-6 text-center"
      >
        No employees match that search.
      </TableCell>
    </TableRow>
  );
}

export function Employees() {
  const [tab, setTab] = useState(tabs[0].value);
  // One query across every tab: searching, then switching tabs to see who else
  // turns up, is the whole reason the tabs sit beside each other.
  const [query, setQuery] = useState("");

  const activeRows = active.filter((employee) => matches(employee, query));
  const onboardingRows = onboarding.filter((employee) =>
    matches(employee, query),
  );
  const onLeaveRows = onLeave.filter((employee) => matches(employee, query));
  const inactiveRows = inactive.filter((employee) => matches(employee, query));
  const allRows = all.filter((employee) => matches(employee, query));

  return (
    <TabDefault value={tab} onValueChange={(value) => setTab(value as string)}>
      {/* The tab rail doubles as the page's header row: no title above it, so
          the actions sit on the same line as the tabs. */}
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

      <TabDefaultContent value="active" className="pt-6">
        <Card>
          <CardHeader>
            <SearchField value={query} onValueChange={setQuery} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Employment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeRows.length === 0 && <NoResults columns={5} />}
                {activeRows.map((employee) => (
                  <TableRow key={employee.name}>
                    <TableCell>
                      <Person name={employee.name} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
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
        </Card>
      </TabDefaultContent>

      <TabDefaultContent value="onboarding" className="pt-6">
        <Card>
          <CardHeader>
            <SearchField value={query} onValueChange={setQuery} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Start date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onboardingRows.length === 0 && <NoResults columns={5} />}
                {onboardingRows.map((employee) => (
                  <TableRow key={employee.name}>
                    <TableCell>
                      <Person name={employee.name} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
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
        </Card>
      </TabDefaultContent>

      <TabDefaultContent value="on-leave" className="pt-6">
        <Card>
          <CardHeader>
            <SearchField value={query} onValueChange={setQuery} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Leave</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Returns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onLeaveRows.length === 0 && <NoResults columns={5} />}
                {onLeaveRows.map((employee) => (
                  <TableRow key={employee.name}>
                    <TableCell>
                      <Person name={employee.name} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
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
        </Card>
      </TabDefaultContent>

      <TabDefaultContent value="inactive" className="pt-6">
        <Card>
          <CardHeader>
            <SearchField value={query} onValueChange={setQuery} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Last day</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inactiveRows.length === 0 && <NoResults columns={5} />}
                {inactiveRows.map((employee) => (
                  <TableRow key={employee.name}>
                    <TableCell>
                      <Person name={employee.name} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
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
        </Card>
      </TabDefaultContent>

      <TabDefaultContent value="all" className="pt-6">
        <Card>
          <CardHeader>
            <SearchField value={query} onValueChange={setQuery} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRows.length === 0 && <NoResults columns={4} />}
                {allRows.map((employee) => (
                  <TableRow key={employee.name}>
                    <TableCell>
                      <Person name={employee.name} />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
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
        </Card>
      </TabDefaultContent>
    </TabDefault>
  );
}
