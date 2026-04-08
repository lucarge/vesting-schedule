import {
  computePotentialAtMultiplier,
  computePotentialAtValuation,
  computePotentialCurve,
} from "@/lib/potential"
import type { Grant } from "@/types/grant"
import { useMemo, useState } from "react"

export type SimulationMode = "multiplier" | "valuation"

export function usePotential(grants: Grant[], currentValuation?: number, calculatedDilution?: number) {
  const [multiplier, setMultiplier] = useState(1.0)
  const [dilutionPercent, setDilutionPercent] = useState(
    calculatedDilution ? Math.round(calculatedDilution) : 0,
  )
  const [simulationMode, setSimulationMode] = useState<SimulationMode>("multiplier")
  const [futureValuation, setFutureValuation] = useState(
    currentValuation ? currentValuation * 2 : 0,
  )

  const effectiveMultiplier = useMemo(() => {
    if (simulationMode === "valuation" && currentValuation && currentValuation > 0) {
      return futureValuation / currentValuation
    }
    return multiplier
  }, [simulationMode, currentValuation, futureValuation, multiplier])

  const summary = useMemo(() => {
    if (simulationMode === "valuation" && currentValuation && currentValuation > 0) {
      return computePotentialAtValuation(grants, currentValuation, futureValuation, dilutionPercent)
    }
    return computePotentialAtMultiplier(grants, multiplier, dilutionPercent)
  }, [grants, multiplier, dilutionPercent, simulationMode, currentValuation, futureValuation])

  const curve = useMemo(
    () => computePotentialCurve(grants, dilutionPercent),
    [grants, dilutionPercent],
  )

  return {
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
  }
}
