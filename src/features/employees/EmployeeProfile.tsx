import { useState } from "react";
import { NavLink, useParams } from "react-router";
import { differenceInMonths, isAfter, parse, parseISO } from "date-fns";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  ClockIcon,
  EllipsisIcon,
  FileTextIcon,
  HistoryIcon,
  KeyRoundIcon,
  ListChecksIcon,
  MailIcon,
  MessagesSquareIcon,
  PencilIcon,
  PhoneIcon,
  PlaneIcon,
  ReceiptTextIcon,
  TreePalmIcon,
  TrophyIcon,
  UserRoundCheckIcon,
  UserRoundIcon,
  UserRoundXIcon,
} from "@components/icons";

import { useActiveAccount } from "@components/active-account";
import type { Crumb, Marks } from "@layouts/crumbs";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@components/ui/empty";
import { TabSelect } from "@components/ui/tab-select";
import {
  TabVertical,
  TabVerticalContent,
  TabVerticalList,
  TabVerticalTrigger,
} from "@components/ui/tab-vertical";

import { EmployeeAvatar } from "./EmployeeAvatar";
import {
  managerFor,
  profileFor,
  teamOf,
  type Profile,
} from "./profile";
import {
  Detail,
  DetailList,
  StatusBadge,
  Unset,
  day,
  daysUntil,
} from "./profile-parts";
import {
  ActivityTab,
  FilesTab,
  PerformanceTab,
  PositionsTab,
  ScheduleTab,
  TasksTab,
  TimeOffTab,
} from "./profile-tabs";
import { today } from "./records";
import { employeeFor, type RosterRow } from "./roster";

/**
 * The person's own crumb in the header, so the bar above the page reads
 * People > whoever this is. Nobody by that id -- a switched account, a
 * profile that has gone -- names nothing, and the trail stops at People.
 */
export const employeeCrumb: Crumb = ({ params, account }) =>
  params.id ? employeeFor(account, params.id)?.name : undefined;

/**
 * What they are, beside their name up in the bar: the state their record is
 * in, how much of a week they are hired for, and the number payroll calls
 * them by. All three sat under the heading on the page, where they were a
 * third line of small print below the name and the email; up here they read
 * as what the crumb is pointing at.
 */
export const employeeMarks: Marks = ({ params, account }) => {
  const employee = params.id ? employeeFor(account, params.id) : undefined;
  if (!employee) return null;

  return (
    <>
      <StatusBadge status={employee.status} />
      {/* Plain beside the clock ID rather than filled like the status: up
          here these two are both labels on the record, not a state to read. */}
      <Badge variant="outline">{employee.employment}</Badge>
      <Badge variant="outline">Clock ID {profileFor(employee).clockId}</Badge>
    </>
  );
};

const tabs = [
  { value: "overview", label: "Overview", icon: UserRoundIcon },
  { value: "positions", label: "Positions", icon: BriefcaseIcon },
  { value: "schedule", label: "Schedule", icon: CalendarDaysIcon },
  { value: "time-off", label: "Time off", icon: TreePalmIcon },
  { value: "performance", label: "Performance", icon: TrophyIcon },
  { value: "tasks", label: "Tasks", icon: ListChecksIcon },
  { value: "files", label: "Files", icon: FileTextIcon },
  { value: "activity", label: "Activity", icon: HistoryIcon },
];

/** What sits behind each tab, so the rail and its panels are written from
 *  the one list rather than kept in step by hand. */
function panelFor(value: string, employee: RosterRow, profile: Profile) {
  switch (value) {
    case "positions":
      return <PositionsTab employee={employee} profile={profile} />;
    case "schedule":
      return <ScheduleTab employee={employee} profile={profile} />;
    case "time-off":
      return <TimeOffTab employee={employee} profile={profile} />;
    case "performance":
      return <PerformanceTab employee={employee} />;
    case "tasks":
      return <TasksTab employee={employee} />;
    case "files":
      return <FilesTab profile={profile} />;
    case "activity":
      return <ActivityTab profile={profile} />;
    default:
      return <OverviewTab employee={employee} profile={profile} />;
  }
}

/** How long they have been here, in the units anyone says it in: months
 *  until it is a couple of years, and years and months after that. Someone
 *  who has not started yet has none of it, so it counts the other way, and
 *  someone who has left stopped accruing it the day they did. */
function tenure(hiredOn: string, until: Date | null) {
  const hired = parseISO(hiredOn);
  const now = today();

  if (isAfter(hired, now)) {
    const days = daysUntil(hiredOn);
    return days === 0 ? "Starts today" : `Starts in ${days} days`;
  }

  const months = differenceInMonths(until ?? now, hired);
  if (months < 1) return "Under a month";
  if (months < 24) return `${months} months`;

  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0 ? `${years} years` : `${years} yr ${rest} mo`;
}

/**
 * What their status means in practice, for anyone whose status means
 * something. Active is the state the rest of the page already describes, so
 * it says nothing; the other four each carry a date somebody is working to.
 */
function StatusNotice({ employee }: { employee: RosterRow }) {
  if ("starts" in employee) {
    return (
      <Alert>
        <UserRoundCheckIcon />
        <AlertTitle>Starts {employee.starts}</AlertTitle>
        <AlertDescription>
          {employee.progress} of their onboarding checklist are done.
        </AlertDescription>
      </Alert>
    );
  }

  if ("returns" in employee) {
    return (
      <Alert>
        <PlaneIcon />
        <AlertTitle>
          On {employee.type.toLowerCase()} leave, {employee.dates}
        </AlertTitle>
        <AlertDescription>
          Back on the roster {employee.returns}. Nothing is scheduled before
          then.
        </AlertDescription>
      </Alert>
    );
  }

  if ("reason" in employee) {
    return (
      <Alert>
        <UserRoundXIcon />
        <AlertTitle>No longer employed</AlertTitle>
        <AlertDescription>
          {employee.reason} — last day {employee.lastDay}. The record is kept
          for payroll and is read-only.
        </AlertDescription>
      </Alert>
    );
  }

  if ("lastDay" in employee) {
    return (
      <Alert variant="destructive">
        <UserRoundXIcon />
        <AlertTitle>Leaving {employee.lastDay}</AlertTitle>
        <AlertDescription>
          {employee.progress} of their offboarding checklist are done.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

/** One person on the team card: a link to their profile, and the same two
 *  things you would want from a name you recognise -- open them, or message
 *  them -- tucked behind the overflow rather than spending two buttons a row. */
function TeamPersonRow({ person }: { person: RosterRow }) {
  return (
    <div className="group flex items-center gap-2">
      <NavLink
        to={`/employees/${person.id}`}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <EmployeeAvatar employee={person} />
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-medium">{person.name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {person.position}
          </span>
        </span>
      </NavLink>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground shrink-0"
              aria-label={`More actions for ${person.name}`}
            />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<NavLink to={`/employees/${person.id}`} />}>
            <UserRoundIcon />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessagesSquareIcon />
            Message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** Who they answer to and who they work beside, on one card. Both come off
 *  the roster rather than out of the generator, so the faces here are people
 *  you can click through to. */
function TeamCard({ employee }: { employee: RosterRow }) {
  const { account } = useActiveAccount();
  const manager = managerFor(account, employee);
  const team = teamOf(account, employee);
  const shown = team.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">Managers</span>
          {manager ? (
            <TeamPersonRow person={manager} />
          ) : (
            <span className="text-muted-foreground">Nobody — they run it</span>
          )}
        </div>

        {shown.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs">
              {employee.department} at {employee.location}
            </span>
            {shown.map((person) => (
              <TeamPersonRow key={person.id} person={person} />
            ))}
            {team.length > shown.length && (
              <span className="text-muted-foreground text-xs">
                +{team.length - shown.length} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OverviewTab({
  employee,
  profile,
}: {
  employee: RosterRow;
  profile: Profile;
}) {
  const { contact, emergency, personal } = profile;
  /* Tenure stops on the day somebody left, rather than running to today. */
  const left =
    "reason" in employee
      ? { on: parse(employee.lastDay, "MMM d, yyyy", today()) }
      : null;

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList>
              <Detail label="First name">{personal.firstName}</Detail>
              <Detail label="Last name">{personal.lastName}</Detail>
              {/* The optional half of the form. Most people fill none of it
                  in, so these rows are blank more often than not. */}
              <Detail label="Preferred first name">
                {personal.preferredFirst ?? <Unset />}
              </Detail>
              <Detail label="Preferred last name">
                {personal.preferredLast ?? <Unset />}
              </Detail>
              {/* The age came across with the date it is worked out from,
                  which is the only thing anybody reads a birthday for. */}
              <Detail label="Birthday">
                {day(contact.bornOn)}
                <span className="text-muted-foreground font-normal">
                  {" "}
                  · {employee.age}
                </span>
              </Detail>
              <Detail label="Language preference">{personal.language}</Detail>
              {/* A SIN at the Canadian sites and an SSN at the American
                  ones, both in full. */}
              <Detail label={personal.governmentId.label}>
                {personal.governmentId.number}
              </Detail>
            </DetailList>
          </CardContent>
        </Card>

        {/* Whatever a company chose to track about its people on top of the
            form everybody fills in. The names and the values come from the
            backend once there is one; these two stand in until then. */}
        <Card>
          <CardHeader>
            <CardTitle>Custom attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList>
              <Detail label="Custom field 1">
                <Unset />
              </Detail>
              <Detail label="Custom field 2">
                <Unset />
              </Detail>
            </DetailList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment details</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList>
              <Detail label="Clock ID">{profile.clockId}</Detail>
              <Detail label="Employment">
                <Badge variant="outline">{employee.employment}</Badge>
              </Detail>
              <Detail label="Status">
                <StatusBadge status={employee.status} />
              </Detail>
              <Detail
                label={
                  isAfter(parseISO(employee.hiredOn), today())
                    ? "Starts"
                    : "Hired"
                }
              >
                {day(employee.hiredOn)}
              </Detail>
              {/* Tenure had nowhere else on the page to be, so it came down
                  off the strip into the record. */}
              <Detail label="Tenure">
                {tenure(employee.hiredOn, left?.on ?? null)}
              </Detail>
            </DetailList>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList>
              <Detail label="Email">
                {/* Long enough on some companies to need the ellipsis, so
                    the whole address goes on the title. */}
                <a
                  href={`mailto:${contact.email}`}
                  title={contact.email}
                  className="block truncate hover:underline"
                >
                  {contact.email}
                </a>
              </Detail>
              <Detail label="Phone">
                <a href={`tel:${contact.phone}`} className="hover:underline">
                  {contact.phone}
                </a>
              </Detail>
              <Detail label="Address">
                {/* Two lines of one address, so the city is set the same
                    way as the street above it. */}
                <span className="block">{contact.street}</span>
                <span className="block">{contact.city}</span>
              </Detail>
            </DetailList>
            {/* The two addresses on the card, each under the one it goes
                to. Both are real links, which Base UI needs telling or it
                warns that the native button semantics have gone. Message
                went up to the header beside Edit: it dials nothing listed
                here, so it belongs with the actions rather than the
                addresses. The pair share the width and wrap onto a second
                line in a column too narrow for both. */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                nativeButton={false}
                render={<a href={`mailto:${contact.email}`} />}
              >
                <MailIcon data-icon="inline-start" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                nativeButton={false}
                render={<a href={`tel:${contact.phone}`} />}
              >
                <PhoneIcon data-icon="inline-start" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency contact</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList>
              <Detail label="Name">{emergency.name}</Detail>
              <Detail label="Relationship">{emergency.relation}</Detail>
              <Detail label="Phone">
                <a href={`tel:${emergency.phone}`} className="hover:underline">
                  {emergency.phone}
                </a>
              </Detail>
            </DetailList>
          </CardContent>
        </Card>

        <TeamCard employee={employee} />
      </div>
    </div>
  );
}

/**
 * One person's profile: who they are across the top, the five numbers a
 * manager actually asks for on the strip beneath, and the rest of the record
 * behind a tab each. Everything on it comes from the same row the roster
 * drew, so a profile opened from a link says what the table said.
 */
export function EmployeeProfile() {
  const { account } = useActiveAccount();
  const { id } = useParams();
  const [tab, setTab] = useState(tabs[0].value);

  const employee = id ? employeeFor(account, id) : undefined;

  /* An id that matches nobody is a link to someone this company does not
     employ -- a switched account, or a profile that has since gone. */
  if (!employee) {
    return (
      <div className="flex flex-col gap-6">
        <Empty className="border-border rounded-xl border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No such employee</EmptyTitle>
            <EmptyDescription>
              Nobody on {account.name}'s roster has this profile.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const profile = profileFor(employee);
  const inactive = employee.status === "Inactive";

  return (
    <div className="flex flex-col gap-4">
      {/* Who they are sits on the page rather than in a card: the rail and
          the cards beside it are the things with edges, and a third one
          across the top only boxed in the name. */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {/* Bigger than any size the avatar ships, so it takes the
                plain one -- the sm and lg classes are data-variants and
                would out-specify the override. The dot is sized the same
                way, and needs the bang for the same reason. */}
          <EmployeeAvatar
            employee={employee}
            size="default"
            className="size-16 *:data-[slot=avatar-fallback]:text-lg *:data-[slot=avatar-badge]:size-3!"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="font-heading truncate text-2xl font-semibold tracking-tight">
              {employee.name}
            </h1>
            {/* Their address rather than their job: position, department
                and location are all on the Positions tab, and the thing
                anyone copies off a heading is the email. */}
            <a
              href={`mailto:${profile.contact.email}`}
              title={profile.contact.email}
              className="text-muted-foreground truncate hover:underline"
            >
              {profile.contact.email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`More actions for ${employee.name}`}
                />
              }
            >
              <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ClockIcon />
                  View clocks
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ReceiptTextIcon />
                  View pay stubs
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <KeyRoundIcon />
                  Send password reset
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

          {/* Writing to somebody is the other thing a manager opens a
              profile to do, so it sits out here beside Edit rather than
              down in the Contact card -- it opens the chat the
              Communication section holds, not an address on the record. */}
          <Button variant="outline">
            <MessagesSquareIcon data-icon="inline-start" />
            Message
          </Button>

          <Button>
            <PencilIcon data-icon="inline-start" />
            Edit
          </Button>
        </div>
      </div>

      <StatusNotice employee={employee} />

      {/* Narrow enough and the rail would eat the page, so the picker the
          roster uses on a phone stands in for it. */}
      <TabSelect
        tabs={tabs}
        value={tab}
        onValueChange={setTab}
        className="md:hidden"
      />

      <TabVertical
        value={tab}
        onValueChange={(value) => setTab(value as string)}
        className="gap-6"
      >
        {/* The rail stays with you down a long tab -- the shifts table and
            the file both run past the fold. */}
        <TabVerticalList className="hidden w-44 shrink-0 md:sticky md:top-5 md:inline-flex">
          {tabs.map((item) => (
            <TabVerticalTrigger key={item.value} value={item.value}>
              <item.icon data-icon="inline-start" />
              {item.label}
            </TabVerticalTrigger>
          ))}
        </TabVerticalList>

        {/* min-w-0 so the tables inside can scroll rather than stretch the
            rail off the side. */}
        {tabs.map((item) => (
          <TabVerticalContent
            key={item.value}
            value={item.value}
            className="min-w-0"
          >
            {panelFor(item.value, employee, profile)}
          </TabVerticalContent>
        ))}
      </TabVertical>
    </div>
  );
}
