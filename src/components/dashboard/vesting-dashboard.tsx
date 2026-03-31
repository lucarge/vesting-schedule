import { useVesting } from "@/hooks/use-vesting"
import type { Grant } from "@/types/grant"
import { CumulativeChart } from "./cumulative-chart"
import { GrantBurndown } from "./grant-burndown"
import { YearlySummary } from "./yearly-summary"

interface VestingDashboardProps {
  grants: Grant[]
}

export function VestingDashboard({ grants }: VestingDashboardProps) {
  const { grantTimelines, cumulativeTimeline, yearlySummary } =
    useVesting(grants)

  if (grants.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Add grants in the Grants tab to see your vesting dashboard.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <YearlySummary data={yearlySummary} />
      <CumulativeChart data={cumulativeTimeline} />
      <div>
        <h3 className="mb-3 text-sm font-medium">Per-Grant Burndown</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {grants.map((grant, i) => (
            <GrantBurndown
              key={grant.id}
              grant={grant}
              timeline={grantTimelines[i]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
