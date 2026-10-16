import { useState } from "react";
import { NavLink, useParams } from "react-router";
import { differenceInMonths, isAfter, parse, parseISO } from "date-fns";
import {
  ArrowLeftIcon,
  ClockIcon,
  EllipsisIcon,
  KeyRoundIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  PlaneIcon,
  ReceiptTextIcon,
  UserRoundCheckIcon,
  UserRoundXIcon,
} from "lucide-react";

import { useActiveAccount } from "@components/active-account";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
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
  TabHorizontal,
  TabHorizontalContent,
  TabHorizontalList,
  TabHorizontalTrigger,
} from "@components/ui/tab-horizontal";

import { EmployeeAvatar } from "./EmployeeAvatar";
import { managerFor, profileFor, teamOf, type Profile } from "./profile";
import {
  Detail,
  DetailList,
  Expiry,
  StatusBadge,
  day,
  daysUntil,
  tint,
} from "./profile-parts";
import { ActivityTab, FilesTab, ScheduleTab, TimeOffTab } from "./profile-tabs";
import { today } from "./records";
import { employeeFor, type RosterRow } from "./roster";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "schedule", label: "Schedule" },
  { value: "time-off", label: "Time off" },
  { value: "documents", label: "Documents" },
  { value: "activity", label: "Activity" },
];

/** The way back to the list, above whatever the page turns out to be. */
function BackToPeople() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 self-start"
      render={<NavLink to="/employees" />}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      People
    </Button>
  );
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

/** One number on the strip under the header. */
function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-heading text-lg leading-tight font-medium tabular-nums">
        {value}
      </span>
      <span className="text-muted-foreground truncate text-xs">{note}</span>
    </div>
  );
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
          <span className="text-muted-foreground text-xs">Reports to</span>
          {manager ? (
            <NavLink
              to={`/employees/${manager.id}`}
              className="flex items-center gap-2 hover:underline"
            >
              <EmployeeAvatar employee={manager} />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-medium">{manager.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {manager.position}
                </span>
              </span>
            </NavLink>
          ) : (
            <span className="text-muted-foreground">Nobody — they run it</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">
            {employee.department} at {employee.location}
          </span>
          {shown.length > 0 ? (
            <AvatarGroup>
              {shown.map((person) => (
                <Avatar key={person.id} title={person.name}>
                  <AvatarImage src={person.photo} alt={person.name} />
                  <AvatarFallback>
                    {person.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {team.length > shown.length && (
                <AvatarGroupCount>
                  +{team.length - shown.length}
                </AvatarGroupCount>
              )}
            </AvatarGroup>
          ) : (
            <span className="text-muted-foreground">
              The only one on this department's roster here
            </span>
          )}
        </div>
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
  const { contact, emergency, pay } = profile;

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Job</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList>
              <Detail label="Employee number">{profile.employeeNumber}</Detail>
              <Detail label="Position">{employee.position}</Detail>
              <Detail label="Department">{employee.department}</Detail>
              <Detail label="Location">{employee.location}</Detail>
              <Detail label="Employment">
                <Badge
                  variant={
                    employee.employment === "Full-time"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {employee.employment}
                </Badge>
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
              <Detail label="Scheduled hours">
                {employee.weeklyHours} hrs a week
              </Detail>
            </DetailList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Right to work and certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList>
              <Detail label={employee.permitStatus}>
                {/* Citizenship and residency do not run out, so there is
                    nothing here to warn about. */}
                {employee.permitExpires ? (
                  <Expiry expires={employee.permitExpires} />
                ) : (
                  <Badge variant="secondary" className={tint.good}>
                    No expiry
                  </Badge>
                )}
              </Detail>
              <Detail label="FoodSafe Level 1">
                <Expiry
                  expires={employee.foodSafeExpires}
                  required={employee.foodSafeExpires !== null}
                />
              </Detail>
              <Detail label="Serving It Right">
                <Expiry
                  expires={employee.servingItRightExpires}
                  required={employee.servingItRightExpires !== null}
                />
              </Detail>
            </DetailList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList>
              <Detail label="Hourly rate">${employee.wage.toFixed(2)}</Detail>
              <Detail label="Rate set">{day(pay.effectiveFrom)}</Detail>
              <Detail label="Pay cycle">{pay.cycle}</Detail>
              <Detail label="Paid by">{pay.method}</Detail>
              {/* Every rate before this one, so a raise can be read as the
                  change it was rather than as a number on its own. */}
              {pay.history.map((entry) => (
                <Detail key={entry.from} label={`Was, from ${day(entry.from)}`}>
                  <span className="text-muted-foreground font-normal">
                    {entry.reason} ·{" "}
                  </span>
                  ${entry.wage.toFixed(2)}
                </Detail>
              ))}
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
                <span className="block">{contact.street}</span>
                <span className="text-muted-foreground block font-normal">
                  {contact.city}
                </span>
              </Detail>
              <Detail label="Date of birth">
                {day(contact.bornOn)}
                <span className="text-muted-foreground font-normal">
                  {" "}
                  · {employee.age}
                </span>
              </Detail>
            </DetailList>
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
        <BackToPeople />
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
  /* Tenure, and the dates beside it, stop on the day somebody left. */
  const left =
    "reason" in employee
      ? {
          on: parse(employee.lastDay, "MMM d, yyyy", today()),
          day: employee.lastDay,
        }
      : null;

  return (
    <div className="flex flex-col gap-4">
      <BackToPeople />

      <Card className="gap-0">
        <CardHeader className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {/* Bigger than any size the avatar ships, so it takes the
                plain one -- the sm and lg classes are data-variants and
                would out-specify the override. */}
            <EmployeeAvatar
              employee={employee}
              size="default"
              className="size-16 *:data-[slot=avatar-fallback]:text-lg"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="font-heading truncate text-2xl font-semibold tracking-tight">
                {employee.name}
              </h1>
              <p className="text-muted-foreground truncate">
                {employee.position} · {employee.department} ·{" "}
                {employee.location}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <StatusBadge status={employee.status} />
                <Badge
                  variant={
                    employee.employment === "Full-time"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {employee.employment}
                </Badge>
                <Badge variant="outline">{profile.employeeNumber}</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real links, not buttons: Base UI needs telling, or it warns
                that the native button semantics have gone. */}
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href={`mailto:${profile.contact.email}`} />}
            >
              <MailIcon data-icon="inline-start" />
              Email
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href={`tel:${profile.contact.phone}`} />}
            >
              <PhoneIcon data-icon="inline-start" />
              Call
            </Button>
            <Button>
              <PencilIcon data-icon="inline-start" />
              Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
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
          </div>
        </CardHeader>

        {/* The five numbers somebody opens a profile to check, on the band
            the card already draws under its header. */}
        <CardFooter className="mt-(--card-spacing) grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Stat
            label="Hourly rate"
            value={`$${employee.wage.toFixed(2)}`}
            note={`Set ${day(profile.pay.effectiveFrom)}`}
          />
          <Stat
            label="Scheduled"
            value={`${employee.weeklyHours} hrs`}
            note={employee.weeklyHours > 40 ? "Into overtime" : "A week"}
          />
          <Stat
            label="Tenure"
            value={tenure(employee.hiredOn, left?.on ?? null)}
            note={
              left
                ? `${day(employee.hiredOn)} to ${left.day}`
                : `Since ${day(employee.hiredOn)}`
            }
          />
          <Stat
            label="Time off banked"
            value={`${employee.timeOffDays} days`}
            note="Accrued, not taken"
          />
          <Stat
            label="Last review"
            value={
              employee.rating !== null ? `${employee.rating} of 5` : "None"
            }
            note={
              employee.lastReviewOn
                ? day(employee.lastReviewOn)
                : "Never reviewed"
            }
          />
        </CardFooter>
      </Card>

      <StatusNotice employee={employee} />

      <TabHorizontal
        value={tab}
        onValueChange={(value) => setTab(value as string)}
      >
        <TabSelect
          tabs={tabs}
          value={tab}
          onValueChange={setTab}
          className="md:hidden"
        />
        <TabHorizontalList className="hidden md:inline-flex">
          {tabs.map((item) => (
            <TabHorizontalTrigger key={item.value} value={item.value}>
              {item.label}
            </TabHorizontalTrigger>
          ))}
        </TabHorizontalList>

        <TabHorizontalContent value="overview" className="pt-2">
          <OverviewTab employee={employee} profile={profile} />
        </TabHorizontalContent>
        <TabHorizontalContent value="schedule" className="pt-2">
          <ScheduleTab employee={employee} profile={profile} />
        </TabHorizontalContent>
        <TabHorizontalContent value="time-off" className="pt-2">
          <TimeOffTab employee={employee} profile={profile} />
        </TabHorizontalContent>
        <TabHorizontalContent value="documents" className="pt-2">
          <FilesTab profile={profile} />
        </TabHorizontalContent>
        <TabHorizontalContent value="activity" className="pt-2">
          <ActivityTab profile={profile} />
        </TabHorizontalContent>
      </TabHorizontal>
    </div>
  );
}
