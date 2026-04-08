import type { Grant } from "@/types/grant"

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

function computeNetValue(grants: Grant[], multiplier: number): number {
  return grants.reduce((sum, grant) => {
    const basePrice = grant.vsopsValue / grant.grantedAmount
    const simulatedValue = grant.grantedAmount * basePrice * multiplier
    const strikeCost = grant.grantedAmount * grant.vsopsStrikePrice
    return sum + Math.max(0, simulatedValue - strikeCost)
  }, 0)
}

export function computePotentialAtMultiplier(
  grants: Grant[],
  multiplier: number,
  dilutionPercent: number,
): PotentialSummary {
  const currentNetValue = computeNetValue(grants, 1)
  const netBeforeDilution = computeNetValue(grants, multiplier)
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
): PotentialSummary {
  const multiplier = futureValuation / currentValuation
  return computePotentialAtMultiplier(grants, multiplier, dilutionPercent)
}

export function computePotentialCurve(
  grants: Grant[],
  dilutionPercent: number,
  steps = 20,
): PotentialScenario[] {
  const min = 0.5
  const max = 20
  const stepSize = (max - min) / steps

  const points: PotentialScenario[] = []
  for (let i = 0; i <= steps; i++) {
    const multiplier = Math.round((min + i * stepSize) * 10) / 10
    const netValue = computeNetValue(grants, multiplier)
    points.push({
      multiplier,
      netValue,
      dilutedNetValue: netValue * (1 - dilutionPercent / 100),
    })
  }
  return points
}
