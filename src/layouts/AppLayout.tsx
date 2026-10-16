import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  ChevronsUpDownIcon,
  CircleHelpIcon,
  LogOutIcon,
  UserIcon,
} from "@components/icons";

import { AccountSwitcher } from "@components/account-switcher";
import { currentUser } from "@components/accounts";
import { CommandPalette } from "@components/command-palette";
import { GetStarted } from "@components/get-started";
import { RightPanel, RightPanelProvider } from "@components/right-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
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
  SidebarTrigger,
  useSidebar,
} from "@components/ui/sidebar";

import { useAuth } from "../auth";
import { AppHeader } from "./AppHeader";
import { footerNavigation, isSection, nav, pageFor, sections } from "./app-nav";

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
          <AvatarImage src={currentUser.photo} alt="" />
          <AvatarFallback>{currentUser.initials}</AvatarFallback>
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

/**
 * One open section at a time: opening the next closes the last. Nothing is
 * stored, because there is little to remember — the section holding the page
 * you are on is the one that opens, however you arrived at it.
 */
function useOneOpenSection(pathname: string) {
  const activeSection = sections.find((section) =>
    section.items.some((item) => item.url === pathname),
  )?.label;

  const [open, setOpen] = useState(activeSection ?? null);

  useEffect(() => {
    if (activeSection) setOpen(activeSection);
  }, [activeSection]);

  return {
    isOpen: (label: string) => open === label,
    setOpen: (label: string, next: boolean) => setOpen(next ? label : null),
  };
}

function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  /* A page one level down -- an employee's profile -- still marks the page it
     came from, rather than leaving the nav pointing at nothing. */
  const current = pageFor(pathname)?.url ?? pathname;
  const { isOpen, setOpen } = useOneOpenSection(current);

  return (
    <Sidebar collapsible="offcanvas">
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
              {nav.map((entry) =>
                !isSection(entry) ? (
                  <SidebarMenuItem key={entry.url}>
                    <SidebarMenuButton
                      isActive={current === entry.url}
                      tooltip={entry.title}
                      render={<NavLink to={entry.url} />}
                    >
                      <entry.icon />
                      <span>{entry.title}</span>
                    </SidebarMenuButton>
                    {entry.notify ? <SidebarMenuBadge /> : null}
                  </SidebarMenuItem>
                ) : (
                  <Collapsible
                    key={entry.label}
                    open={isOpen(entry.label)}
                    onOpenChange={(open) => {
                      setOpen(entry.label, open);
                      // The section row is a destination as well as a lid:
                      // opening it lands you on the first page inside, so a
                      // single click gets you somewhere rather than only
                      // showing you where you could go. Closing one leaves you
                      // where you are.
                      if (open) navigate(entry.items[0].url);
                    }}
                    render={<SidebarMenuItem />}
                  >
                    <SidebarMenuButton
                      // The page's own row says which page you are on, and
                      // marking the section as well would be twice too much.
                      tooltip={entry.label}
                      render={<CollapsibleTrigger />}
                    >
                      <entry.icon />
                      <span>{entry.label}</span>
                    </SidebarMenuButton>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {entry.items.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton
                              isActive={current === item.url}
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
                ),
              )}
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

        <GetStarted />

        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * The app shell: one sidebar, the day's pages up top and each section below a
 * row that unfolds its pages underneath, one section open at a time, and the
 * whole sidebar collapsing away when you want the page to itself.
 */
export function AppLayout() {
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
