"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
import { cn } from "cn"

/**
 * The tab rail's small-screen stand-in. Below `md` — the width where the app
 * nav collapses to a trigger — a row or column of tabs costs more space than
 * it is worth, so the same set reads as a select. Pair it with a tab list
 * hidden under the same breakpoint, both driven by the tabs root's value.
 */
function TabSelect({
  tabs,
  value,
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectTrigger>, "onValueChange"> & {
  tabs: { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={(next) => onValueChange(next as string)}>
      <SelectTrigger
        data-slot="tab-select"
        aria-label="Select a tab"
        className={cn("w-full", className)}
        {...props}
      >
        <SelectValue>
          {(current) => tabs.find((tab) => tab.value === current)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {tabs.map((tab) => (
          <SelectItem key={tab.value} value={tab.value}>
            {tab.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { TabSelect }
