import { NavLink } from "react-router";
import {
  CalendarPlusIcon,
  LayoutDashboardIcon,
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

export function Dashboard() {
  return (
    <Empty className="border-border h-full rounded-xl border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutDashboardIcon />
        </EmptyMedia>
        <EmptyTitle>Nothing to report yet</EmptyTitle>
        <EmptyDescription>
          Hours, labour cost and coverage show up here once there is a schedule
          to measure. Build one, or bring your team in first.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button render={<NavLink to="/scheduler" />}>
            <CalendarPlusIcon data-icon="inline-start" />
            Create a schedule
          </Button>
          <Button variant="outline" render={<NavLink to="/employees" />}>
            <UserPlusIcon data-icon="inline-start" />
            Add employees
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
