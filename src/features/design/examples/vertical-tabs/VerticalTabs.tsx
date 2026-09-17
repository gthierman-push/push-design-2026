import { useState } from "react";

import { Button } from "@components/ui/button";
import { TabSelect } from "@components/ui/tab-select";
import {
  TabVertical,
  TabVerticalContent,
  TabVerticalList,
  TabVerticalTrigger,
} from "@components/ui/tab-vertical";
import { PlaceholderContent } from "@features/design/example";

const tabs = [
  { value: "general", label: "General" },
  { value: "notifications", label: "Notifications" },
  { value: "roles", label: "Roles" },
  { value: "integrations", label: "Integrations" },
];

export function VerticalTabs() {
  const [tab, setTab] = useState(tabs[0].value);

  return (
    <TabVertical
      value={tab}
      onValueChange={(value) => setTab(value as string)}
      className="flex-col gap-6 md:flex-row md:gap-8"
    >
      <TabVerticalList className="hidden w-48 shrink-0 md:inline-flex">
        {tabs.map((tab) => (
          <TabVerticalTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabVerticalTrigger>
        ))}
      </TabVerticalList>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Vertical tabs
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">Secondary</Button>
            <Button>Primary</Button>
          </div>
        </div>

        <TabSelect
          tabs={tabs}
          value={tab}
          onValueChange={setTab}
          className="md:hidden"
        />

        {tabs.map((tab) => (
          <TabVerticalContent key={tab.value} value={tab.value}>
            <PlaceholderContent>{tab.label}</PlaceholderContent>
          </TabVerticalContent>
        ))}
      </div>
    </TabVertical>
  );
}
