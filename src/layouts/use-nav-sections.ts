import { useCallback, useEffect, useState } from "react";

/** The shape both navs share: a labelled group of pages. */
type NavSectionLike = {
  label: string;
  items: { url: string }[];
};

type Options = {
  sections: NavSectionLike[];
  /** Where the open/closed record lives in `localStorage`. */
  storageKey: string;
  pathname: string;
};

/**
 * Reads the stored record back. Sections default to open, and a stored value
 * only counts for a label still in the nav — so renaming or adding a section
 * brings it back open rather than stranding it in whatever state its namesake
 * happened to be in.
 */
function loadOpenSections(sections: NavSectionLike[], storageKey: string) {
  const defaults = Object.fromEntries(
    sections.map((section) => [section.label, true]),
  );

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    for (const label of Object.keys(defaults)) {
      if (typeof parsed[label] === "boolean") defaults[label] = parsed[label];
    }
    return defaults;
  } catch {
    return defaults;
  }
}

/**
 * Tracks which sidebar sections are open, as the reader last left them —
 * across visits, not just across navigations. Shared by the app sidebar and
 * the settings sidebar, which collapse their sections the same way the design
 * system's own sidebar does.
 */
export function useNavSections({ sections, storageKey, pathname }: Options) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => loadOpenSections(sections, storageKey),
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(openSections));
  }, [openSections, storageKey]);

  const activeSection = sections.find((section) =>
    section.items.some((item) => item.url === pathname),
  )?.label;

  // Landing on a page from somewhere else — the command palette, a link, the
  // settings search — can put the active row inside a section the reader had
  // closed, so reopen it.
  useEffect(() => {
    if (!activeSection) return;
    setOpenSections((previous) =>
      previous[activeSection]
        ? previous
        : { ...previous, [activeSection]: true },
    );
  }, [activeSection]);

  const setOpen = useCallback(
    (label: string, open: boolean) =>
      setOpenSections((previous) => ({ ...previous, [label]: open })),
    [],
  );

  const isOpen = useCallback(
    (label: string) => openSections[label] ?? true,
    [openSections],
  );

  return { isOpen, setOpen, activeSection };
}
