import { useState } from "react";
import { SparklesIcon } from "lucide-react";

import { currentPlanId, plans } from "@components/plans";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@components/ui/field";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { toast } from "@components/ui/toast";

/** The plan that first includes the feature the user was reaching for. */
function planFor(feature: string) {
  return plans.find((plan) => plan.highlights.includes(feature));
}

/** The plan the dialog opens on: the one that unlocks the feature, else the
 *  first one above what the account is on today. */
function defaultPlanId(feature: string) {
  const current = plans.findIndex((plan) => plan.id === currentPlanId);
  return planFor(feature)?.id ?? plans[current + 1]?.id ?? currentPlanId;
}

/**
 * Plan picker for a feature the account's plan does not include. Controlled,
 * so a page can open it from anywhere; `UpgradeButton` below is the default
 * way in.
 */
export function UpgradeDialog({
  feature,
  open,
  onOpenChange,
}: {
  /** The feature that prompted the upgrade, e.g. "Performance reviews". */
  feature: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = useState(() => defaultPlanId(feature));
  const unlockedBy = planFor(feature);
  const chosen = plans.find((plan) => plan.id === selected);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Reopening starts from the recommended plan again, not wherever the
        // last visit left off.
        if (!next) setSelected(defaultPlanId(feature));
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upgrade your plan</DialogTitle>
          <DialogDescription>
            {unlockedBy
              ? `${unlockedBy.name} includes ${feature}. Pick the plan you want to move to.`
              : "Pick the plan you want to move to."}
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selected}
          onValueChange={(value) => setSelected(value as string)}
          aria-label="Plans"
        >
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;

            return (
              <FieldLabel key={plan.id} htmlFor={`plan-${plan.id}`}>
                <Field
                  orientation="horizontal"
                  data-disabled={isCurrent ? "true" : undefined}
                >
                  <FieldContent>
                    <FieldTitle>
                      {plan.name}
                      {isCurrent ? (
                        <Badge variant="outline">Current plan</Badge>
                      ) : null}
                    </FieldTitle>
                    <FieldDescription>{plan.description}</FieldDescription>
                    <FieldDescription>
                      {plan.highlights.join(" · ")}
                    </FieldDescription>
                  </FieldContent>
                  <div className="flex items-center gap-3">
                    <div className="text-right whitespace-nowrap">
                      <div className="text-sm font-medium">{plan.price}</div>
                      <div className="text-muted-foreground text-xs">
                        per employee / mo
                      </div>
                    </div>
                    <RadioGroupItem
                      id={`plan-${plan.id}`}
                      value={plan.id}
                      disabled={isCurrent}
                    />
                  </div>
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            disabled={!chosen || chosen.id === currentPlanId}
            onClick={() => {
              onOpenChange(false);
              toast.add({
                type: "success",
                title: `Upgrading to ${chosen?.name}`,
                description:
                  "Someone from your account team will confirm the change by email.",
              });
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** The header action that opens the plan picker for a gated feature. */
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
