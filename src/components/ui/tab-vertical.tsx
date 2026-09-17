"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "cn"

/**
 * Nav tabs: a column that reads like the sidebar. The active row takes an
 * accent fill and a primary-alt marker, which sits in the list's left gutter
 * rather than on top of the fill.
 */
function TabVertical({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tab-vertical"
      orientation="vertical"
      className={cn("flex gap-2", className)}
      {...props}
    />
  )
}

function TabVerticalList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tab-vertical-list"
      className={cn(
        "inline-flex h-fit w-fit flex-col items-center justify-center gap-1 p-[3px] pl-3 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabVerticalTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tab-vertical-trigger"
      className={cn(
        "relative inline-flex h-7 w-full items-center justify-start gap-1.5 rounded-md border border-transparent py-0.5 pr-1.5 pl-2 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all",
        "hover:bg-accent/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground",
        "has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:bg-accent data-active:font-medium data-active:text-foreground dark:data-active:bg-accent dark:data-active:text-foreground",
        // The marker lives in the list's left gutter, clear of the fill.
        "after:absolute after:top-1/2 after:-left-2 after:h-5 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-primary-alt after:opacity-0 after:transition-opacity data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabVerticalContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tab-vertical-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export {
  TabVertical,
  TabVerticalList,
  TabVerticalTrigger,
  TabVerticalContent,
}
