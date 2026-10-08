import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  RocketIcon,
  ChevronRightIcon,
} from "lucide-react";

import {
  getStartedStorageKey,
  getStartedSteps,
  seededSteps,
} from "@layouts/get-started";
import { Button } from "@components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import { Progress } from "@components/ui/progress";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@components/ui/sidebar";

/** What the checklist remembers between visits. */
type GetStartedState = {
  done: string[];
  open: boolean;
  dismissed: boolean;
};

const initialState: GetStartedState = {
  done: seededSteps,
  open: true,
  dismissed: false,
};

/**
 * Reads the stored state back, keeping only ids that are still steps — a step
 * that gets renamed or dropped should not keep counting towards the total.
 */
function loadState(): GetStartedState {
  try {
    const raw = localStorage.getItem(getStartedStorageKey);
    if (!raw) return initialState;

    const parsed = JSON.parse(raw) as Partial<GetStartedState>;
    return {
      done: Array.isArray(parsed.done)
        ? getStartedSteps
            .map((step) => step.id)
            .filter((id) => parsed.done?.includes(id))
        : initialState.done,
      open: typeof parsed.open === "boolean" ? parsed.open : initialState.open,
      dismissed: parsed.dismissed === true,
    };
  } catch {
    return initialState;
  }
}

/**
 * The setup checklist that sits at the foot of the app sidebar: how far along
 * the account is, and the handful of pages left to visit. Opening a step is
 * what completes it — the work is on the page the row points at, so the row
 * takes the reader there and ticks itself off on the way.
 *
 * It collapses to a single line of progress for anyone who wants it out of the
 * way, and can be put away for good once every step is done.
 */
export function GetStarted() {
  const [state, setState] = useState<GetStartedState>(loadState);

  useEffect(() => {
    localStorage.setItem(getStartedStorageKey, JSON.stringify(state));
  }, [state]);

  if (state.dismissed) return null;

  const total = getStartedSteps.length;
  const done = state.done.length;
  const complete = done === total;

  const markDone = (id: string) =>
    setState((previous) =>
      previous.done.includes(id)
        ? previous
        : { ...previous, done: [...previous.done, id] },
    );

  return (
    <Collapsible
      open={state.open}
      onOpenChange={(open) => setState((previous) => ({ ...previous, open }))}
      className="bg-background rounded-lg shadow-[0_0_0_1px_var(--sidebar-border)]"
    >
      {/* The header stays legible closed: the count and the bar say how much is
          left without the list having to be open. */}
      <CollapsibleTrigger className="group/get-started flex w-full flex-col gap-2 p-2 text-left">
        <div className="flex w-full items-center gap-2">
          <RocketIcon className="text-primary-alt size-4 shrink-0" />
          <span className="flex-1 truncate text-sm font-medium">
            {complete ? "You're all set" : "Get started"}
          </span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {done}/{total}
          </span>
          <ChevronRightIcon className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[panel-open]/get-started:rotate-90" />
        </div>
        <Progress
          value={Math.round((done / total) * 100)}
          aria-label="Setup progress"
          className="gap-0"
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t">
        <SidebarMenu className="p-1">
          {getStartedSteps.map((step) => {
            const stepDone = state.done.includes(step.id);
            return (
              <SidebarMenuItem key={step.id}>
                <SidebarMenuButton
                  onClick={() => markDone(step.id)}
                  render={<NavLink to={step.url} />}
                >
                  {stepDone ? (
                    <CircleCheckIcon className="text-primary-alt" />
                  ) : (
                    <CircleDashedIcon className="text-muted-foreground" />
                  )}
                  <span className={stepDone ? "text-muted-foreground" : ""}>
                    {step.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Only offered once the list is finished: closing it is permanent, and
            there is nothing left to come back for. */}
        {complete ? (
          <div className="flex items-center gap-2 border-t p-2">
            <p className="text-muted-foreground flex-1 text-xs">
              Nothing left to set up.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setState((previous) => ({ ...previous, dismissed: true }))
              }
            >
              Hide
            </Button>
          </div>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}
