import type { Grant } from "@/types/grant"
import type { ValuationEntry } from "@/types/valuation"
import { getAppreciationMultiplier } from "@/lib/valuation"

export interface PotentialScenario {
  multiplier: number
  netValue: number
  dilutedNetValue: number
}

export interface PotentialSummary {
  currentNetValue: number
  simulatedNetValue: number
  netGain: number
  dilutionImpact: number
}

/**
 * Compute per-grant appreciation multipliers from valuation history.
 * Falls back to 1 (no appreciation) when no valuation data is available.
 */
function getGrantMultipliers(
  grants: Grant[],
  valuations?: ValuationEntry[],
): number[] {
  return grants.map((g) =>
    valuations ? (getAppreciationMultiplier(valuations, g.grantDate) ?? 1) : 1,
  )
}

/**
 * Compute net value of all grants at a given simulation multiplier.
 * The appreciation multiplier reflects value changes that have already
 * happened (from valuation history); the simulation multiplier represents
 * future growth on top of the current appreciated value.
 */
function computeNetValue(
  grants: Grant[],
  simulationMultiplier: number,
  appreciationMultipliers: number[],
): number {
  return grants.reduce((sum, grant, i) => {
    const basePrice = grant.vsopsValue / grant.grantedAmount
    const currentPrice = basePrice * appreciationMultipliers[i]
    const simulatedValue = grant.grantedAmount * currentPrice * simulationMultiplier
    const strikeCost = grant.grantedAmount * grant.vsopsStrikePrice
    return sum + Math.max(0, simulatedValue - strikeCost)
  }, 0)
}

export function computePotentialAtMultiplier(
  grants: Grant[],
  multiplier: number,
  dilutionPercent: number,
  valuations?: ValuationEntry[],
): PotentialSummary {
  const appreciationMultipliers = getGrantMultipliers(grants, valuations)
  const currentNetValue = computeNetValue(grants, 1, appreciationMultipliers)
  const netBeforeDilution = computeNetValue(grants, multiplier, appreciationMultipliers)
  const simulatedNetValue = netBeforeDilution * (1 - dilutionPercent / 100)
  return {
    currentNetValue,
    simulatedNetValue,
    netGain: simulatedNetValue - currentNetValue,
    dilutionImpact: netBeforeDilution - simulatedNetValue,
  }
}

export function computePotentialAtValuation(
  grants: Grant[],
  currentValuation: number,
  futureValuation: number,
  dilutionPercent: number,
  valuations?: ValuationEntry[],
): PotentialSummary {
  const multiplier = futureValuation / currentValuation
  return computePotentialAtMultiplier(grants, multiplier, dilutionPercent, valuations)
}

export function computePotentialCurve(
  grants: Grant[],
  dilutionPercent: number,
  valuations?: ValuationEntry[],
  steps = 20,
): PotentialScenario[] {
  const min = 0.5
  const max = 20
  const stepSize = (max - min) / steps
  const appreciationMultipliers = getGrantMultipliers(grants, valuations)

  const points: PotentialScenario[] = []
  for (let i = 0; i <= steps; i++) {
    const multiplier = Math.round((min + i * stepSize) * 10) / 10
    const netValue = computeNetValue(grants, multiplier, appreciationMultipliers)
    points.push({
      multiplier,
      netValue,
      dilutedNetValue: netValue * (1 - dilutionPercent / 100),
    })
  }
  return points
}
