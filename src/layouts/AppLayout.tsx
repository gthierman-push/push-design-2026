import { NavLink, Outlet, useLocation } from "react-router";
import { SettingsIcon, SparklesIcon } from "lucide-react";

import { AccountSwitcher } from "@components/account-switcher";
import { askAiPanel } from "@components/ask-ai-panel";
import { CommandPalette } from "@components/command-palette";
import {
  RightPanel,
  RightPanelProvider,
  RightPanelTrigger,
} from "@components/right-panel";
import { Button } from "@components/ui/button";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@components/ui/breadcrumb";
import { Separator } from "@components/ui/separator";
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

import { footerNavigation, home, sections } from "./app-nav";

export function AppLayout() {
  const { pathname } = useLocation();
  const current = sections
    .flatMap((section) => section.items)
    .find((item) => item.url === pathname);

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
              <SidebarGroup key={section.label}>
                <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
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
              </SidebarGroup>
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
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 self-center!"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {current?.title ?? "Dashboard"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-2">
              {current?.settingsUrl ? (
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={`${current.title} settings`}
                  render={<NavLink to={current.settingsUrl} />}
                >
                  <SettingsIcon />
                </Button>
              ) : null}
              <RightPanelTrigger
                panel={askAiPanel}
                render={<Button variant="outline" size="sm" />}
              >
                <SparklesIcon data-icon="inline-start" />
                Ask A.I.
              </RightPanelTrigger>
            </div>
          </header>
          <div className="bg-muted flex flex-1 flex-col gap-4 p-5">
            <Outlet />
          </div>
        </SidebarInset>

        <RightPanel />
      </SidebarProvider>
    </RightPanelProvider>
  );
}
