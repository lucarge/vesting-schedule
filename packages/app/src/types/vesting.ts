export interface VestingEvent {
  date: Date
  sharesVested: number
  cumulativeVested: number
  unvested: number
}

export interface GrantVestingTimeline {
  grantId: string
  events: VestingEvent[]
}

export interface YearlySummary {
  year: number
  sharesVesting: number
  valueVesting: number
  netValueVesting: number
}

export interface CumulativePoint {
  date: Date
  totalVested: number
  totalUnvested: number
  totalVestedValue: number
  totalUnvestedValue: number
  totalAppreciatedVestedValue?: number
}
