import { useMemo } from "react"
import type { Grant } from "@/types/grant"
import {
  computeGrantTimeline,
  computeCumulativeTimeline,
  computeYearlySummary,
} from "@/lib/vesting"

export function useVesting(grants: Grant[]) {
  const grantTimelines = useMemo(
    () => grants.map(computeGrantTimeline),
    [grants],
  )

  const cumulativeTimeline = useMemo(
    () => computeCumulativeTimeline(grants),
    [grants],
  )

  const yearlySummary = useMemo(
    () => computeYearlySummary(grants),
    [grants],
  )

  return { grantTimelines, cumulativeTimeline, yearlySummary }
}
