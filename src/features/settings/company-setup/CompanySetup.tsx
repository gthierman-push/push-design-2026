import { CopyIcon, SearchIcon } from "lucide-react";

import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
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
import { Textarea } from "@components/ui/textarea";
import { TabSelect } from "@components/ui/tab-select";
import {
  TabVertical,
  TabVerticalContent,
  TabVerticalList,
  TabVerticalTrigger,
} from "@components/ui/tab-vertical";
import { useSettingsTarget } from "@layouts/use-settings-target";

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

/**
 * Every input-shaped control lines up on the same edge, whatever it is. The
 * width is important because `Field`'s responsive orientation sets
 * `*:w-auto` on its children, and a child combinator out-specifies a plain
 * width class.
 */
const controlWidth = "w-96!";

/** Selects hug their value rather than sitting on the input measure. */
const selectWidth = "w-fit!";

/** A date is a fixed, short value, so it does not need the input measure. */
const dateWidth = "w-48!";

const provinces = ["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK"];

const completedBy = ["Push Operations", "Company"];

/** The toggles the account tab lists below its main card, in design order. */
const accountToggles = [
  { id: "show-employee-numbers", label: "Show Employee Numbers" },
  { id: "covers-applicable", label: "Covers Applicable" },
  { id: "employees-compose-messages", label: "Employees Compose Messages" },
  { id: "roe-access", label: "ROE Access" },
  { id: "timesheet-approvals", label: "Timesheet Approvals" },
  { id: "rooms-applicable", label: "Rooms Applicable" },
  { id: "contractors-only", label: "Contractors Only" },
];

/** `anchor` is what settings search jumps to, since a group has no control. */
const companyGroups = [
  {
    name: "Demo Enterprises (organization)",
    anchor: "company-group-organization",
    id: "93010305-8ba0-4876-9c03-9ca4d1a0d536",
  },
  {
    name: "Demo Enterprises (company)",
    anchor: "company-group-company",
    id: "6f2b1c44-1f0e-4a51-9d77-2c0a5e8b31af",
  },
];

/** `field` is bolded inside the sentence; `deleted` colors the row's marker. */
const changes = [
  {
    id: "change-1",
    actor: "Push Payroll (228117)",
    verb: "updated",
    field: "Company Name",
    detail: "from 0000-00-00 to 2026-06-21",
    at: "2026-07-27 3:01:02 PM",
  },
  {
    id: "change-2",
    actor: "Push Payroll (228117)",
    verb: "updated",
    field: "Yearly Pay Periods",
    detail: "from 52 to 24",
    at: "2026-07-27 3:01:02 PM",
  },
  {
    id: "change-3",
    actor: "Push Payroll (228117)",
    verb: "deleted",
    field: "Company Name",
    detail: "",
    at: "2026-07-27 3:01:02 PM",
    deleted: true,
  },
  {
    id: "change-4",
    actor: "Push Payroll (228117)",
    verb: "updated",
    field: "Legal Name",
    detail: "from Crumbl Cookie to Crumbl Cookie Ltd.",
    at: "2026-07-26 11:42:18 AM",
  },
  {
    id: "change-5",
    actor: "Push Payroll (228117)",
    verb: "updated",
    field: "Remittance Due",
    detail: "from Quarterly to Monthly",
    at: "2026-07-24 9:15:40 AM",
  },
];

/** The heading that names a card, above it rather than inside it. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-medium">{children}</h2>;
}

/** Every editable panel closes with the same right-aligned pair. */
function PanelActions() {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Update</Button>
    </div>
  );
}

/** An identifier the user copies rather than edits. */
function IdentityTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 flex flex-1 flex-col gap-1 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <Button variant="ghost" size="icon-xs" aria-label={`Copy ${label}`}>
          <CopyIcon />
        </Button>
      </div>
      <span className="text-muted-foreground text-sm">{value}</span>
    </div>
  );
}

export function CompanySetup() {
  const [tab, setTab] = useSettingsTarget(tabs[0].value);
  const title = tabs.find((item) => item.value === tab)?.label;

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
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {tab === "history" ? (
            <div className="relative w-64">
              <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search history..."
                aria-label="Search history"
                className="pl-8"
              />
            </div>
          ) : null}
        </div>

        <TabSelect
          tabs={tabs}
          value={tab}
          onValueChange={setTab}
          className="md:hidden"
        />

        <TabVerticalContent value="company-setup">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <SectionHeading>Company Profile</SectionHeading>
              <Card>
                <CardContent>
                  <FieldRows>
                    <Field id="logo" orientation="responsive">
                      <FieldContent>
                        <FieldTitle>Logo</FieldTitle>
                        <FieldDescription>
                          Shown on pay stubs and the employee app.
                        </FieldDescription>
                      </FieldContent>
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                    </Field>

                    <Field orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor="company-name">
                          Company Name
                        </FieldLabel>
                      </FieldContent>
                      <Input
                        id="company-name"
                        defaultValue="Crumbl Cookie"
                        className={controlWidth}
                      />
                    </Field>

                    <Field orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor="legal-name">Legal Name</FieldLabel>
                        <FieldDescription>
                          Leave blank if this is the same as the company name
                        </FieldDescription>
                      </FieldContent>
                      <Input id="legal-name" className={controlWidth} />
                    </Field>
                  </FieldRows>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              <SectionHeading>Company Address</SectionHeading>
              <Card>
                <CardContent>
                  <FieldRows>
                    <Field orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor="street">Street</FieldLabel>
                      </FieldContent>
                      <Input
                        id="street"
                        defaultValue="123 Robson St"
                        className={controlWidth}
                      />
                    </Field>

                    <Field orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor="city">City</FieldLabel>
                      </FieldContent>
                      <Input
                        id="city"
                        defaultValue="Vancouver"
                        className={controlWidth}
                      />
                    </Field>

                    <Field orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor="province">Province</FieldLabel>
                      </FieldContent>
                      <Select defaultValue="BC">
                        <SelectTrigger id="province" className={selectWidth}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor="country">Country</FieldLabel>
                      </FieldContent>
                      <Select defaultValue="Canada">
                        <SelectTrigger id="country" className={selectWidth}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor="postal-code">
                          Postal Code
                        </FieldLabel>
                      </FieldContent>
                      <Input
                        id="postal-code"
                        defaultValue="V50 090"
                        className={controlWidth}
                      />
                    </Field>
                  </FieldRows>
                </CardContent>
              </Card>
            </div>

            <PanelActions />
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="timezone-weather">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Pacific Standard Time (PST) Vancouver">
                      <SelectTrigger id="timezone" className={selectWidth}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pacific Standard Time (PST) Vancouver">
                          Pacific Standard Time (PST) Vancouver
                        </SelectItem>
                        <SelectItem value="Mountain Standard Time (MST) Edmonton">
                          Mountain Standard Time (MST) Edmonton
                        </SelectItem>
                        <SelectItem value="Eastern Standard Time (EST) Toronto">
                          Eastern Standard Time (EST) Toronto
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="temperature-location">
                        Temperature Location
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Kelowna, BC">
                      <SelectTrigger
                        id="temperature-location"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kelowna, BC">Kelowna, BC</SelectItem>
                        <SelectItem value="Vancouver, BC">
                          Vancouver, BC
                        </SelectItem>
                        <SelectItem value="Victoria, BC">
                          Victoria, BC
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="temperature-units">
                        Temperature Units
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Celsius">
                      <SelectTrigger
                        id="temperature-units"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Celsius">Celsius</SelectItem>
                        <SelectItem value="Fahrenheit">Fahrenheit</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <PanelActions />
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="roe-contact">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="roe-first-name">
                        First Name
                      </FieldLabel>
                    </FieldContent>
                    <Input
                      id="roe-first-name"
                      defaultValue="Geoff"
                      className={controlWidth}
                    />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="roe-last-name">Last Name</FieldLabel>
                    </FieldContent>
                    <Input
                      id="roe-last-name"
                      defaultValue="Thierman"
                      className={controlWidth}
                    />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="roe-phone">Phone Number</FieldLabel>
                    </FieldContent>
                    <Input
                      id="roe-phone"
                      type="tel"
                      defaultValue="123-456-7890"
                      className={controlWidth}
                    />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="roe-extension">Extension</FieldLabel>
                    </FieldContent>
                    <Input
                      id="roe-extension"
                      defaultValue="123"
                      className={controlWidth}
                    />
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <PanelActions />
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="taxes">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="federal-account">
                        Federal Payroll Account
                      </FieldLabel>
                    </FieldContent>
                    <Input
                      id="federal-account"
                      defaultValue="84920 1174 RP0001"
                      className={controlWidth}
                    />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="health-tax">
                        Provincial Health Tax
                      </FieldLabel>
                    </FieldContent>
                    <Input
                      id="health-tax"
                      defaultValue="BC-4471-882"
                      className={controlWidth}
                    />
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <PanelActions />
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="payroll-configuration">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="pay-frequency">
                        Pay Frequency
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Bi-weekly">
                      <SelectTrigger id="pay-frequency" className={selectWidth}>
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
                      <FieldLabel htmlFor="yearly-pay-periods">
                        Yearly Pay Periods
                      </FieldLabel>
                    </FieldContent>
                    <Input
                      id="yearly-pay-periods"
                      type="number"
                      defaultValue={24}
                      className={controlWidth}
                    />
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <PanelActions />
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="compliance-filing">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="vacation-payroll">
                        Vacation Payroll Managed By
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Push Operations">
                      <SelectTrigger
                        id="vacation-payroll"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {completedBy.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="govt-remittance">
                        Gov&apos;t Remittance Completed By
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Push Operations">
                      <SelectTrigger
                        id="govt-remittance"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {completedBy.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="remittance-due">
                        Remittance Due
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Monthly">
                      <SelectTrigger
                        id="remittance-due"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="wcb-completed-by">
                        WCB/WSIB Completed By
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Company">
                      <SelectTrigger
                        id="wcb-completed-by"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {completedBy.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="eht-completed-by">
                        EHT Completed By
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Company">
                      <SelectTrigger
                        id="eht-completed-by"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {completedBy.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="wcb-account">
                        WCB Account #
                      </FieldLabel>
                    </FieldContent>
                    <Input
                      id="wcb-account"
                      defaultValue="123445678"
                      className={controlWidth}
                    />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="require-paystub-delivery">
                        Require Paystub Delivery?
                      </FieldLabel>
                    </FieldContent>
                    <Switch id="require-paystub-delivery" defaultChecked />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="require-roe">Require ROE</FieldLabel>
                    </FieldContent>
                    <Switch id="require-roe" defaultChecked />
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <PanelActions />
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="account">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <IdentityTile
                    label="Company UUID"
                    value="f5f4056e-37c6-414e-afc4-45a0a4f0218a"
                  />
                  <IdentityTile label="Company ID" value="21877" />
                </div>

                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="demo-account">
                        Demo Account?
                      </FieldLabel>
                    </FieldContent>
                    <Switch id="demo-account" defaultChecked />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="industry">Industry</FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Restaurant">
                      <SelectTrigger id="industry" className={selectWidth}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Hospitality">Hospitality</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="account-status">
                        Account Status
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Pending - Onboarding">
                      <SelectTrigger
                        id="account-status"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending - Onboarding">
                          Pending - Onboarding
                        </SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="cancel-date">Cancel Date</FieldLabel>
                    </FieldContent>
                    <div className="flex items-center gap-3">
                      <Button variant="link" size="sm" className="px-0">
                        Find Date
                      </Button>
                      <Input
                        id="cancel-date"
                        type="date"
                        className={dateWidth}
                        aria-label="Cancel date"
                      />
                    </div>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="inactivation-status">
                        Inactivation Status
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Inactive">
                      <SelectTrigger
                        id="inactivation-status"
                        className={selectWidth}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="inactivation-date">
                        Inactivation Date
                      </FieldLabel>
                    </FieldContent>
                    <Input
                      id="inactivation-date"
                      type="date"
                      className={dateWidth}
                    />
                  </Field>

                  {/* The note is prose rather than a value, so it takes the
                      full row instead of sitting opposite its label. */}
                  <Field>
                    <FieldLabel htmlFor="account-note">Note</FieldLabel>
                    <Textarea id="account-note" rows={6} />
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <FieldRows>
                  {accountToggles.map((toggle) => (
                    <Field key={toggle.id} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={toggle.id}>
                          {toggle.label}
                        </FieldLabel>
                      </FieldContent>
                      <Switch id={toggle.id} defaultChecked />
                    </Field>
                  ))}
                </FieldRows>
              </CardContent>
            </Card>

            <PanelActions />
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="organization">
          <div className="flex flex-col gap-8">
            <Card>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="organization">
                        Organization
                      </FieldLabel>
                    </FieldContent>
                    <Select defaultValue="Demo Enterprises">
                      <SelectTrigger id="organization" className={selectWidth}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Demo Enterprises">
                          Demo Enterprises
                        </SelectItem>
                        <SelectItem value="Harbour Coffee Holdings">
                          Harbour Coffee Holdings
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <SectionHeading>Company Groups</SectionHeading>
              <Card>
                <CardContent>
                  <FieldRows>
                    {companyGroups.map((group) => (
                      <Field
                        key={group.id}
                        id={group.anchor}
                        orientation="responsive"
                      >
                        <FieldContent>
                          <FieldTitle>{group.name}</FieldTitle>
                        </FieldContent>
                        <span className="text-muted-foreground text-xs">
                          {group.id}
                        </span>
                      </Field>
                    ))}
                  </FieldRows>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="eft-debit">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent>
                <FieldRows>
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="institution">Institution</FieldLabel>
                    </FieldContent>
                    <Input
                      id="institution"
                      defaultValue="Coastal Credit Union"
                      className={controlWidth}
                    />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="transit-number">
                        Transit Number
                      </FieldLabel>
                    </FieldContent>
                    <Input
                      id="transit-number"
                      defaultValue="00412"
                      className={controlWidth}
                    />
                  </Field>

                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="account-number">
                        Account Number
                      </FieldLabel>
                    </FieldContent>
                    <Input
                      id="account-number"
                      defaultValue="•••• •••• 7741"
                      className={controlWidth}
                    />
                  </Field>
                </FieldRows>
              </CardContent>
            </Card>

            <PanelActions />
          </div>
        </TabVerticalContent>

        <TabVerticalContent value="history">
          <Card>
            <CardContent>
              <FieldRows>
                {changes.map((change) => (
                  <Field key={change.id} orientation="responsive">
                    <div
                      aria-hidden="true"
                      className={
                        change.deleted
                          ? "bg-destructive w-0.5 shrink-0 self-stretch rounded-full"
                          : "bg-primary-alt w-0.5 shrink-0 self-stretch rounded-full"
                      }
                    />
                    <FieldContent>
                      <FieldTitle className="font-normal">
                        {change.actor} {change.verb}{" "}
                        <span className="font-medium">{change.field}</span>
                        {change.detail ? ` ${change.detail}` : null}
                      </FieldTitle>
                    </FieldContent>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {change.at}
                    </span>
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
