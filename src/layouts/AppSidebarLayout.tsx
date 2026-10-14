import { NavLink, Outlet, useLocation } from "react-router";
import { ChevronRightIcon } from "lucide-react";

import { AccountSwitcher } from "@components/account-switcher";
import { CommandPalette } from "@components/command-palette";
import { GetStarted } from "@components/get-started";
import { RightPanel, RightPanelProvider } from "@components/right-panel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@components/ui/sidebar";

import { AppHeader } from "./AppHeader";
import { footerNavigation, home, sections } from "./app-nav";
import { useNavSections } from "./use-nav-sections";

/** The standing nav: one sidebar, every section a collapsible group in it. */
export function AppSidebarLayout() {
  const { pathname } = useLocation();

  // Each section is a collapsible group, as in the design system's sidebar.
  const { isOpen, setOpen } = useNavSections({
    sections,
    storageKey: "push-design:nav-sections",
    pathname,
  });

  return (
    <RightPanelProvider>
      <SidebarProvider>
        <Sidebar collapsible="offcanvas">
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
            {/* The switcher took the logo's spot, so the dashboard needs a row
                of its own to stay reachable from the sidebar. */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === home.url}
                      tooltip={home.title}
                      render={<NavLink to={home.url} />}
                    >
                      <home.icon />
                      <span>{home.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {sections.map((section) => (
              <Collapsible
                key={section.label}
                open={isOpen(section.label)}
                onOpenChange={(open) => setOpen(section.label, open)}
                render={<SidebarGroup />}
              >
                <SidebarGroupLabel
                  className="group/label hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  render={<CollapsibleTrigger />}
                >
                  {section.label}
                  <ChevronRightIcon className="ml-auto transition-transform group-data-[panel-open]/label:rotate-90" />
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            isActive={pathname === item.url}
                            tooltip={item.title}
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
                </CollapsibleContent>
              </Collapsible>
            ))}
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              {footerNavigation.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    render={<NavLink to={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {/* Below the standing links rather than above: Help and Settings
                are fixtures, and the checklist is the one thing down here that
                goes away once it is finished. */}
            <GetStarted />
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <AppHeader trigger={<SidebarTrigger className="-ml-1" />} />
          <div className="bg-muted flex flex-1 flex-col gap-4 p-5">
            <Outlet />
          </div>
        </SidebarInset>

        <RightPanel />
      </SidebarProvider>
    </RightPanelProvider>
  );
}
