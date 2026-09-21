import * as React from "react";
import { NavLink, useNavigate } from "react-router";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";

import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@components/ui/sidebar";

import type { Account } from "@components/accounts";
import { accounts, currentUser, regionsOf } from "@components/accounts";

import { useAuth } from "../auth";

/**
 * Company avatars are rounded squares so they never read as a person; the
 * signed-in user keeps the circle.
 */
function AccountAvatar({
  account,
  size = "default",
}: {
  account: Account;
  size?: "sm" | "default" | "lg";
}) {
  return (
    <Avatar size={size} className="rounded-md after:rounded-md">
      {account.image ? (
        <AvatarImage src={account.image} alt="" className="rounded-md" />
      ) : null}
      {/* Important: menu rows recolor every descendant on hover, and the
          initials sit on their own filled square, so they keep their color. */}
      <AvatarFallback className="bg-primary-alt text-primary-alt-foreground! rounded-md text-xs font-medium">
        {account.initials}
      </AvatarFallback>
    </Avatar>
  );
}

/**
 * The sidebar header: which company the app is pointed at, every other one
 * the user can switch to, and who they are signed in as.
 */
export function AccountSwitcher() {
  const [activeId, setActiveId] = React.useState(accounts[0].id);
  /** null is the company-wide view -- every location it runs. */
  const [locationId, setLocationId] = React.useState<string | null>(null);
  const active = accounts.find((account) => account.id === activeId)!;
  const location = active.locations.find((item) => item.id === locationId);
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  /** Picking a company opens it company-wide and leaves the menu open, so
      the locations it just revealed can be picked from. */
  const selectAccount = (account: Account) => {
    setActiveId(account.id);
    setLocationId(null);
  };

  const selectLocation = (id: string | null) => {
    setLocationId(id);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <DropdownMenu>
      {/* No aria-label: the company and location names inside the trigger are
          its accessible name, and Base UI marks it as a menu button. */}
      <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
        <AccountAvatar account={active} />
        {/* leading-tight, not leading-none: truncate clips each line to its
            own box, and a box the height of the type cuts the descenders
            off the names. */}
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-medium">{active.name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {location?.name ?? "All locations"}
          </span>
        </div>
        <ChevronsUpDownIcon className="text-muted-foreground ml-auto" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-64"
        align="start"
        side={isMobile ? "bottom" : "right"}
        sideOffset={isMobile ? 4 : 8}
      >
        {/* Who you are, first: the switcher's second line says which company
            the app is pointed at, not which person is holding it. The row
            itself is the link to the profile. */}
        <DropdownMenuItem
          className="gap-2 p-1.5"
          render={<NavLink to="/settings/administrators" />}
        >
          <Avatar size="sm">
            <AvatarFallback>
              <UserIcon className="size-3.5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-medium">{currentUser.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {currentUser.email}
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Companies</DropdownMenuLabel>

          {accounts.map((account) => (
            <DropdownMenuItem
              key={account.id}
              className="gap-2 p-1.5"
              closeOnClick={false}
              onClick={() => selectAccount(account)}
            >
              <AccountAvatar account={account} size="sm" />
              <span className="min-w-0 flex-1 truncate">{account.name}</span>
              <CheckIcon
                className={cn(account.id !== activeId && "invisible")}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {/* primary: the brand accent, so the actions in the list read as
            actions rather than as another company row. */}
        <DropdownMenuItem className="text-primary gap-2">
          <PlusIcon />
          <span>Add company</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* The selected company's locations, as their own section: the
            company-wide view on top, then one group per province or state so
            the regions carry their own headings. */}
        <DropdownMenuItem
          className="gap-2"
          onClick={() => selectLocation(null)}
        >
          <span className="min-w-0 flex-1 truncate">All locations</span>
          <CheckIcon className={cn(locationId !== null && "invisible")} />
        </DropdownMenuItem>

        {regionsOf(active).map(({ region, locations }) => (
          <DropdownMenuGroup key={region}>
            <DropdownMenuLabel>{region}</DropdownMenuLabel>

            {locations.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="gap-2"
                onClick={() => selectLocation(item.id)}
              >
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                <CheckIcon
                  className={cn(item.id !== locationId && "invisible")}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}

        <DropdownMenuItem className="text-primary gap-2">
          <PlusIcon />
          <span>Add location</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              signOut();
              navigate("/login", { replace: true });
            }}
          >
            <LogOutIcon />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
