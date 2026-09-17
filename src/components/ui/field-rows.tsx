import { cn } from "cn";

/**
 * `FieldGroup`'s other shape: rows divided by a line rather than separated by
 * a gap, the way a settings card reads. It takes plain `Field` children, so a
 * row holds whatever control the setting needs — switch, input, select,
 * combobox, radio group, or no control at all — and each row still chooses its
 * own `orientation`.
 *
 * Use `FieldGroup` for an ordinary form and this for a list of settings; the
 * dividers are what tell the reader the rows are a list and not one form.
 * Drop it straight into `CardContent`: the row padding gives the lines the
 * card's full width while keeping the text on the card's own gutter.
 *
 * `align` decides where the control sits against a label and description.
 * Centered is the default because a settings row's description is a line or
 * two and a control floating at the top of it reads as misaligned; `"start"`
 * hands the rows back to `Field`'s own top alignment, which is the better
 * answer when the descriptions run long enough to wrap.
 */
function FieldRows({
  className,
  align = "center",
  ...props
}: React.ComponentProps<"div"> & { align?: "center" | "start" }) {
  return (
    <div
      data-slot="field-rows"
      data-align={align}
      // The container query is named after the field group because that is the
      // name `orientation="responsive"` watches; without it a responsive row
      // in here would never turn horizontal.
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col",
        "*:data-[slot=field]:py-4 *:data-[slot=field]:not-first:border-t",
        // Field top-aligns the control the moment a FieldContent shows up, so
        // centering has to out-specify that rule rather than just follow it.
        "data-[align=center]:*:data-[slot=field]:has-[>[data-slot=field-content]]:items-center",
        className,
      )}
      {...props}
    />
  );
}

export { FieldRows };
