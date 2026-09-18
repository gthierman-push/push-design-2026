import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { ArrowLeftIcon, CornerDownRightIcon, SearchIcon } from "lucide-react";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@components/ui/sidebar";

import { sections } from "./settings-nav";
import { fieldContext, fieldHref, searchSettings } from "./settings-search";

export function SettingsLayout() {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  const current = sections
    .flatMap((section) => section.items)
    .find((item) => item.url === pathname);

  const results = useMemo(() => searchSettings(query), [query]);
  const searching = query.trim().length > 0;

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
              placeholder="Search settings and fields"
              aria-label="Search settings"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8 pl-7"
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {searching ? (
            <SidebarGroup>
              <SidebarGroupLabel>
                {results.length > 0 ? "Results" : "No matches"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {results.length > 0 ? (
                  <SidebarMenu>
                    {results.map(({ page, fields }) => (
                      <SidebarMenuItem key={page.url}>
                        <SidebarMenuButton
                          isActive={pathname === page.url}
                          tooltip={page.title}
                          render={<NavLink to={page.url} end />}
                        >
                          <page.icon />
                          <span>{page.title}</span>
                        </SidebarMenuButton>

                        {fields.length > 0 ? (
                          <SidebarMenuSub>
                            {fields.map((field) => (
                              <SidebarMenuSubItem
                                key={`${field.tab}-${field.label}`}
                              >
                                <SidebarMenuSubButton
                                  className="h-auto py-1"
                                  render={
                                    <NavLink to={fieldHref(field)} end={false} />
                                  }
                                >
                                  <CornerDownRightIcon className="text-muted-foreground" />
                                  <span className="flex min-w-0 flex-col">
                                    <span className="truncate">
                                      {field.label}
                                    </span>
                                    <span className="text-muted-foreground truncate text-xs">
                                      {fieldContext(field)}
                                    </span>
                                  </span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        ) : null}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                ) : (
                  <p className="text-muted-foreground px-2 py-1.5 text-sm">
                    Nothing matches “{query.trim()}”.
                  </p>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            sections.map((section) => (
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
            ))
          )}
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
        <div className="bg-muted flex flex-1 flex-col gap-4 p-5">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
