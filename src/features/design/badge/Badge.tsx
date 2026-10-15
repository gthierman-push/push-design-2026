import {
  CheckIcon,
  ClockIcon,
  TagIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

import { Badge } from "@components/ui/badge";
import { DesignPage, Example } from "@features/design/example";

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

/**
 * Only destructive ships a tint of its own. Anything else that needs a colour
 * follows the same shape: a light pair for light mode, a dark pair for dark.
 */
const statuses = [
  {
    label: "Complete",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    label: "In review",
    className: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  },
];

const counts = [
  { label: "Scheduled", count: 24 },
  { label: "Awaiting approval", count: 7 },
  { label: "Unfilled", count: 1 },
];

export function BadgePage() {
  return (
    <DesignPage title="Badge">
      <Example
        title="Variants"
        description="Six of them, all the same 20px pill. Default is the loudest, so it's
          worth saving for the one state a screen is about; secondary and
          outline carry most of the labels in a table. Ghost and link only
          colour themselves on hover, and destructive is tinted rather than
          filled, so a bad state reads as serious without turning the row red."
      >
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </Example>

      <Example
        title="With an icon"
        description="Icons are pinned to 12px so they sit inside the pill rather than
          stretching it. Marking one data-icon='inline-start' or 'inline-end'
          pulls the padding on that side in to 6px, which keeps the icon off the
          curve."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">
            <CheckIcon data-icon="inline-start" />
            Approved
          </Badge>
          <Badge variant="secondary">
            <ClockIcon data-icon="inline-start" />
            Pending
          </Badge>
          <Badge variant="destructive">
            <TriangleAlertIcon data-icon="inline-start" />
            Missed punch
          </Badge>
          <Badge variant="secondary">
            Kitchen
            <XIcon data-icon="inline-end" />
          </Badge>
        </div>
      </Example>

      <Example
        title="Status"
        description="Destructive is the only tinted variant in the set. A status that needs
          its own colour borrows the same recipe through className — a 50/700
          pair in light, 950/400 in dark — which is what the employee and
          review tables do. Keep the list short; once every row is coloured,
          none of them say anything."
      >
        <div className="flex flex-wrap items-center gap-3">
          {statuses.map((status) => (
            <Badge key={status.label} className={status.className}>
              {status.label}
            </Badge>
          ))}
          <Badge variant="destructive">Terminated</Badge>
          <Badge variant="outline">Draft</Badge>
        </div>
      </Example>

      <Example
        title="Counts"
        description="A badge holds a number as readily as a word. Next to a label it only
          needs to be the quieter half of the pair, so outline beats default
          unless the count is the thing you want noticed. Secondary sits a shade
          off white, which reads as a number rather than a badge — fine in a
          table cell, thin on its own."
      >
        <div className="flex flex-wrap items-center gap-6">
          {counts.map((entry) => (
            <span
              key={entry.label}
              className="flex items-center gap-2 text-sm font-medium"
            >
              {entry.label}
              <Badge variant="outline">{entry.count}</Badge>
            </span>
          ))}
          <span className="flex items-center gap-2 text-sm font-medium">
            Overdue
            <Badge>3</Badge>
          </span>
        </div>
      </Example>

      <Example
        title="As a link"
        description="Pass an element to render and the badge becomes that element instead
          of a span. Each variant keeps a hover colour reserved for the anchor
          case, so a badge only looks clickable once it actually is one."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" render={<a href="#" />}>
            <TagIcon data-icon="inline-start" />
            Night shift
          </Badge>
          <Badge variant="outline" render={<a href="#" />}>
            Front of house
          </Badge>
          <Badge variant="default" render={<a href="#" />}>
            Payroll
          </Badge>
        </div>
      </Example>
    </DesignPage>
  );
}
