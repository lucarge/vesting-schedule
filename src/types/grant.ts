export type VestingSchedule = "monthly" | "quarterly" | "yearly"

export interface Grant {
  id: string
  grantDate: Date
  vestingSchedule: VestingSchedule
  vestingPeriodMonths: number
  cliffMonths: number
  grantedAmount: number
  vsopsValue: number
  vsopsStrikePrice: number
  companyValuation: number
}

export interface GrantFormData {
  grantDate: Date | undefined
  vestingSchedule: VestingSchedule
  vestingPeriodMonths: string
  cliffMonths: string
  grantedAmount: string
  vsopsValue: string
  vsopsStrikePrice: string
  companyValuation: string
}
