import { StockPotential } from "@/components/potential/stock-potential"
import { useGrants } from "@/hooks/use-grants"

export function PotentialPage() {
  const { grants } = useGrants()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Stock Potential</h1>
        <p className="text-sm text-muted-foreground">
          Simulate how your stock options could grow with different company
          valuations.
        </p>
      </div>
      <StockPotential grants={grants} />
    </div>
  )
}
