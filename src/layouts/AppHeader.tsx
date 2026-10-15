import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { SettingsIcon, ZapIcon } from "lucide-react";

import { askAiPanel } from "@components/ask-ai-panel";
import { RightPanelTrigger } from "@components/right-panel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@components/ui/breadcrumb";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

import { pageFor } from "./app-nav";

/**
 * The bar above the page, shared by every nav variation — only the control
 * that opens and closes the nav differs, so each layout passes its own.
 */
export function AppHeader({ trigger }: { trigger: ReactNode }) {
  const { pathname } = useLocation();
  const current = pageFor(pathname);

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4">
      {trigger}
      <Separator orientation="vertical" className="mr-2 h-4 self-center!" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{current?.title ?? "Dashboard"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        {current?.settingsUrl ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${current.title} settings`}
            render={<NavLink to={current.settingsUrl} />}
          >
            <SettingsIcon />
          </Button>
        ) : null}
        <RightPanelTrigger
          panel={askAiPanel}
          render={<Button variant="ghost" size="sm" />}
        >
          <ZapIcon data-icon="inline-start" />
          Ask A.I.
        </RightPanelTrigger>
      </div>
    </header>
  );
}
