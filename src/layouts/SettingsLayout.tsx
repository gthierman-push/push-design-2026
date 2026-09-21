import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  ArrowLeftIcon,
  CornerDownRightIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

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
import type { SettingsField } from "./settings-search";
import { fieldContext, fieldHref, searchSettings } from "./settings-search";

/** Identifies a field row, both as a React key and as a keyboard-cursor slot. */
function fieldKey(pageUrl: string, field: SettingsField) {
  return `${pageUrl}::${field.tab ?? ""}::${field.label}`;
}

export function SettingsLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const current = sections
    .flatMap((section) => section.items)
    .find((item) => item.url === pathname);
  const activeItem = useRef<HTMLLIElement>(null);

  useEffect(() => {
    activeItem.current?.scrollIntoView({ block: "center" });
  }, [pathname]);

  const results = useMemo(() => searchSettings(query), [query]);
  const searching = query.trim().length > 0;

  /**
   * Every result row in the order it renders — the page, then its fields — so
   * the arrow keys can walk one flat list while the sidebar stays grouped.
   */
  const entries = useMemo(
    () =>
      results.flatMap(({ page, fields }) => [
        { key: page.url, href: page.url },
        ...fields.map((field) => ({
          key: fieldKey(page.url, field),
          href: fieldHref(field),
        })),
      ]),
    [results],
  );
  const slots = useMemo(
    () => new Map(entries.map((entry, index) => [entry.key, index])),
    [entries],
  );

  const resultList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultList.current
      ?.querySelector(`[data-search-slot="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor, entries]);

  function search(value: string) {
    setQuery(value);
    setCursor(0);
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      search("");
      return;
    }
    if (entries.length === 0 || event.nativeEvent.isComposing) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((index) => (index + 1) % entries.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((index) => (index - 1 + entries.length) % entries.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      navigate(entries[cursor].href);
    }
  }

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
              type="text"
              placeholder="Search settings and fields"
              aria-label="Search settings"
              value={query}
              onChange={(event) => search(event.target.value)}
              onKeyDown={onSearchKeyDown}
              className="h-8 pr-7 pl-7"
            />
            {searching ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => search("")}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-1.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <XIcon className="size-3.5" />
              </button>
            ) : null}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {searching ? (
            <SidebarGroup>
              <SidebarGroupLabel>
                {results.length > 0 ? "Results" : "No matches"}
              </SidebarGroupLabel>
              <SidebarGroupContent ref={resultList}>
                {results.length > 0 ? (
                  <SidebarMenu>
                    {results.map(({ page, fields }) => (
                      <SidebarMenuItem key={page.url}>
                        <SidebarMenuButton
                          data-search-slot={slots.get(page.url)}
                          isActive={slots.get(page.url) === cursor}
                          onMouseEnter={() => setCursor(slots.get(page.url)!)}
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
                                key={fieldKey(page.url, field)}
                              >
                                <SidebarMenuSubButton
                                  data-search-slot={slots.get(
                                    fieldKey(page.url, field),
                                  )}
                                  isActive={
                                    slots.get(fieldKey(page.url, field)) ===
                                    cursor
                                  }
                                  onMouseEnter={() =>
                                    setCursor(
                                      slots.get(fieldKey(page.url, field))!,
                                    )
                                  }
                                  className="h-auto py-1"
                                  render={
                                    <NavLink
                                      to={fieldHref(field)}
                                      end={false}
                                    />
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
                      <SidebarMenuItem
                        key={item.url}
                        ref={pathname === item.url ? activeItem : undefined}
                      >
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
