import { Placeholder } from "@components/placeholder";
import { UpgradeButton } from "@components/upgrade-dialog";

export function Performance() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <div className="flex items-center gap-2">
          <UpgradeButton feature="Performance reviews" />
        </div>
      </div>

      <Placeholder title="Performance reviews" />
    </div>
  );
}
