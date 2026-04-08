import { StockPotential } from "@/components/potential/stock-potential"
import { useGrants } from "@/hooks/use-grants"
import { useValuations } from "@/hooks/use-valuations"
import { computeCumulativeDilution, getLatestValuation } from "@/lib/valuation"

export function PotentialPage() {
  const { grants } = useGrants()
  const { valuations } = useValuations()
  const latestValuation = getLatestValuation(valuations)
  const calculatedDilution = computeCumulativeDilution(valuations)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Stock Potential</h1>
        <p className="text-sm text-muted-foreground">
          Simulate how your stock options could grow with different company
          valuations.
        </p>
      </div>
      <StockPotential
        grants={grants}
        currentValuation={latestValuation?.valuation}
        calculatedDilution={calculatedDilution}
        valuations={valuations}
      />
    </div>
  )
}
