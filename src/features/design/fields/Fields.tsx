import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { Textarea } from "@components/ui/textarea";
import { DesignPage, Example } from "@features/design/example";

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
        description="Label and description on the left, control on the right, with Field's
          own top alignment. One setting reads fine on its own; a list of them
          is the Horizontal form pattern."
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
    </DesignPage>
  );
}
