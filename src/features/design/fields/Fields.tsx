import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@components/ui/combobox";
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
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { DesignPage, Example } from "@features/design/example";

const timezones = [
  "Pacific Time",
  "Mountain Time",
  "Central Time",
  "Eastern Time",
  "Atlantic Time",
];

export function Fields() {
  return (
    <DesignPage title="Form fields">
      <Example
        title="Vertical field"
        description="The default. The label sits above the control and the field fills its
          column, which is what a form of text inputs wants."
      >
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
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea id="notes" placeholder="Anything payroll should know" />
          </Field>
        </FieldGroup>
      </Example>

      <Example
        title="Horizontal field"
        description="Label and description on the left, control on the right. Field's own
          top alignment, which is what you get outside FieldRows; one setting
          reads fine on its own, and a list of them wants the dividers below."
      >
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="shift-reminders">Shift reminders</FieldLabel>
              <FieldDescription>
                Text employees two hours before a shift starts.
              </FieldDescription>
            </FieldContent>
            <Switch id="shift-reminders" defaultChecked />
          </Field>
        </FieldGroup>
      </Example>

      <Example
        title="Divided rows"
        description="FieldRows swaps the gap between fields for a line and centers each
          control against its label. A row takes any control as its last child,
          so the list can mix a toggle, an input, a select and a combobox
          without any of them being special-cased."
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldRows>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="missed-punch">
                    Missed punch alerts
                  </FieldLabel>
                  <FieldDescription>
                    Email the manager when someone forgets to clock out.
                  </FieldDescription>
                </FieldContent>
                <Switch id="missed-punch" defaultChecked />
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="overtime-threshold">
                    Overtime threshold
                  </FieldLabel>
                  <FieldDescription>
                    Hours in a week before a schedule warns.
                  </FieldDescription>
                </FieldContent>
                <Input
                  id="overtime-threshold"
                  type="number"
                  defaultValue={40}
                  className="w-24"
                />
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="digest">Digest frequency</FieldLabel>
                  <FieldDescription>
                    How often the summary email goes out.
                  </FieldDescription>
                </FieldContent>
                <Select defaultValue="Weekly">
                  <SelectTrigger id="digest" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <FieldDescription>
                    Alerts are sent in this timezone.
                  </FieldDescription>
                </FieldContent>
                <Combobox items={timezones} defaultValue="Pacific Time">
                  <ComboboxInput id="timezone" className="w-48" />
                  <ComboboxContent>
                    <ComboboxList>
                      {(timezone: string) => (
                        <ComboboxItem key={timezone} value={timezone}>
                          {timezone}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Send to</FieldTitle>
                  <FieldDescription>
                    Who receives the alert when it fires.
                  </FieldDescription>
                </FieldContent>
                <RadioGroup
                  defaultValue="manager"
                  className="flex flex-row gap-4"
                >
                  <FieldLabel htmlFor="send-manager" className="font-normal">
                    <RadioGroupItem value="manager" id="send-manager" />
                    Manager
                  </FieldLabel>
                  <FieldLabel htmlFor="send-owner" className="font-normal">
                    <RadioGroupItem value="owner" id="send-owner" />
                    Owner
                  </FieldLabel>
                </RadioGroup>
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="quiet-hours">Quiet hours</FieldLabel>
                  <FieldDescription>
                    Hold alerts between 10pm and 6am.
                  </FieldDescription>
                </FieldContent>
                <Checkbox id="quiet-hours" />
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Webhook</FieldTitle>
                  <FieldDescription>
                    Posting to hooks.harbourcoffee.example
                  </FieldDescription>
                </FieldContent>
                <Badge variant="secondary">Connected</Badge>
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Alert history</FieldTitle>
                  <FieldDescription>
                    Everything sent in the last 90 days.
                  </FieldDescription>
                </FieldContent>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </Field>
            </FieldRows>
          </CardContent>
        </Card>
      </Example>

      <Example
        title="Responsive rows"
        description='orientation="responsive" stacks the label above the control
          until the group is wide enough for a row. Narrow the window to watch
          these rows fold.'
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldRows>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="pay-period">Pay period</FieldLabel>
                  <FieldDescription>
                    Changing this reopens the current period.
                  </FieldDescription>
                </FieldContent>
                <Select defaultValue="Biweekly">
                  <SelectTrigger id="pay-period" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Biweekly">Biweekly</SelectItem>
                    <SelectItem value="Semimonthly">Semimonthly</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="payroll-email">
                    Payroll contact
                  </FieldLabel>
                  <FieldDescription>
                    Where approval reminders are sent.
                  </FieldDescription>
                </FieldContent>
                <Input
                  id="payroll-email"
                  defaultValue="payroll@harbourcoffee.example"
                  className="md:w-64"
                />
              </Field>
            </FieldRows>
          </CardContent>
        </Card>
      </Example>
    </DesignPage>
  );
}
