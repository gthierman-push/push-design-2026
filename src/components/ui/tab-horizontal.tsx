"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "cn"

/**
 * Underline tabs: labels on a full-width rail, with a primary-alt bar sitting
 * on the rule under the active one. Triggers size to their label, so the bar
 * matches the text width.
 */
function TabHorizontal({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tab-horizontal"
      orientation="horizontal"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabHorizontalList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tab-horizontal-list"
      className={cn(
        "inline-flex h-8 w-full items-center justify-start gap-3 border-b text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabHorizontalTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tab-horizontal-trigger"
      className={cn(
        "relative inline-flex h-full flex-none items-center justify-center gap-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all",
        "hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:text-foreground dark:data-active:text-foreground",
        // The marker overlaps the list's 1px rule rather than floating below it.
        "after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-primary-alt after:opacity-0 after:transition-opacity data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabHorizontalContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tab-horizontal-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export {
  TabHorizontal,
  TabHorizontalList,
  TabHorizontalTrigger,
  TabHorizontalContent,
}
