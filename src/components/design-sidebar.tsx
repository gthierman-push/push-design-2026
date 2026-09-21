import * as React from "react";
import { NavLink, useLocation } from "react-router";
import { ArrowLeftIcon, ChevronRightIcon, SwatchBookIcon } from "lucide-react";

import { designSections } from "@components/design-nav";
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
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@components/ui/sidebar";

/**
 * The design system's own nav: a docs sidebar rather than an app one. Each
 * section is a collapsible group whose label is the trigger, and its pages sit
 * directly beneath as a flat menu, so the library reads as one outline. The
 * search box filters that outline in place.
 */
export function DesignSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const [query, setQuery] = React.useState("");
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >(() => Object.fromEntries(designSections.map((s) => [s.label, true])));

  const needle = query.trim().toLowerCase();
  const sections = designSections
    .map((section) => ({
      ...section,
      items: needle
        ? section.items.filter((item) =>
            item.title.toLowerCase().includes(needle),
          )
        : section.items,
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* A lockup rather than a link: "back to app" lives in the
                footer, so the header has nowhere of its own to go. */}
            <SidebarMenuButton
              size="lg"
              className="cursor-default hover:bg-transparent hover:text-sidebar-foreground"
              render={<div />}
            >
              <div className="bg-primary-alt text-primary-alt-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-md">
                <SwatchBookIcon className="size-4" />
              </div>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-medium">Push</span>
                <span className="text-muted-foreground truncate text-xs">
                  Design system
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarInput
          type="search"
          placeholder="Search the library"
          aria-label="Search the library"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* One collapsible group per section, as in the docs sidebar. */}
        {sections.map((section) => (
          <Collapsible
            key={section.label}
            // A search forces the remaining sections open; otherwise each one
            // stays wherever the reader last left it.
            open={needle ? true : openSections[section.label]}
            onOpenChange={(open) =>
              setOpenSections((previous) => ({
                ...previous,
                [section.label]: open,
              }))
            }
            render={<SidebarGroup />}
          >
            <SidebarGroupLabel
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
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
                        render={<NavLink to={item.url} end />}
                      >
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {sections.length === 0 ? (
          <p className="text-muted-foreground px-4 py-2 text-sm">
            No pages match “{query.trim()}”.
          </p>
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Back to app"
              render={<NavLink to="/" />}
            >
              <ArrowLeftIcon />
              <span>Back to app</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
