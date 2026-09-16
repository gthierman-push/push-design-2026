import { useState } from "react";
import {
  AlertTriangleIcon,
  BanknoteIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CircleXIcon,
  InfoIcon,
  ListChecksIcon,
  UserRoundCheckIcon,
} from "lucide-react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@components/ui/native-select";
import { Progress } from "@components/ui/progress";

type Severity = "critical" | "warning";

const setupIssues: { severity: Severity; label: string }[] = [
  { severity: "critical", label: "20 Active Employees do not have a valid address" },
  { severity: "critical", label: "20 Active Employees have an invalid tax setup" },
  { severity: "critical", label: "2 Positions are missing minimum wage information" },
  { severity: "warning", label: "21 Active Employees have an invalid SSN" },
  { severity: "warning", label: "2 Active Employees have invalid hire dates." },
];

const taxSeasonChecks = [
  {
    icon: ListChecksIcon,
    label: "All taxable benefits have been entered into Push",
  },
  {
    icon: BanknoteIcon,
    label:
      "Everyone has been paid and there are no further payruns or offruns to run",
  },
  {
    icon: UserRoundCheckIcon,
    label:
      "Anyone paid outside of Push that requires a T4 has been entered into Push (for example, someone paid in a previous payroll system)",
  },
];

/** Tax-season reminder, shown once on arrival at the payroll screen. */
function TaxSeasonDialog() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Tax season is approaching</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <DialogDescription className="font-medium">
            Your T4 checklist
          </DialogDescription>
          <div className="divide-border flex flex-col divide-y rounded-lg border">
            {taxSeasonChecks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-3 px-5 py-4">
                <Icon className="text-muted-foreground size-5 shrink-0" />
                <p className="text-sm leading-5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button className="w-full" />}>Got It</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** A labelled fact in the pay-period summary strip. */
function PeriodFact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2 text-xl font-semibold">
        {children}
      </div>
    </div>
  );
}

/** One numbered row of the run-payroll checklist. */
function Step({
  marker,
  title,
  description,
  children,
}: {
  marker: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 border-t p-4 sm:gap-4 sm:p-6">
      <div className="mt-0.5 shrink-0">{marker}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Numbered circle for a step that is not yet started. */
function StepNumber({ n }: { n: number }) {
  return (
    <span className="bg-muted text-muted-foreground flex size-6 items-center justify-center rounded-full text-xs font-medium tabular-nums">
      {n}
    </span>
  );
}

function IssueRow({ severity, label }: { severity: Severity; label: string }) {
  const Icon = severity === "critical" ? CircleXIcon : AlertTriangleIcon;

  return (
    <Collapsible className="bg-muted/40 rounded-lg border">
      <CollapsibleTrigger className="group/issue flex w-full items-center gap-2 p-2.5 text-left text-sm">
        <ChevronRightIcon className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[panel-open]/issue:rotate-90" />
        <Icon
          className={
            severity === "critical"
              ? "text-destructive size-4 shrink-0"
              : "size-4 shrink-0 text-amber-600 dark:text-amber-500"
          }
        />
        <span className="min-w-0 flex-1">{label}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground border-t px-9 py-2.5 text-sm">
        The affected records are listed here.
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Payroll() {
  const [testRun, setTestRun] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <TaxSeasonDialog />

      <Card className="gap-0 overflow-hidden py-0">
        {/* Pay period picker and the dates that follow from it. */}
        <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="pay-period" className="font-semibold">
                Select Pay Period
              </Label>
              <p className="text-muted-foreground text-sm">
                Semi-monthly · 24 pay periods per year
              </p>
            </div>
            <NativeSelect className="w-full max-w-xs">
              <NativeSelectOption>
                2026-07-01 – 2026-07-15 (Next)
              </NativeSelectOption>
              <NativeSelectOption>2026-06-16 – 2026-06-30</NativeSelectOption>
              <NativeSelectOption>2026-06-01 – 2026-06-15</NativeSelectOption>
            </NativeSelect>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <PeriodFact label="Payroll period">Jul 1 - Jul 15</PeriodFact>
            <PeriodFact label="Submission Deadline">
              Jul 15 2026 2:00 PM
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                Due in 7 days
              </Badge>
            </PeriodFact>
            <PeriodFact label="Payday">
              Jul 17th 2026
              <InfoIcon className="text-muted-foreground size-4" />
            </PeriodFact>
          </div>
        </CardContent>

        {/* Checklist header with overall progress. */}
        <CardContent className="flex flex-col gap-3 border-t p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Run payroll</h2>
              <p className="text-muted-foreground text-sm">
                Review everything below, then run this pay period.
              </p>
            </div>
            <span className="text-muted-foreground shrink-0 text-sm">
              0 of 4 done
            </span>
          </div>
          <Progress value={0} />
        </CardContent>

        <Step
          marker={
            <span className="bg-destructive/10 text-destructive flex size-6 items-center justify-center rounded-full">
              <CircleXIcon className="size-4" />
            </span>
          }
          title="Resolve setup issues"
          description="We found 3 issue(s) that must be fixed before running payroll, and 2 warning(s) to review (these won't block payroll)."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              Mark complete
            </Button>
            <Badge variant="destructive">
              <CircleXIcon data-icon="inline-start" />3 Critical
            </Badge>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
            >
              <AlertTriangleIcon data-icon="inline-start" />2 Warning
            </Badge>
            <Button variant="link" size="sm">
              Expand all
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {setupIssues.map((issue) => (
              <IssueRow key={issue.label} {...issue} />
            ))}
          </div>
        </Step>

        <Step
          marker={<StepNumber n={2} />}
          title="Review clocks"
          description="Review and approve your team's hours so the right amounts flow into payroll."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              Mark complete
            </Button>
            <Button variant="outline" size="sm">
              Add clocks
            </Button>
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <CheckCircle2Icon data-icon="inline-start" />1 Approved clocks
            </Badge>
            <Badge variant="destructive">
              <CircleXIcon data-icon="inline-start" />3 Unapproved clocks
            </Badge>
            <Badge variant="outline">
              <AlertTriangleIcon data-icon="inline-start" />0 Long hours
            </Badge>
          </div>
          <Button variant="link" size="sm" className="self-start px-0">
            View Audit Clock Approvals Report
          </Button>
        </Step>

        <Step
          marker={<StepNumber n={3} />}
          title="Review earnings & deductions"
          description="Review the earnings and deductions applied to this pay period."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              Mark complete
            </Button>
            <Button variant="outline" size="sm">
              Add earning/deduction
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            No earnings or deductions in this pay period.
          </p>
          <Button variant="link" size="sm" className="self-start px-0">
            View Earnings & Deductions Report
          </Button>
        </Step>

        {/* Final step keeps its action inline on the right. */}
        <div className="flex flex-wrap items-center gap-4 border-t p-4 sm:p-6">
          <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
            <StepNumber n={4} />
            <div>
              <h3 className="font-semibold">Run this payroll</h3>
              <p className="text-muted-foreground text-sm">
                Finish the steps above to unlock running payroll.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-muted-foreground gap-2 font-normal">
              <Checkbox
                checked={testRun}
                onCheckedChange={(checked) => setTestRun(checked === true)}
              />
              This is a test run
            </Label>
            <Button disabled>Run payroll</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
