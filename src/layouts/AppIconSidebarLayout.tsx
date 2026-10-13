import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CircleHelpIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";

import { AccountSwitcher } from "@components/account-switcher";
import { currentUser } from "@components/accounts";
import { CommandPalette } from "@components/command-palette";
import { GetStarted } from "@components/get-started";
import { RightPanel, RightPanelProvider } from "@components/right-panel";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@components/ui/sidebar";

import { useAuth } from "../auth";
import { AppHeader } from "./AppHeader";
import { footerNavigation, home, sections } from "./app-nav";
import { useNavSections } from "./use-nav-sections";

/**
 * The signed-in user at the foot of the sidebar, as the block has it: the
 * company lives in the switcher up top, the person lives down here.
 */
function NavUser() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
        <Avatar>
          <AvatarFallback>
            <UserIcon className="size-3.5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-medium">{currentUser.name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {currentUser.email}
          </span>
        </div>
        <ChevronsUpDownIcon className="text-muted-foreground ml-auto" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56"
        align="end"
        side={isMobile ? "bottom" : "right"}
        sideOffset={isMobile ? 4 : 8}
      >
        <DropdownMenuItem render={<NavLink to="/settings/administrators" />}>
          <UserIcon />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem render={<NavLink to="/help" />}>
          <CircleHelpIcon />
          <span>Help</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            signOut();
            navigate("/login", { replace: true });
          }}
        >
          <LogOutIcon />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();

  // Sections nest inside the menu here rather than being groups of their own,
  // but they are still remembered open or closed the way the others are.
  const { isOpen, setOpen } = useNavSections({
    sections,
    storageKey: "push-design:icon-nav-sections",
    pathname,
  });

  return (
    <Sidebar collapsible="icon">
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

              {sections.map((section) => {
                const holdsPage = section.items.some(
                  (item) => item.url === pathname,
                );

                return (
                  <Collapsible
                    key={section.label}
                    open={isOpen(section.label)}
                    onOpenChange={(open) => setOpen(section.label, open)}
                    render={<SidebarMenuItem />}
                  >
                    <SidebarMenuButton
                      // Collapsed, the section icon is all there is to say
                      // which page you are on; expanded, the page's own row
                      // says it, and marking both would be twice too much.
                      isActive={holdsPage && state === "collapsed"}
                      tooltip={section.label}
                      render={<CollapsibleTrigger />}
                    >
                      <section.icon />
                      <span>{section.label}</span>
                      <ChevronRightIcon className="ml-auto transition-transform group-data-[panel-open]/menu-button:rotate-90" />
                    </SidebarMenuButton>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.items.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton
                              isActive={pathname === item.url}
                              render={<NavLink to={item.url} />}
                            >
                              <span>{item.title}</span>
                            </SidebarMenuSubButton>
                            {item.notify ? (
                              <SidebarMenuBadge className="top-2.5" />
                            ) : null}
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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

        {/* The checklist is a card, not a row, and has no icon to shrink to. */}
        <div className="group-data-[collapsible=icon]:hidden">
          <GetStarted />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

/**
 * Variation 2: shadcn's sidebar-07. One sidebar that collapses to a column of
 * icons, with each section a row that unfolds its pages underneath.
 */
export function AppIconSidebarLayout() {
  return (
    <RightPanelProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <AppHeader trigger={<SidebarTrigger className="-ml-1" />} />
          <div className="bg-muted flex flex-1 flex-col gap-4 p-5">
            <Outlet />
          </div>
        </SidebarInset>

        <RightPanel />
      </SidebarProvider>
    </RightPanelProvider>
  );
}
