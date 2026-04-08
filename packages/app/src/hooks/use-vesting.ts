import { useMemo } from "react"
import type { Grant } from "@/types/grant"
import type { ValuationEntry } from "@/types/valuation"
import {
  computeGrantTimeline,
  computeCumulativeTimeline,
  computeYearlySummary,
} from "@/lib/vesting"

export function useVesting(grants: Grant[], valuations?: ValuationEntry[]) {
  const grantTimelines = useMemo(
    () => grants.map(computeGrantTimeline),
    [grants],
  )

  const cumulativeTimeline = useMemo(
    () => computeCumulativeTimeline(grants, valuations),
    [grants, valuations],
  )

  const yearlySummary = useMemo(
    () => computeYearlySummary(grants),
    [grants],
  )

  return { grantTimelines, cumulativeTimeline, yearlySummary }
}
