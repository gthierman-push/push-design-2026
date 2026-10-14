import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

import type { Employee } from "./roster";

/**
 * A person's photo, falling back to their initials whenever the picture is
 * missing or fails to load. It sits on its own because two places draw it: the
 * roster tables, and the command palette's people results.
 */
export function EmployeeAvatar({
  employee,
  size = "sm",
}: {
  employee: Pick<Employee, "name" | "photo">;
  size?: "sm" | "default" | "lg";
}) {
  const initials = employee.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <Avatar size={size}>
      <AvatarImage src={employee.photo} alt="" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
