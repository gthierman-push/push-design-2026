import { useState } from "react";
import {
  CheckIcon,
  CornerDownRightIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import {
  currentPlanId,
  planIncluding,
  planOfferingAddOn,
  plans,
  type PlanFeature,
} from "@components/plans";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  TabDefault,
  TabDefaultList,
  TabDefaultTrigger,
} from "@components/ui/tab-default";
import { toast } from "@components/ui/toast";

/** How many of a package's features the dialog lists before summarising. */
const shownFeatures = 4;

/** The package the dialog opens on: the one that includes the feature, else
 *  the first one above what the account is on today. */
function defaultPlanId(feature: string) {
  const current = plans.findIndex((plan) => plan.id === currentPlanId);
  return planIncluding(feature)?.id ?? plans[current + 1]?.id ?? currentPlanId;
}

/** The line under the title: where the feature can be had, and on what terms. */
function availability(feature: string) {
  const included = planIncluding(feature);
  const addOn = planOfferingAddOn(feature);

  if (included && addOn) {
    return `Included on ${included.name}, or as an add-on to ${addOn.name}.`;
  }
  if (included) return `Included on ${included.name}.`;
  return "Pick the package you want to move to.";
}

/** One row of what the selected package adds. */
function FeatureRow({
  icon: Icon = CheckIcon,
  label,
  detail,
  addOn,
}: PlanFeature) {
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon className="text-muted-foreground size-4 shrink-0" />
        <span className="text-sm font-medium">{label}</span>
        {addOn ? (
          <Badge variant="outline" className="shrink-0">
            Add-on
          </Badge>
        ) : null}
      </div>
      {detail ? (
        <div className="text-muted-foreground flex items-center gap-2 pl-6 text-sm">
          <CornerDownRightIcon className="size-3.5 shrink-0" />
          {detail}
        </div>
      ) : null}
    </li>
  );
}

/**
 * Package picker for a feature the account's plan does not include: the
 * packages as a segmented strip, what the selected one adds, and what it
 * costs. Controlled, so a page can open it from anywhere; `UpgradeButton`
 * below is the default way in.
 */
export function UpgradeDialog({
  feature,
  open,
  onOpenChange,
  image = "/placeholder.svg",
}: {
  /** The feature that prompted the upgrade, e.g. "Employee Engagement". */
  feature: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The art in the right-hand panel. */
  image?: string;
}) {
  const [planId, setPlanId] = useState(() => defaultPlanId(feature));
  const plan = plans.find((item) => item.id === planId) ?? plans[0];
  const isCurrent = plan.id === currentPlanId;
  const included = planIncluding(feature);
  const remaining = plan.features.length - shownFeatures;
  // The feature the user came for leads the list, wherever the package
  // itself happens to rank it — on Supreme it is the last line of ten.
  const ordered = [
    ...plan.features.filter((item) => item.label === feature),
    ...plan.features.filter((item) => item.label !== feature),
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Reopening starts from the recommended package again, not wherever
        // the last visit left off.
        if (!next) setPlanId(defaultPlanId(feature));
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-3xl"
        showCloseButton={false}
      >
        {/* Held at a fixed height so switching packages does not resize the
            dialog under the pointer when one tier lists a feature fewer. */}
        <div className="grid sm:min-h-[600px] sm:grid-cols-[1fr_20rem]">
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle>
                {included ? `Upgrade to unlock ${feature}` : "Upgrade"}
              </DialogTitle>
              <DialogDescription>{availability(feature)}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <TabDefault
                value={planId}
                onValueChange={(value) => setPlanId(value as string)}
              >
                <TabDefaultList className="w-full">
                  {plans.map((item) => (
                    <TabDefaultTrigger key={item.id} value={item.id}>
                      {item.name}
                    </TabDefaultTrigger>
                  ))}
                </TabDefaultList>
              </TabDefault>
              <p className="text-muted-foreground flex justify-center gap-2 text-center text-xs">
                {isCurrent ? (
                  <Badge variant="outline">Current package</Badge>
                ) : (
                  plan.note
                )}
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {ordered.slice(0, shownFeatures).map((item) => (
                <FeatureRow key={item.label} {...item} />
              ))}
              {remaining > 0 ? (
                <li className="text-muted-foreground pl-6 text-sm">
                  and {remaining} more
                </li>
              ) : null}
            </ul>

            {/* The price and its action sit at the foot of the column however
                tall the feature list for the selected package happens to be. */}
            <div className="mt-auto flex flex-col gap-3 pt-4">
              <div className="flex items-baseline gap-2 rounded-lg border p-4">
                <span className="text-2xl font-semibold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">
                  {plan.priceNote}
                </span>
              </div>

              <Button
                size="lg"
                disabled={isCurrent}
                onClick={() => {
                  onOpenChange(false);
                  toast.add({
                    type: "success",
                    title: `We will be in touch about ${plan.name}`,
                    description:
                      "Someone from your account team will email you with a quote.",
                  });
                }}
              >
                {isCurrent
                  ? "Your current package"
                  : `Talk to sales about ${plan.name}`}
              </Button>
            </div>
          </div>

          {/* Mirrors the split the sign-in screen uses: art on the right, and
              nothing to miss when the viewport is too narrow for it. */}
          <div className="bg-muted relative hidden sm:block">
            <img
              src={image}
              alt=""
              className="absolute inset-0 size-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>

        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-background/70 hover:bg-background absolute top-4 right-4 rounded-full backdrop-blur-sm"
            />
          }
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

/** The header action that opens the package picker for a gated feature. */
export function UpgradeButton({ feature }: { feature: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <SparklesIcon data-icon="inline-start" />
        Upgrade
      </Button>
      <UpgradeDialog feature={feature} open={open} onOpenChange={setOpen} />
    </>
  );
}
