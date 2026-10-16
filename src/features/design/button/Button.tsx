import {
  ArrowRightIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  Trash2Icon,
} from "@components/icons";

import { Button } from "@components/ui/button";
import { Spinner } from "@components/ui/spinner";
import { DesignPage, Example } from "@features/design/example";

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

const sizes = ["xs", "sm", "default", "lg"] as const;

const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

export function ButtonPage() {
  return (
    <DesignPage title="Button">
      <Example
        title="Variants"
        description="Six of them, in rough order of weight. Default carries the one action a
          screen is really about; outline and secondary sit beside it; ghost and
          link recede into their surroundings. Destructive is tinted rather than
          filled, so a dangerous action looks serious without shouting."
      >
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </Example>

      <Example
        title="Sizes"
        description="Four heights, from 24px to 36px. The small sizes also tighten their
          radius and shrink their icons so the proportions hold."
      >
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Button key={size} variant="outline" size={size}>
              {size}
            </Button>
          ))}
        </div>
      </Example>

      <Example
        title="Icon only"
        description="Square counterparts to the four sizes, for toolbars and row actions.
          They carry no label, so each one needs an aria-label."
      >
        <div className="flex flex-wrap items-center gap-3">
          {iconSizes.map((size) => (
            <Button
              key={size}
              variant="outline"
              size={size}
              aria-label={`Add (${size})`}
            >
              <PlusIcon />
            </Button>
          ))}
        </div>
      </Example>

      <Example
        title="With an icon"
        description="An icon marked data-icon='inline-start' or 'inline-end' tightens the
          padding on that side, so the icon doesn't float away from the edge."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <PlusIcon data-icon="inline-start" />
            Add employee
          </Button>
          <Button variant="outline">
            <SlidersHorizontalIcon data-icon="inline-start" />
            Filters
          </Button>
          <Button variant="secondary">
            Continue
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="destructive">
            <Trash2Icon data-icon="inline-start" />
            Delete
          </Button>
        </div>
      </Example>

      <Example
        title="States"
        description="Disabled drops to 50% and stops taking pointer events. A spinner in
          place of the leading icon keeps the label and width steady while work
          is in flight."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {variants.map((variant) => (
              <Button key={variant} variant={variant} disabled>
                {variant}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>
              <Spinner data-icon="inline-start" />
              Saving
            </Button>
            <Button variant="outline" disabled>
              <Spinner data-icon="inline-start" />
              Saving
            </Button>
          </div>
        </div>
      </Example>
    </DesignPage>
  );
}
