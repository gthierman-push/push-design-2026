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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "@components/ui/native-select";
import { toast } from "@components/ui/toast";
import { Progress } from "@components/ui/progress";

type Severity = "critical" | "warning";

const setupIssues: { severity: Severity; label: string }[] = [
  {
    severity: "critical",
    label: "20 Active Employees do not have a valid address",
  },
  {
    severity: "critical",
    label: "20 Active Employees have an invalid tax setup",
  },
  {
    severity: "critical",
    label: "2 Positions are missing minimum wage information",
  },
  { severity: "warning", label: "21 Active Employees have an invalid SSN" },
  { severity: "warning", label: "2 Active Employees have invalid hire dates." },
];

const taxSeasonChecks = [
  {
    icon: ListChecksIcon,
    task: "Enter all taxable benefits",
    attestation: "All taxable benefits have been entered into Push",
    reason: "I haven't entered all taxable benefits into Push",
  },
  {
    icon: BanknoteIcon,
    task: "Complete all payruns and offruns",
    attestation:
      "Everyone has been paid and there are no further payruns or offruns to run",
    reason: "I still have payruns or offruns left to run",
  },
  {
    icon: UserRoundCheckIcon,
    task: "Enter all external payroll data (e.g. from a previous payroll system)",
    attestation:
      "Anyone paid outside of Push that requires a T4 has been entered into Push (for example, someone paid in a previous payroll system)",
    reason:
      "I haven't entered everyone who was paid outside of Push and needs a T4",
  },
];

/** The reasons list ends in a free-text escape hatch the checklist has no need for. */
const otherReason = "Other";

/** The checklist, under its shared label. Rows differ between the two steps. */
function ChecklistCard({
  label = "Your T4 checklist",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <DialogDescription className="font-medium">{label}</DialogDescription>
      <div className="divide-border flex flex-col divide-y rounded-lg border">
        {children}
      </div>
    </div>
  );
}

/** One checkbox row of a checklist. `children` sits under it when revealed. */
function CheckRow({
  label,
  checked,
  onCheckedChange,
  children,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 px-5 py-3">
      <label className="flex cursor-pointer items-start gap-3">
        <span className="flex size-5 shrink-0 items-center justify-center">
          <Checkbox
            checked={checked}
            onCheckedChange={(value) => onCheckedChange(value === true)}
          />
        </span>
        <span className="text-sm leading-5">{label}</span>
      </label>
      {children}
    </div>
  );
}

/** Adds or removes one value from a list of checked items. */
function toggle(current: string[], value: string, checked: boolean) {
  return checked
    ? [...current, value]
    : current.filter((item) => item !== value);
}

/**
 * Three steps on arrival at the payroll screen: a tax-season reminder, a
 * confirmation that gates processing on every item being acknowledged, and —
 * for anyone who needs more time — the same checklist asked the other way, so
 * we learn what is holding them up.
 */
function TaxSeasonDialogs() {
  const [step, setStep] = useState<"reminder" | "confirm" | "reasons" | null>(
    "reminder",
  );
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [otherDetail, setOtherDetail] = useState("");
  const allAcknowledged = acknowledged.length === taxSeasonChecks.length;
  const needsDetail = reasons.includes(otherReason);
  const canSubmitReasons =
    reasons.length > 0 && (!needsDetail || otherDetail.trim() !== "");

  const dismiss = (open: boolean) => {
    if (!open) setStep(null);
  };

  return (
    <>
      <Dialog open={step === "reminder"} onOpenChange={dismiss}>
        <DialogContent className="sm:max-w-xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Tax season is approaching</DialogTitle>
          </DialogHeader>

          <ChecklistCard>
            {taxSeasonChecks.map(({ icon: Icon, task }) => (
              <div key={task} className="flex items-start gap-3 px-5 py-3">
                <Icon className="text-muted-foreground size-5 shrink-0" />
                <p className="text-sm leading-5">{task}</p>
              </div>
            ))}
          </ChecklistCard>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setStep(null);
                toast.add({
                  type: "success",
                  title: "We will remind you later.",
                  description:
                    "This checklist will be waiting the next time you open Payroll.",
                });
              }}
            >
              Remind Me Later
            </Button>
            <Button onClick={() => setStep("confirm")}>Got It</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={step === "confirm"} onOpenChange={dismiss}>
        <DialogContent className="sm:max-w-xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Can we start processing T4s?</DialogTitle>
          </DialogHeader>

          <ChecklistCard>
            {taxSeasonChecks.map(({ attestation }) => (
              <CheckRow
                key={attestation}
                label={attestation}
                checked={acknowledged.includes(attestation)}
                onCheckedChange={(checked) =>
                  setAcknowledged((current) =>
                    toggle(current, attestation, checked),
                  )
                }
              />
            ))}
          </ChecklistCard>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setStep("reasons")}>
              I Need More Time
            </Button>
            <Button
              disabled={!allAcknowledged}
              onClick={() => {
                setStep(null);
                toast.add({
                  type: "success",
                  title: "2026 T4s are being processed.",
                  description:
                    "You will receive an email when the T4s have been issued.",
                });
              }}
            >
              I&apos;m Ready To Process T4s
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={step === "reasons"} onOpenChange={dismiss}>
        <DialogContent className="sm:max-w-xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>What do you still need to do?</DialogTitle>
          </DialogHeader>

          <ChecklistCard label="Tell us what is outstanding">
            {taxSeasonChecks.map(({ reason }) => (
              <CheckRow
                key={reason}
                label={reason}
                checked={reasons.includes(reason)}
                onCheckedChange={(checked) =>
                  setReasons((current) => toggle(current, reason, checked))
                }
              />
            ))}

            <CheckRow
              label={otherReason}
              checked={needsDetail}
              onCheckedChange={(checked) =>
                setReasons((current) => toggle(current, otherReason, checked))
              }
            >
              {needsDetail ? (
                <Textarea
                  value={otherDetail}
                  onChange={(event) => setOtherDetail(event.target.value)}
                  placeholder="What is holding you up?"
                  aria-label="Your reason"
                  // Textarea is w-full by default, which the indent would
                  // push past the row's edge; stretching fills what is left.
                  className="ml-8 w-auto"
                  rows={3}
                />
              ) : null}
            </CheckRow>
          </ChecklistCard>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setStep("confirm")}>
              Back
            </Button>
            <Button
              disabled={!canSubmitReasons}
              onClick={() => {
                setStep(null);
                toast.add({
                  type: "success",
                  title: "Thanks — we will hold off on your T4s.",
                  description:
                    "We will check back with you before the filing deadline.",
                });
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
      <TaxSeasonDialogs />

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
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
              >
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
