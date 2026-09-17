import { NavLink, Outlet, useLocation } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { cn } from "cn";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Separator } from "@components/ui/separator";

const sections = [
  {
    label: "Foundations",
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
    <div className="bg-background flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur md:px-6">
        <Button variant="ghost" size="sm" render={<NavLink to="/" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to app
        </Button>
        <Separator orientation="vertical" className="h-4 self-center!" />
        <span className="font-medium">Design system</span>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r md:block">
          <ScrollArea className="h-[calc(100svh-3.5rem)]">
            <nav className="flex flex-col gap-6 p-4">
              {sections.map((section) => (
                <div key={section.label} className="flex flex-col gap-1">
                  <span className="text-muted-foreground px-2 text-xs font-medium">
                    {section.label}
                  </span>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      end
                      className={cn(
                        "rounded-md px-2 py-1.5 text-sm transition-colors",
                        pathname === item.url
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-tight">
                {current?.title ?? "Colors"}
              </h1>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
