import { Button } from "@components/ui/button";
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
  return (
    <TabVertical defaultValue="general" className="gap-8">
      <TabVerticalList className="w-48 shrink-0">
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

        {tabs.map((tab) => (
          <TabVerticalContent key={tab.value} value={tab.value}>
            <PlaceholderContent>{tab.label}</PlaceholderContent>
          </TabVerticalContent>
        ))}
      </div>
    </TabVertical>
  );
}
