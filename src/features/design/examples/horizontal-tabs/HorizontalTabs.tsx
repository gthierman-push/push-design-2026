import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  TabHorizontal,
  TabHorizontalContent,
  TabHorizontalList,
  TabHorizontalTrigger,
} from "@components/ui/tab-horizontal";

const shifts = [
  { date: "Mon, Sep 15", role: "Line cook", hours: "8.0", status: "Approved" },
  { date: "Tue, Sep 16", role: "Line cook", hours: "7.5", status: "Approved" },
  { date: "Wed, Sep 17", role: "Prep", hours: "6.0", status: "Pending" },
  { date: "Thu, Sep 18", role: "Line cook", hours: "8.0", status: "Pending" },
];

const timeOff = [
  { range: "Oct 2 – Oct 6", type: "Vacation", days: "5", status: "Approved" },
  { range: "Nov 28", type: "Sick", days: "1", status: "Taken" },
  { range: "Dec 24 – Dec 26", type: "Vacation", days: "3", status: "Pending" },
];

const documents = [
  { name: "Direct deposit form", updated: "Updated Aug 2, 2026" },
  { name: "Food safety certificate", updated: "Expires Mar 14, 2027" },
  { name: "Signed offer letter", updated: "Updated Jan 9, 2024" },
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-2xl font-medium">{value}</span>
    </div>
  );
}

export function HorizontalTabs() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Horizontal tabs</h1>

      <TabHorizontal defaultValue="overview">
        <TabHorizontalList>
          <TabHorizontalTrigger value="overview">Overview</TabHorizontalTrigger>
          <TabHorizontalTrigger value="schedule">Schedule</TabHorizontalTrigger>
          <TabHorizontalTrigger value="time-off">Time off</TabHorizontalTrigger>
          <TabHorizontalTrigger value="documents">
            Documents
          </TabHorizontalTrigger>
        </TabHorizontalList>

        <TabHorizontalContent value="overview" className="pt-6">
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="flex flex-wrap gap-10">
                <Stat label="Hours this period" value="29.5" />
                <Stat label="Overtime" value="0.0" />
                <Stat label="Time off balance" value="42h" />
                <Stat label="Shifts this month" value="14" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Certified for the grill station. Prefers morning shifts and has
                open availability on weekends through the end of the quarter.
              </CardContent>
            </Card>
          </div>
        </TabHorizontalContent>

        <TabHorizontalContent value="schedule" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift.date}>
                      <TableCell>{shift.date}</TableCell>
                      <TableCell>{shift.role}</TableCell>
                      <TableCell>{shift.hours}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            shift.status === "Approved"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {shift.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabHorizontalContent>

        <TabHorizontalContent value="time-off" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dates</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeOff.map((request) => (
                    <TableRow key={request.range}>
                      <TableCell>{request.range}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.days}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "Pending"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabHorizontalContent>

        <TabHorizontalContent value="documents" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              {documents.map((document, index) => (
                <div key={document.name}>
                  {index > 0 ? <Separator /> : null}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {document.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {document.updated}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabHorizontalContent>
      </TabHorizontal>
    </div>
  );
}
