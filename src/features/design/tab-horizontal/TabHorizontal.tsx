import {
  TabHorizontal as Tab,
  TabHorizontalContent as TabContent,
  TabHorizontalList as TabList,
  TabHorizontalTrigger as TabTrigger,
} from "@components/ui/tab-horizontal";
import {
  DesignPage,
  Example,
  PlaceholderContent,
} from "@features/design/example";

const panels = [
  {
    value: "overview",
    label: "Overview",
  },
  {
    value: "team",
    label: "Team",
  },
  {
    value: "alerts",
    label: "Alerts",
  },
];

export function TabHorizontalPage() {
  return (
    <DesignPage title="TabHorizontal">
      <Example
        title="Default"
        description="Labels on a full-width rule, with a primary-alt bar sitting on the rule under the active one."
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
            <TabContent key={panel.value} value={panel.value} className="pt-6">
              <PlaceholderContent>{panel.label}</PlaceholderContent>
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
            <TabContent key={panel.value} value={panel.value} className="pt-6">
              <PlaceholderContent>{panel.label}</PlaceholderContent>
            </TabContent>
          ))}
        </Tab>
      </Example>
    </DesignPage>
  );
}
