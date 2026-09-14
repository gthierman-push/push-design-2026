import { cn } from "cn";

import { Button } from "@components/ui/button";
import { PushLogo } from "@components/push-logo";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@components/ui/field";
import { Input } from "@components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} noValidate {...props}>
      <FieldGroup>
        <div className="flex flex-col items-start gap-10">
          <PushLogo />
          <h1 className="text-2xl font-medium">Login to your account</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" />
          <FieldDescription className="text-xs [&>a]:no-underline! [&>a:hover]:underline!">
            <a href="#">Reset password</a>
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Login</Button>
          <FieldDescription className="text-xs [&>a]:no-underline! [&>a:hover]:underline!">
            Don&apos;t have an account?{" "}
            <a href="#">Sign up</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
