import { NavLink, Outlet, useLocation } from "react-router";
import { BoxIcon, LayersIcon, PaletteIcon } from "lucide-react";

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
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@components/ui/sidebar";

const sections = [
  {
    label: "Foundations",
    icon: PaletteIcon,
    items: [
      { title: "Colors", url: "/design" },
      { title: "Typography", url: "/design/typography" },
      { title: "Spacing", url: "/design/spacing" },
      { title: "Radius & shadow", url: "/design/radius" },
      { title: "Icons", url: "/design/icons" },
    ],
  },
  {
    label: "Components",
    icon: BoxIcon,
    items: [
      { title: "Button", url: "/design/button" },
      { title: "Badge", url: "/design/badge" },
      { title: "Card", url: "/design/card" },
      { title: "Form fields", url: "/design/fields" },
      { title: "Table", url: "/design/table" },
      { title: "Tabs", url: "/design/tabs" },
      { title: "Overlays", url: "/design/overlays" },
    ],
  },
  {
    label: "Patterns",
    icon: LayersIcon,
    items: [
      { title: "Empty states", url: "/design/empty-states" },
      { title: "Data display", url: "/design/data-display" },
      { title: "Navigation", url: "/design/navigation" },
    ],
  },
];

export function DesignLayout() {
  const { pathname } = useLocation();
  const current = sections
    .flatMap((section) => section.items)
    .find((item) => item.url === pathname);

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" render={<NavLink to="/" />}>
                <span>Back to app</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {sections.map((section) => (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel className="gap-2">
                <section.icon />
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        // Indent past the section label's icon so the two
                        // text columns line up: pl-4 + icon 1rem + gap-2.
                        className="pl-10"
                        isActive={pathname === item.url}
                        tooltip={item.title}
                        render={<NavLink to={item.url} end />}
                      >
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
                <BreadcrumbPage>{current?.title ?? "Colors"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
