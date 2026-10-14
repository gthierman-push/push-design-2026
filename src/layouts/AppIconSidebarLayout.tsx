import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
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

/**
 * How many sections can stand open at once, and with it how the sidebar
 * collapses: many sections at a time down to a column of icons, or one
 * section at a time and away altogether. Both variations show the same nav.
 */
type SectionMode = "many" | "one";

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
    activeSection,
    isOpen: (label: string) => open === label,
    setOpen: (label: string, next: boolean) => setOpen(next ? label : null),
  };
}

function AppSidebar({ mode }: { mode: SectionMode }) {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const navigate = useNavigate();

  // Both are hooks, so both run whichever one is in charge; only the one
  // the variation asks for is read.
  const remembered = useNavSections({
    sections,
    storageKey: "push-design:icon-nav-sections",
    pathname,
  });
  const solo = useOneOpenSection(pathname);
  const { isOpen, setOpen, activeSection } = mode === "one" ? solo : remembered;

  // One section at a time goes the whole way out, as the default nav does;
  // many sections at a time shrink to icons.
  const collapsible = mode === "one" ? "offcanvas" : "icon";

  return (
    <Sidebar collapsible={collapsible}>
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

              {sections.map((section) => (
                <Collapsible
                  key={section.label}
                  open={isOpen(section.label)}
                  onOpenChange={(open) => {
                    setOpen(section.label, open);
                    // With one section open at a time the section row is a
                    // destination as well as a lid: opening it lands you on
                    // the first page inside, so a single click gets you
                    // somewhere rather than only showing you where you could
                    // go. Closing one leaves you where you are.
                    if (mode === "one" && open) navigate(section.items[0].url);
                  }}
                  render={<SidebarMenuItem />}
                >
                  <SidebarMenuButton
                    // Shrunk to icons, the section icon is all there is to say
                    // which page you are on; expanded, the page's own row says
                    // it, and marking both would be twice too much. A sidebar
                    // that collapses away has nothing left to mark.
                    isActive={
                      collapsible === "icon" &&
                      section.label === activeSection &&
                      state === "collapsed"
                    }
                    tooltip={section.label}
                    render={<CollapsibleTrigger />}
                  >
                    <section.icon />
                    <span>{section.label}</span>
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
              ))}
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
 * Variations 2 and 3: shadcn's sidebar-07. One sidebar with each section a
 * row that unfolds its pages underneath — either as many at a time as you
 * like, collapsing to a column of icons, or one at a time, collapsing away
 * entirely.
 */
export function AppIconSidebarLayout({
  mode = "many",
}: {
  mode?: SectionMode;
}) {
  return (
    <RightPanelProvider>
      <SidebarProvider>
        <AppSidebar mode={mode} />

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
