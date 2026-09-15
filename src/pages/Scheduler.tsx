import { NavLink } from "react-router";
import {
  CalendarRangeIcon,
  CopyIcon,
  PlusIcon,
  UserPlusIcon,
} from "lucide-react";

import { Button } from "@components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@components/ui/empty";

export function Scheduler() {
  return (
    <Empty className="border-border h-full rounded-xl border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarRangeIcon />
        </EmptyMedia>
        <EmptyTitle>No shifts this week</EmptyTitle>
        <EmptyDescription>
          Start from an empty week and add shifts as you go, or copy the shape
          of a week you have already built.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>
            <PlusIcon data-icon="inline-start" />
            Add a shift
          </Button>
          <Button variant="outline">
            <CopyIcon data-icon="inline-start" />
            Copy last week
          </Button>
        </div>
        <Button variant="link" size="sm" render={<NavLink to="/employees" />}>
          <UserPlusIcon data-icon="inline-start" />
          Add employees first
        </Button>
      </EmptyContent>
    </Empty>
  );
}
