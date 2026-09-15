import { createBrowserRouter } from "react-router";

import { AppLayout } from "@layouts/AppLayout";
import { AuthLayout } from "@layouts/AuthLayout";
import { DesignLayout } from "@layouts/DesignLayout";
import { SettingsLayout } from "@layouts/SettingsLayout";
import { Login } from "./pages/Login";
import { Placeholder } from "./pages/Placeholder";
import { RequireAuth } from "./auth";

export const router = createBrowserRouter([
  {
    path: "login",
    element: <AuthLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    element: <RequireAuth />,
    children: [
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
          { index: true, element: <Placeholder title="Company Setup" /> },
          { path: "departments", element: <Placeholder title="Departments" /> },
          { path: "positions", element: <Placeholder title="Positions" /> },
          {
            path: "profit-centers",
            element: <Placeholder title="Profit Centers" />,
          },
          {
            path: "period-labels",
            element: <Placeholder title="Period Labels" />,
          },
          { path: "alarms", element: <Placeholder title="Alarms" /> },
          {
            path: "administrators",
            element: <Placeholder title="Administrators" />,
          },
          { path: "roles", element: <Placeholder title="Roles" /> },
          {
            path: "security",
            element: <Placeholder title="Security Settings" />,
          },
          {
            path: "fraud-reviews",
            element: <Placeholder title="Fraud Reviews" />,
          },
          { path: "tax-setup", element: <Placeholder title="Tax Setup" /> },
          {
            path: "statutory-holidays",
            element: <Placeholder title="Statutory Holidays" />,
          },
          {
            path: "hours-structures",
            element: <Placeholder title="Hours Structures" />,
          },
          {
            path: "pay-stubs",
            element: <Placeholder title="Pay Stub Settings" />,
          },
          {
            path: "journal-entries",
            element: <Placeholder title="Journal Entry Settings" />,
          },
          {
            path: "bulk-salary-updates",
            element: <Placeholder title="Bulk Salary Updates" />,
          },
          { path: "benefits", element: <Placeholder title="Benefits Setup" /> },
          {
            path: "clock-settings",
            element: <Placeholder title="Clock Settings" />,
          },
          {
            path: "clock-surveys",
            element: <Placeholder title="Clock Surveys" />,
          },
          { path: "breaks", element: <Placeholder title="Breaks" /> },
          { path: "tips", element: <Placeholder title="Tips Settings" /> },
          { path: "time-off", element: <Placeholder title="Time Off" /> },
          { path: "labor-guide", element: <Placeholder title="Labor Guide" /> },
          {
            path: "employee-settings",
            element: <Placeholder title="Employee Settings" />,
          },
          {
            path: "employee-attributes",
            element: <Placeholder title="Employee Attributes" />,
          },
          {
            path: "onboarding",
            element: <Placeholder title="Onboarding Settings" />,
          },
          { path: "forms", element: <Placeholder title="Forms" /> },
          {
            path: "file-categories",
            element: <Placeholder title="File Categories" />,
          },
          {
            path: "company-files",
            element: <Placeholder title="Company Files" />,
          },
          {
            path: "integrations",
            element: <Placeholder title="POS / Integrations" />,
          },
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
          {
            path: "empty-states",
            element: <Placeholder title="Empty states" />,
          },
          {
            path: "data-display",
            element: <Placeholder title="Data display" />,
          },
          { path: "navigation", element: <Placeholder title="Navigation" /> },
        ],
      },
    ],
  },
]);
