import { VestingDashboard } from "@/components/dashboard/vesting-dashboard"
import { useGrants } from "@/hooks/use-grants"
import { useValuations } from "@/hooks/use-valuations"

export function DashboardPage() {
  const { grants } = useGrants()
  const { valuations } = useValuations()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Vesting progress and portfolio overview.
        </p>
      </div>
      <VestingDashboard grants={grants} valuations={valuations} />
    </div>
  )
}
