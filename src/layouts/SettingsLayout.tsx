import { NavLink, Outlet, useLocation } from "react-router";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";

import { settingsSections } from "@components/settings-nav";
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@components/ui/sidebar";

export function SettingsLayout() {
  const { pathname } = useLocation();
  const current = settingsSections
    .flatMap((section) => section.items)
    .find((item) => item.url === pathname);

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" render={<NavLink to="/" />}>
                <ArrowLeftIcon />
                <span>Back to app</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
            <SidebarInput
              type="search"
              placeholder="Search"
              aria-label="Search settings"
              className="h-8 pl-7"
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {settingsSections.map((section) => (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        isActive={pathname === item.url}
                        tooltip={item.title}
                        render={<NavLink to={item.url} end />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4 self-center!" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {current?.title ?? "Company Setup"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
