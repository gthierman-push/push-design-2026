import { NavLink, Outlet, useLocation } from "react-router";
import {
  ArrowLeftIcon,
  BellIcon,
  CreditCardIcon,
  KeyRoundIcon,
  PaletteIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { cn } from "cn";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

const sections = [
  {
    label: "Account",
    items: [
      { title: "Profile", url: "/settings", icon: UserIcon },
      { title: "Appearance", url: "/settings/appearance", icon: PaletteIcon },
      { title: "Notifications", url: "/settings/notifications", icon: BellIcon },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Members", url: "/settings/members", icon: UsersIcon },
      { title: "Billing", url: "/settings/billing", icon: CreditCardIcon },
      { title: "API keys", url: "/settings/api-keys", icon: KeyRoundIcon },
    ],
  },
];

export function SettingsLayout() {
  const { pathname } = useLocation();

  return (
    <div className="bg-background min-h-svh">
      <header className="flex h-14 items-center gap-3 border-b px-4 md:px-8">
        <Button variant="ghost" size="sm" render={<NavLink to="/" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to app
        </Button>
        <Separator orientation="vertical" className="h-4 self-center!" />
        <span className="font-medium">Settings</span>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:px-8 md:py-12">
        <nav className="flex shrink-0 flex-col gap-6 md:w-56">
          {sections.map((section) => (
            <div key={section.label} className="flex flex-col gap-1">
              <span className="text-muted-foreground px-2 text-xs font-medium">
                {section.label}
              </span>
              {section.items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    end
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.title}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
