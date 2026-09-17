import { Button } from "@components/ui/button";
import {
  TabHorizontal,
  TabHorizontalContent,
  TabHorizontalList,
  TabHorizontalTrigger,
} from "@components/ui/tab-horizontal";
import { PlaceholderContent } from "@features/design/example";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "schedule", label: "Schedule" },
  { value: "time-off", label: "Time off" },
  { value: "documents", label: "Documents" },
];

export function HorizontalTabs() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Horizontal tabs
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Secondary</Button>
          <Button>Primary</Button>
        </div>
      </div>

      <TabHorizontal defaultValue="overview">
        <TabHorizontalList>
          {tabs.map((tab) => (
            <TabHorizontalTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabHorizontalTrigger>
          ))}
        </TabHorizontalList>

        {tabs.map((tab) => (
          <TabHorizontalContent
            key={tab.value}
            value={tab.value}
            className="pt-6"
          >
            <PlaceholderContent>{tab.label}</PlaceholderContent>
          </TabHorizontalContent>
        ))}
      </TabHorizontal>
    </div>
  );
}
