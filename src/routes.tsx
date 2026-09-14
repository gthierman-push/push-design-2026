import { createBrowserRouter } from "react-router";

import { AppLayout } from "@layouts/AppLayout";
import { DesignLayout } from "@layouts/DesignLayout";
import { SettingsLayout } from "@layouts/SettingsLayout";
import { Placeholder } from "./pages/Placeholder";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Placeholder title="Dashboard" /> },
      { path: "schedule", element: <Placeholder title="Schedule" /> },
      { path: "people", element: <Placeholder title="People" /> },
      { path: "reports", element: <Placeholder title="Reports" /> },
    ],
  },
  {
    path: "settings",
    element: <SettingsLayout />,
    children: [
      { index: true, element: <Placeholder title="Profile" /> },
      { path: "appearance", element: <Placeholder title="Appearance" /> },
      { path: "notifications", element: <Placeholder title="Notifications" /> },
      { path: "members", element: <Placeholder title="Members" /> },
      { path: "billing", element: <Placeholder title="Billing" /> },
      { path: "api-keys", element: <Placeholder title="API keys" /> },
    ],
  },
  {
    path: "design",
    element: <DesignLayout />,
    children: [
      { index: true, element: <Placeholder title="Colors" /> },
      { path: "typography", element: <Placeholder title="Typography" /> },
      { path: "spacing", element: <Placeholder title="Spacing" /> },
      { path: "radius", element: <Placeholder title="Radius & shadow" /> },
      { path: "icons", element: <Placeholder title="Icons" /> },
      { path: "button", element: <Placeholder title="Button" /> },
      { path: "badge", element: <Placeholder title="Badge" /> },
      { path: "card", element: <Placeholder title="Card" /> },
      { path: "fields", element: <Placeholder title="Form fields" /> },
      { path: "table", element: <Placeholder title="Table" /> },
      { path: "overlays", element: <Placeholder title="Overlays" /> },
      { path: "empty-states", element: <Placeholder title="Empty states" /> },
      { path: "data-display", element: <Placeholder title="Data display" /> },
      { path: "navigation", element: <Placeholder title="Navigation" /> },
    ],
  },
]);
