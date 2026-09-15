import { NavLink, Outlet, useLocation } from "react-router";
import {
  BarChart3Icon,
  CalendarIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

import { askAiPanel } from "@components/ask-ai-panel";
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@components/ui/sidebar";

const navigation = [
  { title: "Dashboard", url: "/", icon: LayoutDashboardIcon },
  { title: "Schedule", url: "/schedule", icon: CalendarIcon },
  { title: "People", url: "/people", icon: UsersIcon },
  { title: "Reports", url: "/reports", icon: BarChart3Icon },
];

export function AppLayout() {
  const { pathname } = useLocation();
  const current = navigation.find((item) => item.url === pathname);

  return (
    <RightPanelProvider>
      <SidebarProvider>
        <Sidebar collapsible="offcanvas">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" render={<NavLink to="/" />}>
                  <div className="bg-primary-alt text-primary-alt-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                    <LayoutDashboardIcon />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Push</span>
                    <span className="text-muted-foreground text-xs">Workspace</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
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
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Settings"
                  render={<NavLink to="/settings" />}
                >
                  <SettingsIcon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 self-center!" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{current?.title ?? "Dashboard"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-2">
              <RightPanelTrigger
                panel={askAiPanel}
                render={<Button variant="outline" size="sm" />}
              >
                <SparklesIcon data-icon="inline-start" />
                Ask A.I.
              </RightPanelTrigger>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>

        <RightPanel />
      </SidebarProvider>
    </RightPanelProvider>
  );
}
