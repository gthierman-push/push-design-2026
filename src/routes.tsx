import { createBrowserRouter } from "react-router";

import { AppLayout } from "@layouts/AppLayout";
import { AuthLayout } from "@layouts/AuthLayout";
import { DesignLayout } from "@layouts/DesignLayout";
import { SettingsLayout } from "@layouts/SettingsLayout";
import { RequireAuth } from "./auth";

import { Login } from "@features/login";
import { BusinessIntelligence } from "@features/business-intelligence";
import { Candidates } from "@features/candidates";
import { Chat } from "@features/chat";
import { Clocks } from "@features/clocks";
import { Dashboard } from "@features/dashboard";
import { Employees } from "@features/employees";
import { Help } from "@features/help";
import { Interviews } from "@features/interviews";
import { Jobs } from "@features/jobs";
import { Logbook } from "@features/logbook";
import { MessageBoard } from "@features/message-board";
import { Milestones } from "@features/milestones";
import { Payroll } from "@features/payroll";
import { Performance } from "@features/performance";
import { Reports } from "@features/reports";
import { Sales } from "@features/sales";
import { Scheduler } from "@features/scheduler";
import { Shifts } from "@features/shifts";
import { Surveys } from "@features/surveys";
import { Tasks } from "@features/tasks";
import { TimeOff } from "@features/time-off";
import { Timesheets } from "@features/timesheets";

import { Administrators } from "@features/settings/administrators";
import { Alarms } from "@features/settings/alarms";
import { Benefits } from "@features/settings/benefits";
import { Breaks } from "@features/settings/breaks";
import { BulkSalaryUpdates } from "@features/settings/bulk-salary-updates";
import { ClockSettings } from "@features/settings/clock-settings";
import { ClockSurveys } from "@features/settings/clock-surveys";
import { CompanyFiles } from "@features/settings/company-files";
import { CompanySetup } from "@features/settings/company-setup";
import { Departments } from "@features/settings/departments";
import { EmployeeAttributes } from "@features/settings/employee-attributes";
import { EmployeeSettings } from "@features/settings/employee-settings";
import { FileCategories } from "@features/settings/file-categories";
import { Forms } from "@features/settings/forms";
import { FraudReviews } from "@features/settings/fraud-reviews";
import { HoursStructures } from "@features/settings/hours-structures";
import { Integrations } from "@features/settings/integrations";
import { JournalEntries } from "@features/settings/journal-entries";
import { LaborGuide } from "@features/settings/labor-guide";
import { Onboarding } from "@features/settings/onboarding";
import { PayStubs } from "@features/settings/pay-stubs";
import { PeriodLabels } from "@features/settings/period-labels";
import { Positions } from "@features/settings/positions";
import { ProfitCenters } from "@features/settings/profit-centers";
import { Roles } from "@features/settings/roles";
import { Security } from "@features/settings/security";
import { StatutoryHolidays } from "@features/settings/statutory-holidays";
import { TaxSetup } from "@features/settings/tax-setup";
import { TimeOff as TimeOffSettings } from "@features/settings/time-off";
import { Tips } from "@features/settings/tips";

import { Badge } from "@features/design/badge";
import { Button } from "@features/design/button";
import { Card } from "@features/design/card";
import { Colors } from "@features/design/colors";
import { DataDisplay } from "@features/design/data-display";
import { EmptyStates } from "@features/design/empty-states";
import { Fields } from "@features/design/fields";
import { Icons } from "@features/design/icons";
import { Navigation } from "@features/design/navigation";
import { Overlays } from "@features/design/overlays";
import { Radius } from "@features/design/radius";
import { Spacing } from "@features/design/spacing";
import { Table } from "@features/design/table";
import { Tabs } from "@features/design/tabs";
import { Typography } from "@features/design/typography";

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
          { index: true, element: <Dashboard /> },
          { path: "scheduler", element: <Scheduler /> },
          { path: "clocks", element: <Clocks /> },
          { path: "shifts", element: <Shifts /> },
          { path: "employees", element: <Employees /> },
          { path: "milestones", element: <Milestones /> },
          { path: "performance", element: <Performance /> },
          { path: "surveys", element: <Surveys /> },
          { path: "time-off", element: <TimeOff /> },
          { path: "tasks", element: <Tasks /> },
          { path: "jobs", element: <Jobs /> },
          { path: "candidates", element: <Candidates /> },
          { path: "interviews", element: <Interviews /> },
          { path: "chat", element: <Chat /> },
          { path: "message-board", element: <MessageBoard /> },
          { path: "payroll", element: <Payroll /> },
          { path: "timesheets", element: <Timesheets /> },
          { path: "sales", element: <Sales /> },
          { path: "reports", element: <Reports /> },
          { path: "logbook", element: <Logbook /> },
          { path: "business-intelligence", element: <BusinessIntelligence /> },
          { path: "help", element: <Help /> },
        ],
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <CompanySetup /> },
          { path: "departments", element: <Departments /> },
          { path: "positions", element: <Positions /> },
          { path: "profit-centers", element: <ProfitCenters /> },
          { path: "period-labels", element: <PeriodLabels /> },
          { path: "alarms", element: <Alarms /> },
          { path: "administrators", element: <Administrators /> },
          { path: "roles", element: <Roles /> },
          { path: "security", element: <Security /> },
          { path: "fraud-reviews", element: <FraudReviews /> },
          { path: "tax-setup", element: <TaxSetup /> },
          { path: "statutory-holidays", element: <StatutoryHolidays /> },
          { path: "hours-structures", element: <HoursStructures /> },
          { path: "pay-stubs", element: <PayStubs /> },
          { path: "journal-entries", element: <JournalEntries /> },
          { path: "bulk-salary-updates", element: <BulkSalaryUpdates /> },
          { path: "benefits", element: <Benefits /> },
          { path: "clock-settings", element: <ClockSettings /> },
          { path: "clock-surveys", element: <ClockSurveys /> },
          { path: "breaks", element: <Breaks /> },
          { path: "tips", element: <Tips /> },
          { path: "time-off", element: <TimeOffSettings /> },
          { path: "labor-guide", element: <LaborGuide /> },
          { path: "employee-settings", element: <EmployeeSettings /> },
          { path: "employee-attributes", element: <EmployeeAttributes /> },
          { path: "onboarding", element: <Onboarding /> },
          { path: "forms", element: <Forms /> },
          { path: "file-categories", element: <FileCategories /> },
          { path: "company-files", element: <CompanyFiles /> },
          { path: "integrations", element: <Integrations /> },
        ],
      },
      {
        path: "design",
        element: <DesignLayout />,
        children: [
          { index: true, element: <Colors /> },
          { path: "typography", element: <Typography /> },
          { path: "spacing", element: <Spacing /> },
          { path: "radius", element: <Radius /> },
          { path: "icons", element: <Icons /> },
          { path: "button", element: <Button /> },
          { path: "badge", element: <Badge /> },
          { path: "card", element: <Card /> },
          { path: "fields", element: <Fields /> },
          { path: "table", element: <Table /> },
          { path: "tabs", element: <Tabs /> },
          { path: "overlays", element: <Overlays /> },
          { path: "empty-states", element: <EmptyStates /> },
          { path: "data-display", element: <DataDisplay /> },
          { path: "navigation", element: <Navigation /> },
        ],
      },
    ],
  },
]);
