import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useVesting } from "@/hooks/use-vesting"
import type { Grant } from "@/types/grant"
import { ChartColumnBig, Plus } from "lucide-react"
import { Link } from "react-router"
import { CumulativeChart } from "./cumulative-chart"
import { GrantVestingChart } from "./grant-vesting-chart"
import { VestingSummary } from "./vesting-summary"
import { YearlySummary } from "./yearly-summary"

interface VestingDashboardProps {
  grants: Grant[]
}

export function VestingDashboard({ grants }: VestingDashboardProps) {
  const { grantTimelines, cumulativeTimeline, yearlySummary } =
    useVesting(grants)

  if (grants.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ChartColumnBig className="size-12 text-muted-foreground/50" />
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold">
            Track your VSOP vesting schedule
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add your stock option grants to visualize vesting progress, see
            projected value, and track milestones over time.
          </p>
          <p className="text-xs text-muted-foreground/70">
            All data stays in your browser — nothing is sent to a server.
          </p>
        </div>
        <Button className="mt-2" render={<Link to="/grants/new" />}>
          <Plus />
          Add your first grant
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <VestingSummary grants={grants} />
      <CumulativeChart data={cumulativeTimeline} />
      <YearlySummary data={yearlySummary} />
      <div>
        <h3 className="mb-3 text-sm font-medium">All Grants</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {grants.map((grant, i) => (
            <GrantVestingChart
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
