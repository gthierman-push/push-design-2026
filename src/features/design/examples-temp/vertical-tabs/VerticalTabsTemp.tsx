import { useState } from "react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@components/ui/field";
import { FieldRows } from "@components/ui/field-rows";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { TabSelect } from "@components/ui/tab-select";
import {
  TabVertical,
  TabVerticalContent,
  TabVerticalList,
  TabVerticalTrigger,
} from "@components/ui/tab-vertical";

const tabs = [
  { value: "general", label: "General" },
  { value: "notifications", label: "Notifications" },
  { value: "roles", label: "Roles" },
  { value: "integrations", label: "Integrations" },
];

const notifications = [
  {
    id: "shift-reminders",
    title: "Shift reminders",
    description: "Text employees two hours before a shift starts.",
    enabled: true,
  },
  {
    id: "missed-punch-alerts",
    title: "Missed punch alerts",
    description: "Email the manager when someone forgets to clock out.",
    enabled: true,
  },
  {
    id: "overtime-warnings",
    title: "Overtime warnings",
    description: "Warn when a schedule pushes anyone past 40 hours.",
    enabled: false,
  },
];

const roles = [
  { name: "Owner", members: "2 people", scope: "Everything" },
  { name: "Manager", members: "7 people", scope: "Scheduling and timesheets" },
  { name: "Supervisor", members: "12 people", scope: "Scheduling only" },
  { name: "Employee", members: "184 people", scope: "Their own records" },
];

const integrations = [
  { name: "QuickBooks", detail: "Syncing payroll journals", connected: true },
  { name: "Square", detail: "Sales imported hourly", connected: true },
  { name: "Slack", detail: "Not connected", connected: false },
];

export function VerticalTabsTemp() {
  const [tab, setTab] = useState(tabs[0].value);

  return (
    <TabVertical
      value={tab}
      onValueChange={(value) => setTab(value as string)}
      className="flex-col gap-6 md:flex-row md:gap-8"
    >
      <TabVerticalList className="hidden w-48 shrink-0 md:inline-flex">
        {tabs.map((item) => (
          <TabVerticalTrigger key={item.value} value={item.value}>
            {item.label}
          </TabVerticalTrigger>
        ))}
      </TabVerticalList>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Vertical tabs
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">Discard</Button>
            <Button>Save changes</Button>
          </div>
        </div>

        <TabSelect
          tabs={tabs}
          value={tab}
          onValueChange={setTab}
          className="md:hidden"
        />

        <TabVerticalContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Business details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="company-name">Company name</FieldLabel>
                  <Input id="company-name" defaultValue="Harbour Coffee Co." />
                </Field>
                <Field>
                  <FieldLabel htmlFor="legal-name">Legal name</FieldLabel>
                  <Input
                    id="legal-name"
                    defaultValue="Harbour Coffee Holdings Ltd."
                  />
                  <FieldDescription>
                    Shows on pay stubs and year-end tax forms.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="payroll-contact">
                    Payroll contact
                  </FieldLabel>
                  <Input
                    id="payroll-contact"
                    defaultValue="payroll@harbourcoffee.example"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                {notifications.map((notification) => (
                  <Field key={notification.id} orientation="horizontal">
                    <FieldContent>
                      <FieldLabel htmlFor={notification.id}>
                        {notification.title}
                      </FieldLabel>
                      <FieldDescription>
                        {notification.description}
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id={notification.id}
                      defaultChecked={notification.enabled}
                    />
                  </Field>
                ))}
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Permission groups</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                {roles.map((role) => (
                  <Field key={role.name} orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{role.name}</FieldTitle>
                      <FieldDescription>{role.scope}</FieldDescription>
                    </FieldContent>
                    <span className="text-muted-foreground text-sm">
                      {role.members}
                    </span>
                  </Field>
                ))}
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Connected apps</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                {integrations.map((integration) => (
                  <Field key={integration.name} orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{integration.name}</FieldTitle>
                      <FieldDescription>{integration.detail}</FieldDescription>
                    </FieldContent>
                    {integration.connected ? (
                      <Badge variant="secondary">Connected</Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    )}
                  </Field>
                ))}
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>
      </div>
    </TabVertical>
  );
}
