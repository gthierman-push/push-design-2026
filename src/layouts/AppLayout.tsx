import { useNavVariant } from "@components/nav-variant";

import { AppRailLayout } from "./AppRailLayout";
import { AppSidebarLayout } from "./AppSidebarLayout";

/**
 * The app shell, in whichever nav variation the theme panel has selected.
 * Every variation renders the same pages — only the nav around them changes.
 */
export function AppLayout() {
  const { variant } = useNavVariant();

  switch (variant) {
    case "rail":
      return <AppRailLayout />;
    default:
      return <AppSidebarLayout />;
  }
}
