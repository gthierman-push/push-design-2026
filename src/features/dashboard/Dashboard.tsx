import { HoursWorkedChart } from "./HoursWorkedChart";
import { LabourCostChart } from "./LabourCostChart";
import { OpenShiftsChart } from "./OpenShiftsChart";
import { OvertimeChart } from "./OvertimeChart";

export function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <HoursWorkedChart />
      <div className="grid gap-4 lg:grid-cols-3">
        <LabourCostChart />
        <OvertimeChart />
        <OpenShiftsChart />
      </div>
    </div>
  );
}
