import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

import type { Employee } from "./roster";

/**
 * A person's photo, falling back to their initials whenever the picture is
 * missing or fails to load. It sits on its own because three places draw it:
 * the roster tables, the command palette's people results, and the profile
 * page -- whose header wants one bigger than the three sizes the component
 * ships, which is what the class is for.
 */
export function EmployeeAvatar({
  employee,
  size = "sm",
  className,
}: {
  employee: Pick<Employee, "name" | "photo">;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const initials = employee.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <Avatar size={size} className={className}>
      <AvatarImage src={employee.photo} alt="" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
