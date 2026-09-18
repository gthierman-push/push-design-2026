import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
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
import { DesignPage } from "@features/design/example";

const timezones = [
  "Pacific Time",
  "Mountain Time",
  "Central Time",
  "Eastern Time",
  "Atlantic Time",
];

export function HorizontalForm() {
  return (
    <DesignPage title="Horizontal form">
      {/* The card is its own container, so this example skips the bordered
          preview the other pages use and sits straight on the page. */}
      <section className="flex w-full max-w-5xl flex-col gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldRows>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="shift-reminders">
                    Shift reminders
                  </FieldLabel>
                  <FieldDescription>
                    Text employees two hours before a shift starts.
                  </FieldDescription>
                </FieldContent>
                <Switch id="shift-reminders" defaultChecked />
              </Field>

              <Field orientation="responsive">
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

              <Field orientation="responsive">
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

              <Field orientation="responsive">
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

              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="quiet-hours">Quiet hours</FieldLabel>
                  <FieldDescription>
                    Hold alerts between 10pm and 6am.
                  </FieldDescription>
                </FieldContent>
                <Checkbox id="quiet-hours" />
              </Field>

              {/* The last two rows report rather than ask, so they carry a
                  FieldTitle instead of a FieldLabel — there is no control for
                  a label to point at. Which primitive these rows should really
                  use is still open. */}
              <Field orientation="responsive">
                <FieldContent>
                  <FieldTitle>Webhook</FieldTitle>
                  <FieldDescription>
                    Posting to hooks.harbourcoffee.example
                  </FieldDescription>
                </FieldContent>
                <Badge variant="secondary">Connected</Badge>
              </Field>

              <Field orientation="responsive">
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
      </section>
    </DesignPage>
  );
}
