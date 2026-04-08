import type { Grant } from "@/types/grant"
import type { ValuationEntry } from "@/types/valuation"

export type GrantWithValuation = Grant & {
  applicableValuation?: number
  latestValuation?: number
}

export function getValuationForDate(
  valuations: ValuationEntry[],
  date: Date,
): ValuationEntry | undefined {
  return valuations
    .filter((v) => v.date <= date)
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0]
}

export function getLatestValuation(
  valuations: ValuationEntry[],
): ValuationEntry | undefined {
  if (valuations.length === 0) return undefined
  return valuations.reduce((latest, v) =>
    v.date > latest.date ? v : latest,
  )
}

export function enrichGrantsWithValuation(
  grants: Grant[],
  valuations: ValuationEntry[],
): GrantWithValuation[] {
  const latest = getLatestValuation(valuations)
  return grants.map((grant) => {
    const entry = getValuationForDate(valuations, grant.grantDate)
    return {
      ...grant,
      applicableValuation: entry?.valuation,
      latestValuation: latest?.valuation,
    }
  })
}

export function computeTotalOwnership(
  grants: GrantWithValuation[],
): number {
  return grants.reduce(
    (sum, g) =>
      g.applicableValuation
        ? sum + (g.vsopsValue / g.applicableValuation) * 100
        : sum,
    0,
  )
}

export function getAppreciationMultiplier(
  valuations: ValuationEntry[],
  grantDate: Date,
): number | undefined {
  const grantValuation = getValuationForDate(valuations, grantDate)
  const latest = getLatestValuation(valuations)
  if (!grantValuation || !latest || grantValuation.valuation === 0) return undefined
  const multiplier = latest.valuation / grantValuation.valuation
  if (multiplier === 1) return undefined
  return multiplier
}

/**
 * Computes cumulative dilution from all funding rounds.
 * Each round dilutes by `amountRaised / (valuation + amountRaised)` (pre-money model).
 * Returns a percentage (0–100).
 */
export function computeCumulativeDilution(
  valuations: ValuationEntry[],
): number {
  const sorted = [...valuations].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  )
  let retainedFraction = 1
  for (const v of sorted) {
    if (v.amountRaised && v.amountRaised > 0) {
      const postMoney = v.valuation + v.amountRaised
      retainedFraction *= v.valuation / postMoney
    }
  }
  return (1 - retainedFraction) * 100
}
