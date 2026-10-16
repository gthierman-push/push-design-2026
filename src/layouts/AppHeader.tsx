import { Fragment, type ReactNode } from "react";
import { NavLink, useLocation, useMatches } from "react-router";
import { SettingsIcon, ZapIcon } from "@components/icons";

import { useActiveAccount } from "@components/active-account";
import { askAiPanel } from "@components/ask-ai-panel";
import { RightPanelTrigger } from "@components/right-panel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

import { pageFor } from "./app-nav";
import { crumbsFor, marksFor } from "./crumbs";

/**
 * The bar above the page, shared by every nav variation — only the control
 * that opens and closes the nav differs, so each layout passes its own.
 */
export function AppHeader({ trigger }: { trigger: ReactNode }) {
  const { pathname } = useLocation();
  const { account } = useActiveAccount();
  const current = pageFor(pathname);

  /* What the page under the nav page is showing -- the person on a profile,
     say. Empty on the nav pages themselves, which are the whole trail, and
     empty too where the record turned out not to be there to name. */
  const matches = useMatches();
  const trail = crumbsFor(matches, account);
  /* What the record is, beside what it is called -- a profile's status and
     clock ID ride up here rather than repeating under its name. */
  const marks = marksFor(matches, account);
  const title = current?.title ?? "Dashboard";
  const below = current ? pathname !== current.url : false;

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4">
      {trigger}
      <Separator orientation="vertical" className="mr-2 h-4 self-center!" />
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem>
            {/* The page only becomes a link once you are somewhere below
                it: a link to the page you are already on goes nowhere. It
                goes by the url rather than by the trail, so a profile that
                names nobody is still a way back rather than a dead end. */}
            {below && current ? (
              <BreadcrumbLink render={<NavLink to={current.url} />}>
                {title}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{title}</BreadcrumbPage>
            )}
          </BreadcrumbItem>

          {trail.map((name, index) => (
            <Fragment key={`${index}-${name}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="min-w-0">
                {/* Only the last crumb is the page you are on. The ones
                    above it are records rather than destinations, so they
                    read as plain text. */}
                {index === trail.length - 1 ? (
                  <BreadcrumbPage className="truncate">{name}</BreadcrumbPage>
                ) : (
                  <span className="truncate">{name}</span>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* The trail is what gives way when the bar runs out of room, so the
          badges hold their width beside it. Too narrow for both and they
          stand down -- the profile still says all of it in the record. */}
      {marks.length > 0 && (
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {marks.map((mark, index) => (
            <Fragment key={index}>{mark}</Fragment>
          ))}
        </div>
      )}

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
