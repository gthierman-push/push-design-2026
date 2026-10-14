import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

/**
 * The page's search box and open tab, with `?q=` able to set them.
 *
 * That is how the command palette hands a person off: there is no profile page
 * to open yet, so picking someone lands here with their name already typed. The
 * All tab comes up with it, since the palette matches people whatever their
 * status and Active would read as "no match" for someone still onboarding.
 *
 * The param is dropped once it has been read, so the query belongs to the user
 * from then on -- clearing the box must not bring the name back.
 */
export function useRosterQuery(defaultTab: string) {
  const [params, setParams] = useSearchParams();
  const queryParam = params.get("q");

  const [query, setQuery] = useState(queryParam ?? "");
  const [tab, setTab] = useState(queryParam ? "all" : defaultTab);

  useEffect(() => {
    if (!queryParam) return;

    setQuery(queryParam);
    setTab("all");
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("q");
        return next;
      },
      { replace: true },
    );
  }, [queryParam, setParams]);

  return { query, setQuery, tab, setTab };
}
