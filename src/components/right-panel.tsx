import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { XIcon } from "lucide-react";

import { cn } from "cn";
import { useIsMobile } from "@components/hooks/use-mobile";
import { Button } from "@components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";

const RIGHT_PANEL_WIDTH = "22rem";

/** Anything the panel can be asked to show. */
export type RightPanelContent = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

type RightPanelContextValue = {
  open: boolean;
  content: RightPanelContent | null;
  /** Open the panel with arbitrary content. Call from any element. */
  openPanel: (content: RightPanelContent) => void;
  closePanel: () => void;
  /** Open with `content`, or close if that same panel is already showing. */
  togglePanel: (content: RightPanelContent) => void;
};

const RightPanelContext = React.createContext<RightPanelContextValue | null>(
  null,
);

export function useRightPanel() {
  const context = React.useContext(RightPanelContext);
  if (!context) {
    throw new Error("useRightPanel must be used within a RightPanelProvider.");
  }
  return context;
}

export function RightPanelProvider({ children }: React.PropsWithChildren) {
  const [content, setContent] = React.useState<RightPanelContent | null>(null);

  const openPanel = React.useCallback((next: RightPanelContent) => {
    setContent(next);
  }, []);

  const closePanel = React.useCallback(() => {
    setContent(null);
  }, []);

  const togglePanel = React.useCallback((next: RightPanelContent) => {
    setContent((current) => (current?.title === next.title ? null : next));
  }, []);

  const value = React.useMemo<RightPanelContextValue>(
    () => ({
      open: content !== null,
      content,
      openPanel,
      closePanel,
      togglePanel,
    }),
    [content, openPanel, closePanel, togglePanel],
  );

  return (
    <RightPanelContext.Provider value={value}>
      {children}
    </RightPanelContext.Provider>
  );
}

/**
 * Turns any element into a panel trigger. Pass `render` to use your own
 * element, exactly like the Base UI components elsewhere in this project:
 *
 *   <RightPanelTrigger panel={...} render={<Button variant="outline" />}>
 *     Ask A.I.
 *   </RightPanelTrigger>
 *
 * Any element can also open the panel directly via `useRightPanel()`.
 */
export function RightPanelTrigger({
  panel,
  render,
  onClick,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & { panel: RightPanelContent }) {
  const { togglePanel, content } = useRightPanel();

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            togglePanel(panel);
          }
        },
      },
      props,
    ),
    render,
    state: {
      slot: "right-panel-trigger",
      active: content?.title === panel.title,
    },
  });
}

/**
 * The panel surface. Render it as the last child of the layout's flex row so
 * its spacer can push the main content aside on desktop. On mobile it becomes
 * a Sheet instead.
 */
export function RightPanel({ className }: { className?: string }) {
  const { open, content, closePanel } = useRightPanel();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(next) => !next && closePanel()}>
        <SheetContent side="right" className="gap-0 p-0">
          <SheetHeader className="border-b">
            <SheetTitle>{content?.title ?? "Panel"}</SheetTitle>
            {content?.description ? (
              <SheetDescription>{content.description}</SheetDescription>
            ) : null}
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {content?.children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group/right-panel peer/right-panel hidden shrink-0 md:block"
      data-slot="right-panel"
      data-state={open ? "expanded" : "collapsed"}
      style={{ "--right-panel-width": RIGHT_PANEL_WIDTH } as React.CSSProperties}
    >
      {/* Keeps the main content from sliding under the fixed panel. */}
      <div
        data-slot="right-panel-gap"
        className="relative w-(--right-panel-width) bg-transparent transition-[width] duration-[140ms] ease-out group-data-[state=collapsed]/right-panel:w-0"
      />
      <div
        data-slot="right-panel-container"
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-y-0 right-0 z-10 flex h-svh w-(--right-panel-width) flex-col border-l transition-[right] duration-[140ms] ease-out",
          "group-data-[state=collapsed]/right-panel:right-[calc(var(--right-panel-width)*-1)]",
          className,
        )}
      >
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">
              {content?.title}
            </span>
            {content?.description ? (
              <span className="text-muted-foreground truncate text-xs">
                {content.description}
              </span>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={closePanel}
            aria-label="Close panel"
          >
            <XIcon />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {content?.children}
        </div>
      </div>
    </div>
  );
}
