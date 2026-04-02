import {
  computePotentialAtMultiplier,
  computePotentialCurve,
} from "@/lib/potential"
import type { Grant } from "@/types/grant"
import { useMemo, useState } from "react"

export function usePotential(grants: Grant[]) {
  const [multiplier, setMultiplier] = useState(1.0)
  const [dilutionPercent, setDilutionPercent] = useState(0)

  const summary = useMemo(
    () => computePotentialAtMultiplier(grants, multiplier, dilutionPercent),
    [grants, multiplier, dilutionPercent],
  )

  const curve = useMemo(
    () => computePotentialCurve(grants, dilutionPercent),
    [grants, dilutionPercent],
  )

  return {
    multiplier,
    setMultiplier,
    dilutionPercent,
    setDilutionPercent,
    summary,
    curve,
  }
}
