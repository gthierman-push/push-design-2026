import { useState } from "react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@components/ui/field";
import { FieldRows } from "@components/ui/field-rows";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { TabSelect } from "@components/ui/tab-select";
import {
  TabVertical,
  TabVerticalContent,
  TabVerticalList,
  TabVerticalTrigger,
} from "@components/ui/tab-vertical";

const tabs = [
  { value: "company-setup", label: "Company Setup" },
  { value: "timezone-weather", label: "Timezone & Weather" },
  { value: "roe-contact", label: "ROE Contact" },
  { value: "taxes", label: "Taxes" },
  { value: "payroll-configuration", label: "Payroll Configuration" },
  { value: "compliance-filing", label: "Compliance & Filing" },
  { value: "account", label: "Account" },
  { value: "organization", label: "Organization" },
  { value: "eft-debit", label: "EFT Debit" },
  { value: "history", label: "History" },
];

const weatherAlerts = [
  {
    id: "severe-weather",
    title: "Severe weather warnings",
    description: "Notify managers when a warning covers a work location.",
    enabled: true,
  },
  {
    id: "forecast-on-scheduler",
    title: "Forecast on the scheduler",
    description: "Show the daily forecast above each scheduled day.",
    enabled: true,
  },
  {
    id: "snow-day-prompt",
    title: "Snow day prompt",
    description: "Ask managers to confirm coverage when snowfall is forecast.",
    enabled: false,
  },
];

const taxAccounts = [
  {
    name: "Federal payroll account",
    number: "84920 1174 RP0001",
    verified: true,
  },
  { name: "Provincial health tax", number: "BC-4471-882", verified: true },
  { name: "Workers' compensation", number: "WCB 992-114", verified: false },
];

const payrollRules = [
  {
    id: "auto-approve-timesheets",
    title: "Auto-approve timesheets",
    description: "Approve timesheets with no exceptions the night they close.",
    enabled: false,
  },
  {
    id: "stat-holiday-averaging",
    title: "Statutory holiday averaging",
    description: "Average the last 30 days when calculating holiday pay.",
    enabled: true,
  },
  {
    id: "overtime-daily",
    title: "Daily overtime",
    description: "Pay 1.5× after 8 hours in a single day.",
    enabled: true,
  },
];

const filings = [
  {
    name: "T4 slips",
    description: "2025 tax year · due Feb 28, 2026",
    status: "Not started",
  },
  {
    name: "ROE web submissions",
    description: "Continuous · due 5 days after a departure",
    status: "On track",
  },
  {
    name: "WCB quarterly return",
    description: "Q3 2026 · due Oct 20, 2026",
    status: "On track",
  },
];

const departments = [
  { name: "Front of house", locations: "4 locations", people: "112 people" },
  { name: "Kitchen", locations: "4 locations", people: "68 people" },
  { name: "Roastery", locations: "1 location", people: "19 people" },
  { name: "Head office", locations: "1 location", people: "14 people" },
];

const history = [
  {
    change: "Pay period frequency changed to bi-weekly",
    who: "Dana Whitlock",
    when: "Sep 12, 2026",
  },
  { change: "ROE contact updated", who: "Priya Raman", when: "Aug 30, 2026" },
  { change: "EFT debit account verified", who: "System", when: "Aug 14, 2026" },
  { change: "Legal name updated", who: "Dana Whitlock", when: "Jul 2, 2026" },
];

export function CompanySetup() {
  const [tab, setTab] = useState(tabs[0].value);

  return (
    <TabVertical
      value={tab}
      onValueChange={(value) => setTab(value as string)}
      className="flex-col gap-6 md:flex-row md:gap-8"
    >
      <TabVerticalList className="hidden w-52 shrink-0 md:inline-flex">
        {tabs.map((item) => (
          <TabVerticalTrigger key={item.value} value={item.value}>
            {item.label}
          </TabVerticalTrigger>
        ))}
      </TabVerticalList>

      <div className="flex w-full max-w-5xl min-w-0 flex-1 flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Company Setup</h1>

        <TabSelect
          tabs={tabs}
          value={tab}
          onValueChange={setTab}
          className="md:hidden"
        />

        <TabVerticalContent value="company-setup">
          <Card>
            <CardHeader>
              <CardTitle>Business details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="company-name">Company name</FieldLabel>
                    <FieldDescription>
                      What employees see across the app.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="company-name"
                    defaultValue="Harbour Coffee Co."
                    className="w-64"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="legal-name">Legal name</FieldLabel>
                    <FieldDescription>
                      Shows on pay stubs and year-end tax forms.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="legal-name"
                    defaultValue="Harbour Coffee Holdings Ltd."
                    className="w-64"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="business-number">
                      Business number
                    </FieldLabel>
                    <FieldDescription>
                      Issued by the Canada Revenue Agency.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="business-number"
                    defaultValue="84920 1174"
                    className="w-40"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="head-office">Head office</FieldLabel>
                    <FieldDescription>
                      The mailing address on official correspondence.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="head-office"
                    defaultValue="220 Water Street, Vancouver, BC"
                    className="w-64"
                  />
                </Field>
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="timezone-weather">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Timezone</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="timezone">
                        Company timezone
                      </FieldLabel>
                      <FieldDescription>
                        Locations can override this on their own profile.
                      </FieldDescription>
                    </FieldContent>
                    <Select defaultValue="Pacific Time">
                      <SelectTrigger id="timezone" className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pacific Time">
                          Pacific Time
                        </SelectItem>
                        <SelectItem value="Mountain Time">
                          Mountain Time
                        </SelectItem>
                        <SelectItem value="Central Time">
                          Central Time
                        </SelectItem>
                        <SelectItem value="Eastern Time">
                          Eastern Time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="week-start">
                        Week starts on
                      </FieldLabel>
                      <FieldDescription>
                        Sets the first column on the scheduler.
                      </FieldDescription>
                    </FieldContent>
                    <Select defaultValue="Monday">
                      <SelectTrigger id="week-start" className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                        <SelectItem value="Monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldRows>
                  {weatherAlerts.map((alert) => (
                    <Field key={alert.id} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={alert.id}>
                          {alert.title}
                        </FieldLabel>
                        <FieldDescription>{alert.description}</FieldDescription>
                      </FieldContent>
                      <Switch id={alert.id} defaultChecked={alert.enabled} />
                    </Field>
                  ))}
                </FieldRows>
              </CardContent>
            </Card>
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="roe-contact">
          <Card>
            <CardHeader>
              <CardTitle>Record of employment contact</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="roe-name">Contact name</FieldLabel>
                    <FieldDescription>
                      Named on every ROE this company issues.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="roe-name"
                    defaultValue="Priya Raman"
                    className="w-64"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="roe-email">Email</FieldLabel>
                    <FieldDescription>
                      Service Canada sends ROE confirmations here.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="roe-email"
                    type="email"
                    defaultValue="priya.raman@harbourcoffee.example"
                    className="w-64"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="roe-phone">Phone</FieldLabel>
                    <FieldDescription>
                      Reachable during business hours.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="roe-phone"
                    type="tel"
                    defaultValue="604-555-0148"
                    className="w-40"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="roe-extension">Extension</FieldLabel>
                    <FieldDescription>Optional.</FieldDescription>
                  </FieldContent>
                  <Input
                    id="roe-extension"
                    defaultValue="212"
                    className="w-24"
                  />
                </Field>
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="taxes">
          <Card>
            <CardHeader>
              <CardTitle>Tax accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                {taxAccounts.map((account) => (
                  <Field key={account.name} orientation="responsive">
                    <FieldContent>
                      <FieldTitle>{account.name}</FieldTitle>
                      <FieldDescription>{account.number}</FieldDescription>
                    </FieldContent>
                    {account.verified ? (
                      <Badge variant="secondary">Verified</Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    )}
                  </Field>
                ))}
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="payroll-configuration">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pay periods</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="pay-frequency">Frequency</FieldLabel>
                      <FieldDescription>
                        How often a pay period closes.
                      </FieldDescription>
                    </FieldContent>
                    <Select defaultValue="Bi-weekly">
                      <SelectTrigger id="pay-frequency" className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="Semi-monthly">
                          Semi-monthly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="next-pay-date">
                        Next pay date
                      </FieldLabel>
                      <FieldDescription>
                        Payroll must be submitted three business days before.
                      </FieldDescription>
                    </FieldContent>
                    <Input
                      id="next-pay-date"
                      type="date"
                      defaultValue="2026-09-25"
                      className="w-44"
                    />
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldRows>
                  {payrollRules.map((rule) => (
                    <Field key={rule.id} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={rule.id}>{rule.title}</FieldLabel>
                        <FieldDescription>{rule.description}</FieldDescription>
                      </FieldContent>
                      <Switch id={rule.id} defaultChecked={rule.enabled} />
                    </Field>
                  ))}
                </FieldRows>
              </CardContent>
            </Card>
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="compliance-filing">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming filings</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                {filings.map((filing) => (
                  <Field key={filing.name} orientation="responsive">
                    <FieldContent>
                      <FieldTitle>{filing.name}</FieldTitle>
                      <FieldDescription>{filing.description}</FieldDescription>
                    </FieldContent>
                    <Badge
                      variant={
                        filing.status === "On track" ? "secondary" : "outline"
                      }
                    >
                      {filing.status}
                    </Badge>
                  </Field>
                ))}
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                <Field orientation="responsive">
                  <FieldContent>
                    <FieldTitle>Workforce Premium</FieldTitle>
                    <FieldDescription>
                      213 active employees · renews Jan 1, 2027
                    </FieldDescription>
                  </FieldContent>
                  <Button variant="outline" size="sm">
                    Change plan
                  </Button>
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="billing-contact">
                      Billing contact
                    </FieldLabel>
                    <FieldDescription>
                      Invoices and receipts go here.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="billing-contact"
                    type="email"
                    defaultValue="accounts@harbourcoffee.example"
                    className="w-64"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldTitle>Invoices</FieldTitle>
                    <FieldDescription>
                      Last issued Sep 1, 2026.
                    </FieldDescription>
                  </FieldContent>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Field>
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                {departments.map((department) => (
                  <Field key={department.name} orientation="responsive">
                    <FieldContent>
                      <FieldTitle>{department.name}</FieldTitle>
                      <FieldDescription>
                        {department.locations} · {department.people}
                      </FieldDescription>
                    </FieldContent>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Field>
                ))}
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="eft-debit">
          <Card>
            <CardHeader>
              <CardTitle>Debit account</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="institution">Institution</FieldLabel>
                    <FieldDescription>
                      The bank holding the account.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="institution"
                    defaultValue="Coastal Credit Union"
                    className="w-64"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="transit-number">
                      Transit number
                    </FieldLabel>
                    <FieldDescription>
                      Five digits, from a void cheque.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="transit-number"
                    defaultValue="00412"
                    className="w-32"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="account-number">
                      Account number
                    </FieldLabel>
                    <FieldDescription>
                      Payroll and remittances are drawn from this account.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    id="account-number"
                    defaultValue="•••• •••• 7741"
                    className="w-48"
                  />
                </Field>

                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="pre-note">Pre-note new</FieldLabel>
                    <FieldDescription>
                      Send a zero-dollar test before the first real debit.
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="pre-note" defaultChecked />
                </Field>
              </FieldRows>
            </CardContent>
          </Card>
        </TabVerticalContent>

        <TabVerticalContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Change log</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldRows>
                {history.map((entry) => (
                  <Field key={entry.change} orientation="responsive">
                    <FieldContent>
                      <FieldTitle>{entry.change}</FieldTitle>
                      <FieldDescription>
                        {entry.who} · {entry.when}
                      </FieldDescription>
                    </FieldContent>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
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
