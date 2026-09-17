import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { Switch } from "@components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

const notifications = [
  {
    title: "Shift reminders",
    description: "Text employees two hours before a shift starts.",
    enabled: true,
  },
  {
    title: "Missed punch alerts",
    description: "Email the manager when someone forgets to clock out.",
    enabled: true,
  },
  {
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

export function VerticalTabs() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Vertical tabs</h1>
        <p className="text-muted-foreground text-sm">
          Line tabs down the side of a settings form, styled as nav items with
          a marker on the left.
        </p>
      </div>

      <Tabs defaultValue="general" orientation="vertical" className="gap-8">
        <TabsList variant="line" className="w-48 shrink-0">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
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
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              {notifications.map((notification, index) => (
                <div key={notification.title}>
                  {index > 0 ? <Separator /> : null}
                  <Field orientation="horizontal" className="py-4">
                    <div className="flex flex-1 flex-col gap-0.5">
                      <FieldLabel htmlFor={notification.title}>
                        {notification.title}
                      </FieldLabel>
                      <FieldDescription>
                        {notification.description}
                      </FieldDescription>
                    </div>
                    <Switch
                      id={notification.title}
                      defaultChecked={notification.enabled}
                    />
                  </Field>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Permission groups</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              {roles.map((role, index) => (
                <div key={role.name}>
                  {index > 0 ? <Separator /> : null}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{role.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {role.scope}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {role.members}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Connected apps</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              {integrations.map((integration, index) => (
                <div key={integration.name}>
                  {index > 0 ? <Separator /> : null}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {integration.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {integration.detail}
                      </span>
                    </div>
                    {integration.connected ? (
                      <Badge variant="secondary">Connected</Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
