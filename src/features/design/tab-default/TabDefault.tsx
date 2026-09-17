import { BellIcon, ChartPieIcon, UsersIcon } from "lucide-react";

import {
  TabDefault as Tab,
  TabDefaultContent as TabContent,
  TabDefaultList as TabList,
  TabDefaultTrigger as TabTrigger,
} from "@components/ui/tab-default";
import { DesignPage, Example } from "@features/design/example";

const panels = [
  {
    value: "overview",
    label: "Overview",
    icon: ChartPieIcon,
    body: "Hours, labour cost and coverage for the current pay period.",
  },
  {
    value: "team",
    label: "Team",
    icon: UsersIcon,
    body: "Everyone scheduled this week, grouped by department.",
  },
  {
    value: "alerts",
    label: "Alerts",
    icon: BellIcon,
    body: "Missed punches and overtime that need a manager to sign off.",
  },
];

export function TabDefaultPage() {
  return (
    <DesignPage title="TabDefault">
      <Example
        title="Default"
        description="A segmented control on a muted track. Triggers share the track's width, so it reads as a switch rather than as navigation."
      >
        <Tab defaultValue="overview">
          <TabList>
            {panels.map((panel) => (
              <TabTrigger key={panel.value} value={panel.value}>
                {panel.label}
              </TabTrigger>
            ))}
          </TabList>
          {panels.map((panel) => (
            <TabContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabContent>
          ))}
        </Tab>
      </Example>

      <Example
        title="With icons"
        description="An icon marked data-icon='inline-start' tightens the padding on that side."
      >
        <Tab defaultValue="overview">
          <TabList>
            {panels.map((panel) => (
              <TabTrigger key={panel.value} value={panel.value}>
                <panel.icon data-icon="inline-start" />
                {panel.label}
              </TabTrigger>
            ))}
          </TabList>
          {panels.map((panel) => (
            <TabContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabContent>
          ))}
        </Tab>
      </Example>

      <Example
        title="Disabled tab"
        description="A disabled trigger drops to 50% and stops taking pointer events."
      >
        <Tab defaultValue="overview">
          <TabList>
            <TabTrigger value="overview">Overview</TabTrigger>
            <TabTrigger value="team">Team</TabTrigger>
            <TabTrigger value="alerts" disabled>
              Alerts
            </TabTrigger>
          </TabList>
          {panels.map((panel) => (
            <TabContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabContent>
          ))}
        </Tab>
      </Example>
    </DesignPage>
  );
}
