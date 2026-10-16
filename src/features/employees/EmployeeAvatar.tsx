import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@components/ui/avatar";

import { onShiftNow } from "./on-shift";
import type { Employee } from "./roster";

/**
 * A person's photo, falling back to their initials whenever the picture is
 * missing or fails to load. It sits on its own because three places draw it:
 * the roster tables, the command palette's people results, and the profile
 * page -- whose header wants one bigger than the three sizes the component
 * ships, which is what the class is for.
 *
 * Anyone on shift right now wears a green dot. It is decided here rather
 * than asked for, so a face says the same thing wherever it turns up: a
 * palette result and the row behind it cannot disagree about who is in.
 */
export function EmployeeAvatar({
  employee,
  size = "sm",
  className,
}: {
  employee: Pick<Employee, "id" | "name" | "photo" | "department" | "status">;
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
      {onShiftNow(employee) && (
        /* Green rather than the badge's default, which is the brand colour
           and would read as a count or a tick. The ring the badge already
           wears is what keeps the dot off a dark photo. */
        <AvatarBadge
          title="On shift now"
          className="bg-emerald-500 dark:bg-emerald-400"
        >
          <span className="sr-only">On shift now</span>
        </AvatarBadge>
      )}
    </Avatar>
  );
}
