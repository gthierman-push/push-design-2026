/**
 * Every tab of a profile but the first: what they are rostered on, what they
 * have asked off, how they are doing, what they owe, what is in their file,
 * and what has happened to the record. The Overview tab stays on the page
 * itself, because it is the page -- these are what you go looking for.
 */

import type { ReactNode } from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarOffIcon,
  DownloadIcon,
  FileTextIcon,
  ListChecksIcon,
  PlusIcon,
  TrophyIcon,
  UploadIcon,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";

import { Detail, DetailList, day, tint } from "./profile-parts";
import type { Profile } from "./profile";
import type { RosterRow } from "./roster";

/** A table is flush with its card, so the first and last cells put the
 *  card's own gutter back on the text while the rules keep the full width.
 *  The Performance page's table is laid out the same way. */
const edge = "pl-4";
const edgeEnd = "pr-4";

/** A card whose whole body is a table: header above, nothing but the table
 *  below it, and no bottom padding for the last row to float in. */
function TableCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="gap-0 overflow-hidden pb-0">
      <CardHeader className="pb-(--card-spacing)">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      {children}
    </Card>
  );
}

/** Why a schedule is empty, in the words of whatever state they are in --
 *  "no upcoming shifts" is the wrong thing to say about someone on leave. */
function noShifts(employee: RosterRow) {
  if (employee.status === "Inactive") {
    return "Nobody off the roster is scheduled.";
  }

  if (employee.status === "On leave" && "returns" in employee) {
    return `Away until ${employee.returns}, so nothing is rostered before then.`;
  }

  return "Nothing rostered in the next two weeks.";
}

export function ScheduleTab({
  employee,
  profile,
}: {
  employee: RosterRow;
  profile: Profile;
}) {
  const total = profile.shifts.reduce((sum, shift) => sum + shift.hours, 0);

  return (
    <TableCard
      title="Upcoming shifts"
      description={
        profile.shifts.length > 0
          ? `${profile.shifts.length} shifts, ${total} hours over the next two weeks`
          : "The next two weeks"
      }
      action={
        /* Nobody schedules someone who has left, so the one action this
             card offers goes with them. */
        employee.status === "Inactive" ? undefined : (
          <Button variant="outline" size="sm">
            <PlusIcon data-icon="inline-start" />
            Add shift
          </Button>
        )
      }
    >
      {profile.shifts.length === 0 ? (
        <CardContent className="pb-(--card-spacing)">
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarOffIcon />
              </EmptyMedia>
              <EmptyTitle>No shifts scheduled</EmptyTitle>
              <EmptyDescription>{noShifts(employee)}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={edge}>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className={edgeEnd}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className={`${edge} font-medium`}>
                  {format(parseISO(shift.on), "EEE, MMM d")}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {shift.start} – {shift.end}
                </TableCell>
                <TableCell className="tabular-nums">{shift.hours}</TableCell>
                <TableCell>{shift.position}</TableCell>
                <TableCell>{shift.location}</TableCell>
                <TableCell className={edgeEnd}>
                  {/* A posted shift is one they have been told about; the
                        far end of the fortnight is still being written. */}
                  <Badge variant={shift.published ? "secondary" : "outline"}>
                    {shift.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableCard>
  );
}

export function TimeOffTab({
  employee,
  profile,
}: {
  employee: RosterRow;
  profile: Profile;
}) {
  const taken = profile.timeOff
    .filter((request) => request.status === "Approved")
    .reduce((sum, request) => sum + request.days, 0);

  const pending = profile.timeOff
    .filter((request) => request.status === "Pending")
    .reduce((sum, request) => sum + request.days, 0);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
          <CardDescription>
            Accrued on hours worked, as this company's policy has it
          </CardDescription>
          <CardAction>
            <Button variant="outline" size="sm">
              <PlusIcon data-icon="inline-start" />
              Request time off
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* Three rows do not need the card's whole width -- a label and a
              number a metre apart is harder to read, not easier. */}
          <DetailList className="max-w-md">
            <Detail label="Banked">{employee.timeOffDays} days</Detail>
            <Detail label="Taken">{taken} days</Detail>
            <Detail label="Awaiting approval">
              {pending > 0 ? (
                `${pending} days`
              ) : (
                <span className="text-muted-foreground font-normal">
                  Nothing outstanding
                </span>
              )}
            </Detail>
          </DetailList>
        </CardContent>
      </Card>

      <TableCard title="Requests" description="Newest first">
        {profile.timeOff.length === 0 ? (
          <CardContent className="pb-(--card-spacing)">
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>No requests</EmptyTitle>
                <EmptyDescription>
                  Nothing has been asked for or booked.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={edge}>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead className={edgeEnd}>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.timeOff.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className={`${edge} font-medium`}>
                    {request.type}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {request.dates}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {request.days > 0 ? request.days : "—"}
                  </TableCell>
                  <TableCell className={edgeEnd}>
                    <Badge
                      variant={
                        request.status === "Declined"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        request.status === "Approved"
                          ? tint.good
                          : request.status === "Pending"
                            ? tint.warn
                            : undefined
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableCard>
    </div>
  );
}

export function FilesTab({ profile }: { profile: Profile }) {
  const unsigned = profile.files.filter(
    (file) => file.status === "Awaiting signature",
  ).length;

  return (
    <TableCard
      title="Files"
      description={
        unsigned > 0
          ? `${profile.files.length} on file, ${unsigned} still to be signed`
          : `${profile.files.length} on file, all signed`
      }
      action={
        <Button variant="outline" size="sm">
          <UploadIcon data-icon="inline-start" />
          Upload
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={edge}>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Added</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={`w-12 ${edgeEnd}`}>
              <span className="sr-only">Download</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profile.files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className={edge}>
                <span className="flex items-center gap-2 font-medium">
                  <FileTextIcon className="text-muted-foreground size-4" />
                  {file.name}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {file.category}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {day(file.addedOn)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    file.status === "Awaiting signature"
                      ? "secondary"
                      : "outline"
                  }
                  className={
                    file.status === "Awaiting signature" ? tint.warn : undefined
                  }
                >
                  {file.status}
                </Badge>
              </TableCell>
              <TableCell className={edgeEnd}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Download ${file.name}`}
                >
                  <DownloadIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  );
}

export function ActivityTab({ profile }: { profile: Profile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          Everything that has happened to this record, newest first
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {profile.activity.map((event, index) => (
            <li key={event.id} className="flex gap-3">
              {/* The dot marks the event and the line carries on to the next
                  one, so the last entry draws a dot and stops. */}
              <div className="flex flex-col items-center pt-1.5">
                <span className="bg-primary-alt size-2 shrink-0 rounded-full" />
                {index < profile.activity.length - 1 && (
                  <span className="bg-border my-1 w-px flex-1" />
                )}
              </div>
              <div
                className={
                  index < profile.activity.length - 1
                    ? "flex flex-col gap-0.5 pb-5"
                    : "flex flex-col gap-0.5"
                }
              >
                <span className="font-medium">{event.title}</span>
                <span className="text-muted-foreground">{event.detail}</span>
                <span className="text-muted-foreground text-xs">
                  {day(event.on)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

/**
 * A tab with nothing behind it yet. The rail is the point of these: someone
 * looking for a review or a checklist finds the place it will live rather
 * than concluding the profile has no such thing. The dashed edge is the same
 * one an unknown employee gets, which is what marks it as a hole rather than
 * an empty table.
 */
function Unbuilt({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Empty className="border-border min-h-80 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function PerformanceTab({ employee }: { employee: RosterRow }) {
  return (
    <Unbuilt
      icon={TrophyIcon}
      title="Nothing here yet"
      description={`Reviews, ratings and goals for ${employee.name.split(" ")[0]} will be here. The company-wide view is on the Performance page.`}
    />
  );
}

export function TasksTab({ employee }: { employee: RosterRow }) {
  return (
    <Unbuilt
      icon={ListChecksIcon}
      title="Nothing here yet"
      description={`What ${employee.name.split(" ")[0]} has been asked to do — onboarding, training, anything assigned — will be here.`}
    />
  );
}
