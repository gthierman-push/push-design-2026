import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

/** How long a jumped-to field keeps its highlight ring. */
const highlightMs = 1800;

/**
 * Opens the tab and field named in the url, then hands the tab back as state.
 *
 * Sidebar search links to `?tab=<tab>&field=<control id>`. The tab has to be
 * open before the control exists, so the scroll waits a frame after the tab
 * settles. Both params are dropped once they have been acted on, so the jump
 * does not repeat when the page re-renders or the user moves to another tab.
 */
export function useSettingsTarget(defaultTab: string) {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab");
  const fieldParam = params.get("field");
  const [tab, setTab] = useState(tabParam ?? defaultTab);

  useEffect(() => {
    if (tabParam && tabParam !== tab) setTab(tabParam);
    // Only the url drives this; a manual tab change must not be overridden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  useEffect(() => {
    if (!tabParam && !fieldParam) return;

    const frame = requestAnimationFrame(() => {
      const target = fieldParam ? document.getElementById(fieldParam) : null;
      const row = target?.closest<HTMLElement>("[data-slot=field]") ?? target;

      row?.scrollIntoView({ block: "center", behavior: "smooth" });
      if (row) {
        row.dataset.fieldTarget = "";
        window.setTimeout(() => delete row.dataset.fieldTarget, highlightMs);
      }
      if (target instanceof HTMLElement && target !== row) {
        target.focus({ preventScroll: true });
      }

      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.delete("tab");
          next.delete("field");
          return next;
        },
        { replace: true },
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [tabParam, fieldParam, setParams]);

  return [tab, setTab] as const;
}
