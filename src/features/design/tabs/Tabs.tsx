import { BellIcon, ChartPieIcon, UsersIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/ui/tabs";

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

function Example({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function TabsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Example
        title="Horizontal, default"
        description='variant="default" on a horizontal list — the muted pill track.'
      >
        <Tabs defaultValue="overview">
          <TabsList>
            {panels.map((panel) => (
              <TabsTrigger key={panel.value} value={panel.value}>
                {panel.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {panels.map((panel) => (
            <TabsContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabsContent>
          ))}
        </Tabs>
      </Example>

      <Example
        title="Horizontal, line"
        description='variant="line" — transparent track, underline on the active tab.'
      >
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            {panels.map((panel) => (
              <TabsTrigger key={panel.value} value={panel.value}>
                {panel.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {panels.map((panel) => (
            <TabsContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabsContent>
          ))}
        </Tabs>
      </Example>

      <Example
        title="With icons"
        description="Icons use data-icon to tighten the padding on that side."
      >
        <Tabs defaultValue="overview">
          <TabsList>
            {panels.map((panel) => (
              <TabsTrigger key={panel.value} value={panel.value}>
                <panel.icon data-icon="inline-start" />
                {panel.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {panels.map((panel) => (
            <TabsContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabsContent>
          ))}
        </Tabs>
      </Example>

      <Example
        title="Vertical, default"
        description='orientation="vertical" on the root flips the list to a column and stacks the muted pill track.'
      >
        <Tabs defaultValue="overview" orientation="vertical">
          <TabsList>
            {panels.map((panel) => (
              <TabsTrigger key={panel.value} value={panel.value}>
                {panel.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {panels.map((panel) => (
            <TabsContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabsContent>
          ))}
        </Tabs>
      </Example>

      <Example
        title="Vertical, line"
        description="Reads as a sidebar nav item: the primary-alt marker sits on the left and the active tab takes a background."
      >
        <Tabs defaultValue="overview" orientation="vertical">
          <TabsList variant="line">
            {panels.map((panel) => (
              <TabsTrigger key={panel.value} value={panel.value}>
                {panel.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {panels.map((panel) => (
            <TabsContent key={panel.value} value={panel.value}>
              {panel.body}
            </TabsContent>
          ))}
        </Tabs>
      </Example>

      <Example
        title="Disabled tab"
        description="A disabled trigger drops to 50% and stops taking pointer events."
      >
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="alerts" disabled>
              Alerts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{panels[0].body}</TabsContent>
          <TabsContent value="team">{panels[1].body}</TabsContent>
          <TabsContent value="alerts">{panels[2].body}</TabsContent>
        </Tabs>
      </Example>
    </div>
  );
}
