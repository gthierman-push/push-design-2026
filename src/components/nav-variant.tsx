import * as React from "react";

/**
 * The nav layouts the app can wear, picked from the theme panel so a
 * variation can be tried on without touching the code or losing the page
 * you are on. Add a variation here and in `AppLayout`.
 */
export const navVariants = [
  {
    id: "sidebar",
    name: "Default",
    summary: "One sidebar, sections as collapsible groups",
  },
  {
    id: "rail",
    name: "Variation 1 — Icon rail",
    summary: "Sections on an icon rail, their pages in the sidebar beside it",
  },
] as const;

export type NavVariant = (typeof navVariants)[number]["id"];

const STORAGE_KEY = "push-design:nav-variant";
const fallback: NavVariant = "sidebar";

function loadVariant(): NavVariant {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return navVariants.some((variant) => variant.id === stored)
      ? (stored as NavVariant)
      : fallback;
  } catch {
    return fallback;
  }
}

type NavVariantContextValue = {
  variant: NavVariant;
  setVariant: (variant: NavVariant) => void;
};

const NavVariantContext = React.createContext<NavVariantContextValue | null>(
  null,
);

export function useNavVariant() {
  const context = React.useContext(NavVariantContext);
  if (!context) {
    throw new Error("useNavVariant must be used within a NavVariantProvider.");
  }
  return context;
}

export function NavVariantProvider({ children }: React.PropsWithChildren) {
  const [variant, setVariant] = React.useState<NavVariant>(loadVariant);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, variant);
  }, [variant]);

  const value = React.useMemo(() => ({ variant, setVariant }), [variant]);

  return (
    <NavVariantContext.Provider value={value}>
      {children}
    </NavVariantContext.Provider>
  );
}
