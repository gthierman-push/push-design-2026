/**
 * Every page the design system publishes, grouped the way the sidebar shows
 * them. It lives apart from the sidebar so the layout can read it for the
 * breadcrumb without importing a component.
 */
export const designSections = [
  {
    label: "Foundations",
    items: [
      { title: "Colors", url: "/design" },
      { title: "Typography", url: "/design/typography" },
      { title: "Spacing", url: "/design/spacing" },
      { title: "Radius & shadow", url: "/design/radius" },
      { title: "Icons", url: "/design/icons" },
    ],
  },
  {
    label: "Components",
    items: [
      { title: "Button", url: "/design/button" },
      { title: "Badge", url: "/design/badge" },
      { title: "Card", url: "/design/card" },
      { title: "Form fields", url: "/design/fields" },
      { title: "Table", url: "/design/table" },
      { title: "TabDefault", url: "/design/tab-default" },
      { title: "TabHorizontal", url: "/design/tab-horizontal" },
      { title: "TabVertical", url: "/design/tab-vertical" },
      { title: "Overlays", url: "/design/overlays" },
    ],
  },
  {
    label: "Patterns",
    items: [
      { title: "Empty states", url: "/design/empty-states" },
      { title: "Data display", url: "/design/data-display" },
      { title: "Navigation", url: "/design/navigation" },
    ],
  },
  {
    label: "Examples",
    items: [
      { title: "Horizontal tabs", url: "/design/examples/horizontal-tabs" },
      { title: "Vertical tabs", url: "/design/examples/vertical-tabs" },
    ],
  },
];
