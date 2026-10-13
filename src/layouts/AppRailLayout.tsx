import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { PanelLeftIcon, type LucideIcon } from "lucide-react";

import { cn } from "cn";
import { AccountSwitcher } from "@components/account-switcher";
import { CommandPalette } from "@components/command-palette";
import { GetStarted } from "@components/get-started";
import { PushLogo } from "@components/push-logo";
import { RightPanel, RightPanelProvider } from "@components/right-panel";
import { Button } from "@components/ui/button";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";

import { AppHeader } from "./AppHeader";
import { footerNavigation, home, sections } from "./app-nav";

/**
 * One slot on the rail: an icon tile with its name under it, the way Canva
 * stacks its sections. The tile fills when it is the one being shown; the
 * page you are actually on is named in full-strength lettering.
 */
function RailItem({
  icon: Icon,
  label,
  title = label,
  to,
  onClick,
  selected = false,
  current = false,
}: {
  icon: LucideIcon;
  /** The name under the tile, shortened where the full one would not fit. */
  label: string;
  /** The full name, for the tooltip. */
  title?: string;
  /** A link goes somewhere; without one the slot only changes the panel. */
  to?: string;
  onClick?: () => void;
  /** Its pages are the ones in the panel beside the rail. */
  selected?: boolean;
  /** The page on screen is one of its pages. */
  current?: boolean;
}) {
  const className =
    "group/rail focus-visible:ring-sidebar-ring flex w-full flex-col items-center gap-1 rounded-lg py-1 outline-hidden focus-visible:ring-2";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          to ? (
            <NavLink to={to} className={className} onClick={onClick} />
          ) : (
            <button type="button" className={className} onClick={onClick} />
          )
        }
      >
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg transition-colors [&_svg]:size-5",
            selected
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "group-hover/rail:bg-sidebar-accent/50 group-hover/rail:text-sidebar-accent-foreground",
            // No marker on the rail: browsing another section is the only
            // time the page and the panel part ways, and full-strength
            // lettering is enough to say which one you are on.
            !selected &&
              (current
                ? "text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70"),
          )}
        >
          <Icon />
        </span>
        <span
          className={cn(
            "line-clamp-2 w-full px-1 text-center text-[11px] leading-tight break-words",
            selected || current
              ? "text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70",
          )}
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        {title}
      </TooltipContent>
    </Tooltip>
  );
}

/** Opens and closes the sub nav beside the rail. The rail itself stays put. */
function PanelTrigger() {
  const { open, setOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="-ml-1"
      aria-label={open ? "Hide sub nav" : "Show sub nav"}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      <PanelLeftIcon />
    </Button>
  );
}

function RailNav() {
  const { pathname } = useLocation();
  const { open, setOpen } = useSidebar();

  const currentSection = sections.find((section) =>
    section.items.some((item) => item.url === pathname),
  );

  // The panel shows the section being browsed, which follows the page by
  // default but can be pointed anywhere by clicking the rail.
  const [shown, setShown] = useState(
    currentSection?.label ?? sections[0].label,
  );
  useEffect(() => {
    if (currentSection) setShown(currentSection.label);
  }, [currentSection]);

  const section = sections.find((item) => item.label === shown) ?? sections[0];

  const show = (label: string) => {
    setShown(label);
    // Clicking a section asks to see its pages, so a closed panel comes back.
    setOpen(true);
  };

  return (
    <>
      <nav
        aria-label="Sections"
        className="bg-sidebar text-sidebar-foreground sticky top-0 flex h-svh w-20 shrink-0 flex-col items-center gap-1 border-r px-1.5 py-2"
      >
        <NavLink
          to={home.url}
          aria-label="Push"
          className="flex h-9 shrink-0 items-center justify-center"
        >
          <PushLogo className="h-4 w-auto" />
        </NavLink>

        <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-1 overflow-y-auto py-1">
          <RailItem
            icon={home.icon}
            label={home.title}
            to={home.url}
            selected={pathname === home.url}
            current={pathname === home.url}
          />

          {sections.map((item) => (
            <RailItem
              key={item.label}
              icon={item.icon}
              label={item.short ?? item.label}
              title={item.label}
              selected={open && item.label === section.label}
              current={item.label === currentSection?.label}
              onClick={() => show(item.label)}
            />
          ))}
        </div>

        <div className="flex w-full shrink-0 flex-col items-center gap-1 border-t pt-2">
          {footerNavigation.map((item) => (
            <RailItem
              key={item.url}
              icon={item.icon}
              label={item.title}
              to={item.url}
              selected={pathname === item.url}
              current={pathname === item.url}
            />
          ))}
        </div>
      </nav>

      <aside
        aria-label={`${section.label} pages`}
        className={cn(
          "bg-sidebar text-sidebar-foreground sticky top-0 flex h-svh shrink-0 flex-col overflow-hidden border-r transition-[width] duration-[140ms] ease-out",
          open ? "w-(--sidebar-width)" : "w-0 border-r-0",
        )}
      >
        {/* Fixed width inside the animating shell, so the rows slide out of
            view rather than reflowing on the way. */}
        <div className="flex h-full w-(--sidebar-width) flex-col">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <AccountSwitcher />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <CommandPalette />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {/* No heading: the rail already names the section, so repeating
                it here only pushes the pages down. */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        isActive={pathname === item.url}
                        render={<NavLink to={item.url} />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.notify ? <SidebarMenuBadge /> : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <GetStarted />
          </SidebarFooter>
        </div>
      </aside>
    </>
  );
}

/**
 * Variation 1: the sections live on an icon rail, and the one being browsed
 * fills the sidebar beside it with its pages — Canva's arrangement.
 */
export function AppRailLayout() {
  return (
    <RightPanelProvider>
      <SidebarProvider>
        <RailNav />

        <SidebarInset>
          <AppHeader trigger={<PanelTrigger />} />
          <div className="bg-muted flex flex-1 flex-col gap-4 p-5">
            <Outlet />
          </div>
        </SidebarInset>

        <RightPanel />
      </SidebarProvider>
    </RightPanelProvider>
  );
}
