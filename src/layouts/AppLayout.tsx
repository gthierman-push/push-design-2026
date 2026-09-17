import { NavLink, Outlet, useLocation } from "react-router";
import {
  BadgeDollarSignIcon,
  BriefcaseBusinessIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  CalendarRangeIcon,
  ChartPieIcon,
  CircleHelpIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  ClockIcon,
  FlagIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  MegaphoneIcon,
  MessagesSquareIcon,
  NotebookTextIcon,
  PalmtreeIcon,
  SettingsIcon,
  SparklesIcon,
  TableIcon,
  TrendingUpIcon,
  TrophyIcon,
  UserSearchIcon,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@components/ui/sidebar";

const sections = [
  {
    label: "Scheduling",
    items: [
      { title: "Scheduler", url: "/scheduler", icon: CalendarRangeIcon },
      { title: "Clocks", url: "/clocks", icon: ClockIcon, notify: true },
      {
        title: "Shifts",
        url: "/shifts",
        icon: ClipboardListIcon,
        notify: true,
      },
    ],
  },
  {
    label: "Workforce Management",
    items: [
      { title: "Employees", url: "/employees", icon: UsersIcon },
      { title: "Milestones", url: "/milestones", icon: FlagIcon },
      { title: "Performance", url: "/performance", icon: TrophyIcon },
      { title: "Surveys", url: "/surveys", icon: ClipboardCheckIcon },
      { title: "Time Off", url: "/time-off", icon: PalmtreeIcon },
      { title: "Tasks", url: "/tasks", icon: ListChecksIcon },
    ],
  },
  {
    label: "Hiring",
    items: [
      { title: "Jobs", url: "/jobs", icon: BriefcaseBusinessIcon },
      { title: "Candidates", url: "/candidates", icon: UserSearchIcon },
      { title: "Interviews", url: "/interviews", icon: CalendarCheckIcon },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Chat", url: "/chat", icon: MessagesSquareIcon },
      { title: "Message Board", url: "/message-board", icon: MegaphoneIcon },
    ],
  },
  {
    label: "Payroll",
    items: [
      { title: "Payroll", url: "/payroll", icon: BadgeDollarSignIcon },
      { title: "Timesheets", url: "/timesheets", icon: TableIcon },
    ],
  },
  {
    label: "Reporting",
    items: [
      { title: "Sales", url: "/sales", icon: TrendingUpIcon },
      { title: "Reports", url: "/reports", icon: BriefcaseIcon },
      { title: "Logbook", url: "/logbook", icon: NotebookTextIcon },
      {
        title: "Business Intelligence",
        url: "/business-intelligence",
        icon: ChartPieIcon,
      },
    ],
  },
];

const footerNavigation = [
  { title: "Help", url: "/help", icon: CircleHelpIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

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
                <SidebarMenuButton size="lg" render={<NavLink to="/" />}>
                  <div className="bg-primary-alt text-primary-alt-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                    <LayoutDashboardIcon />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Push</span>
                    <span className="text-muted-foreground text-xs">
                      Workspace
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
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
