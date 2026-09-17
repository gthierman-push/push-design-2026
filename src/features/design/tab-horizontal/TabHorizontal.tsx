import {
  TabHorizontal as Tab,
  TabHorizontalContent as TabContent,
  TabHorizontalList as TabList,
  TabHorizontalTrigger as TabTrigger,
} from "@components/ui/tab-horizontal";
import { DesignPage, Example } from "@features/design/example";

const panels = [
  {
    value: "overview",
    label: "Overview",
    body: "Hours, labour cost and coverage for the current pay period.",
  },
  {
    value: "team",
    label: "Team",
    body: "Everyone scheduled this week, grouped by department.",
  },
  {
    value: "alerts",
    label: "Alerts",
    body: "Missed punches and overtime that need a manager to sign off.",
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
            <TabContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabContent>
          ))}
        </Tab>
      </Example>

      <Example
        title="Marker width"
        description="Triggers size to their label rather than sharing the width, so the bar always matches the text it sits under."
      >
        <Tab defaultValue="scheduling">
          <TabList>
            <TabTrigger value="scheduling">Scheduling</TabTrigger>
            <TabTrigger value="pay">Pay</TabTrigger>
            <TabTrigger value="documents-and-forms">
              Documents and forms
            </TabTrigger>
          </TabList>
          <TabContent value="scheduling">
            Shifts, availability and trade requests.
          </TabContent>
          <TabContent value="pay">
            Rates, premiums and year-end tax forms.
          </TabContent>
          <TabContent value="documents-and-forms">
            Signed agreements and onboarding paperwork.
          </TabContent>
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
