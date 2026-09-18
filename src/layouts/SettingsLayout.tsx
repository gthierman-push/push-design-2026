import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import {
  AlarmClockIcon,
  ArrowLeftIcon,
  BadgeDollarSignIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  ClockIcon,
  CoffeeIcon,
  CoinsIcon,
  FileTextIcon,
  FilesIcon,
  FolderTreeIcon,
  GaugeIcon,
  HeartHandshakeIcon,
  KeyRoundIcon,
  LandmarkIcon,
  NetworkIcon,
  PalmtreeIcon,
  PlugIcon,
  ReceiptTextIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  TagsIcon,
  TrendingUpIcon,
  UserCogIcon,
  UserPlusIcon,
  UsersIcon,
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
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@components/ui/sidebar";

const sections = [
  {
    label: "Company",
    items: [
      { title: "Company Setup", url: "/settings", icon: BuildingIcon },
      {
        title: "Departments",
        url: "/settings/departments",
        icon: FolderTreeIcon,
      },
      { title: "Positions", url: "/settings/positions", icon: BriefcaseIcon },
      {
        title: "Profit Centers",
        url: "/settings/profit-centers",
        icon: TrendingUpIcon,
      },
      {
        title: "Period Labels",
        url: "/settings/period-labels",
        icon: TagsIcon,
      },
      { title: "Alarms", url: "/settings/alarms", icon: AlarmClockIcon },
    ],
  },
  {
    label: "Admins & Security",
    items: [
      {
        title: "Administrators",
        url: "/settings/administrators",
        icon: UserCogIcon,
      },
      { title: "Roles", url: "/settings/roles", icon: KeyRoundIcon },
      {
        title: "Security Settings",
        url: "/settings/security",
        icon: ShieldCheckIcon,
      },
      {
        title: "Fraud Reviews",
        url: "/settings/fraud-reviews",
        icon: ShieldAlertIcon,
      },
    ],
  },
  {
    label: "Payroll & Compensation",
    items: [
      { title: "Tax Setup", url: "/settings/tax-setup", icon: LandmarkIcon },
      {
        title: "Statutory Holidays",
        url: "/settings/statutory-holidays",
        icon: CalendarDaysIcon,
      },
      {
        title: "Hours Structures",
        url: "/settings/hours-structures",
        icon: ClockIcon,
      },
      {
        title: "Pay Stub Settings",
        url: "/settings/pay-stubs",
        icon: ReceiptTextIcon,
      },
      {
        title: "Journal Entry Settings",
        url: "/settings/journal-entries",
        icon: FileTextIcon,
      },
      {
        title: "Bulk Salary Updates",
        url: "/settings/bulk-salary-updates",
        icon: BadgeDollarSignIcon,
      },
      {
        title: "Benefits Setup",
        url: "/settings/benefits",
        icon: HeartHandshakeIcon,
      },
    ],
  },
  {
    label: "Scheduling",
    items: [
      {
        title: "Clock Settings",
        url: "/settings/clock-settings",
        icon: SlidersHorizontalIcon,
      },
      {
        title: "Clock Surveys",
        url: "/settings/clock-surveys",
        icon: ClipboardListIcon,
      },
      { title: "Breaks", url: "/settings/breaks", icon: CoffeeIcon },
      { title: "Tips Settings", url: "/settings/tips", icon: CoinsIcon },
      { title: "Time Off", url: "/settings/time-off", icon: PalmtreeIcon },
      { title: "Labor Guide", url: "/settings/labor-guide", icon: GaugeIcon },
    ],
  },
  {
    label: "Employees & Onboarding",
    items: [
      {
        title: "Employee Settings",
        url: "/settings/employee-settings",
        icon: UsersIcon,
      },
      {
        title: "Employee Attributes",
        url: "/settings/employee-attributes",
        icon: NetworkIcon,
      },
      {
        title: "Onboarding Settings",
        url: "/settings/onboarding",
        icon: UserPlusIcon,
      },
      { title: "Forms", url: "/settings/forms", icon: FileTextIcon },
    ],
  },
  {
    label: "Files",
    items: [
      {
        title: "File Categories",
        url: "/settings/file-categories",
        icon: FolderTreeIcon,
      },
      {
        title: "Company Files",
        url: "/settings/company-files",
        icon: FilesIcon,
      },
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        title: "POS / Integrations",
        url: "/settings/integrations",
        icon: PlugIcon,
      },
    ],
  },
];

export function SettingsLayout() {
  const { pathname } = useLocation();
  const current = sections
    .flatMap((section) => section.items)
    .find((item) => item.url === pathname);
  const activeItem = useRef<HTMLLIElement>(null);

  useEffect(() => {
    activeItem.current?.scrollIntoView({ block: "center" });
  }, [pathname]);

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
          {sections.map((section) => (
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
