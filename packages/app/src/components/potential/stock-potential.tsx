import { useState } from "react"
import { Link } from "react-router"
import { ChevronDownIcon, Plus, TrendingUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePotential } from "@/hooks/use-potential"
import { formatCurrency } from "@/lib/format"
import type { Grant } from "@/types/grant"
import type { ValuationEntry } from "@/types/valuation"
import { PotentialChart } from "./potential-chart"

interface StockPotentialProps {
  grants: Grant[]
  currentValuation?: number
  calculatedDilution?: number
  valuations?: ValuationEntry[]
}

export function StockPotential({ grants, currentValuation, calculatedDilution, valuations }: StockPotentialProps) {
  const {
    multiplier,
    setMultiplier,
    dilutionPercent,
    setDilutionPercent,
    simulationMode,
    setSimulationMode,
    futureValuation,
    setFutureValuation,
    effectiveMultiplier,
    summary,
    curve,
  } = usePotential(grants, currentValuation, calculatedDilution, valuations)

  const [infoOpen, setInfoOpen] = useState(false)

  if (grants.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <TrendingUpIcon className="size-12 text-muted-foreground/50" />
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold">
            Explore your stock potential
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add your stock option grants first, then come back here to simulate
            how their value could change as the company grows.
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
      {/* Educational card */}
      <Card className="p-4">
        <button
          onClick={() => setInfoOpen(!infoOpen)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-sm font-medium">
            How company valuation and dilution affect your stock options
          </span>
          <ChevronDownIcon
            className={`size-4 text-muted-foreground transition-transform ${infoOpen ? "rotate-180" : ""}`}
          />
        </button>
        {infoOpen && (
          <div className="mt-3 space-y-2 border-t pt-3 text-sm text-muted-foreground">
            <p>
              Your stock options give you the right to buy shares at a fixed{" "}
              <strong className="text-foreground">strike price</strong>. If the
              company's valuation increases, each share becomes worth more — but
              your strike price stays the same. The difference is your profit.
            </p>
            <p>
              <strong className="text-foreground">Dilution</strong> happens when
              a company issues new shares, typically during a funding round. This
              means your shares represent a smaller percentage of the company.
              Even though the company may be worth more overall, your slice of
              the pie gets smaller.
            </p>
            <p>
              For example, if you own 1% and the company raises a round that
              creates 20% new shares, your ownership drops to about 0.83%. Use
              the dilution slider below to see how this affects your potential
              value.
            </p>
          </div>
        )}
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col gap-6">
          <Tabs
            value={simulationMode}
            onValueChange={(v) => setSimulationMode(v as "multiplier" | "valuation")}
          >
            <TabsList>
              <TabsTrigger value="multiplier">Multiplier</TabsTrigger>
              <TabsTrigger value="valuation" disabled={!currentValuation}>
                Absolute Valuation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="multiplier" className="mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label>Valuation Multiple</Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={0.5}
                      max={20}
                      step={0.1}
                      value={multiplier}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value)
                        if (!isNaN(v) && v >= 0.5 && v <= 20) setMultiplier(v)
                      }}
                      className="h-7 w-16 text-center text-sm"
                    />
                    <span className="text-sm text-muted-foreground">x</span>
                  </div>
                </div>
                <Slider
                  value={[multiplier]}
                  onValueChange={(v) => setMultiplier(Array.isArray(v) ? v[0] : v)}
                  min={0.5}
                  max={20}
                  step={0.1}
                  aria-label="Valuation multiplier"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.5x</span>
                  <span>10x</span>
                  <span>20x</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="valuation" className="mt-4">
              {currentValuation ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current valuation</span>
                    <span className="font-mono font-medium">
                      {formatCurrency(currentValuation)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Future valuation (EUR)</Label>
                    <Input
                      type="number"
                      min={0}
                      step="1000"
                      value={futureValuation}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value)
                        if (!isNaN(v) && v >= 0) setFutureValuation(v)
                      }}
                      placeholder="e.g. 50000000"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Implied multiplier</span>
                    <span className="font-mono font-medium">
                      {effectiveMultiplier.toFixed(2)}x
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add a company valuation in the{" "}
                  <Link to="/valuations" className="underline underline-offset-4">
                    Valuations
                  </Link>{" "}
                  section to enable absolute valuation simulation.
                </p>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Dilution</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={0}
                  max={75}
                  step={1}
                  value={dilutionPercent}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    if (!isNaN(v) && v >= 0 && v <= 75) setDilutionPercent(v)
                  }}
                  className="h-7 w-16 text-center text-sm"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[dilutionPercent]}
              onValueChange={(v) => setDilutionPercent(Array.isArray(v) ? v[0] : v)}
              min={0}
              max={75}
              step={1}
              aria-label="Dilution percentage"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
            </div>
            {calculatedDilution != null && calculatedDilution > 0 && (
              <p className="text-xs text-muted-foreground">
                Calculated from funding rounds: {calculatedDilution.toFixed(2)}%.{" "}
                <button
                  type="button"
                  className="underline underline-offset-4 hover:text-foreground"
                  onClick={() => setDilutionPercent(Math.round(calculatedDilution))}
                >
                  Reset to calculated
                </button>
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Current Net Value</p>
          <p className="mt-1 font-mono text-lg font-semibold">
            {formatCurrency(summary.currentNetValue)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Simulated Net Value</p>
          <p className="mt-1 font-mono text-lg font-semibold">
            {formatCurrency(summary.simulatedNetValue)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Net Gain</p>
          <p
            className={`mt-1 font-mono text-lg font-semibold ${
              summary.netGain >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {summary.netGain >= 0 ? "+" : ""}
            {formatCurrency(summary.netGain)}
          </p>
        </Card>
        {dilutionPercent > 0 && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Dilution Impact</p>
            <p className="mt-1 font-mono text-lg font-semibold text-amber-600 dark:text-amber-400">
              -{formatCurrency(summary.dilutionImpact)}
            </p>
          </Card>
        )}
      </div>

      {/* Chart */}
      <PotentialChart
        data={curve}
        multiplier={effectiveMultiplier}
        dilutionPercent={dilutionPercent}
      />
    </div>
  )
}
