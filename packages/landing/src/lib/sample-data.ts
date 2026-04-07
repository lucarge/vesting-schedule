// Sample vesting data for landing page charts
// Two grants with different schedules to showcase multi-grant support

// --- Grant A: Initial hire grant ---
// 10,000 shares, 4-year vesting, monthly, 1-year cliff
// Grant date: Jan 1, 2024
const GRANT_A_DATE = new Date(2024, 0, 1)
const GRANT_A_SHARES = 10_000
const GRANT_A_CLIFF = 12
const GRANT_A_MONTHS = 48

// --- Grant B: Refresh grant ---
// 5,000 shares, 4-year vesting, monthly, 1-year cliff
// Grant date: Jul 1, 2025 (18 months later)
const GRANT_B_DATE = new Date(2025, 6, 1)
const GRANT_B_SHARES = 5_000
const GRANT_B_CLIFF = 12
const GRANT_B_MONTHS = 48

export const SAMPLE_TODAY = new Date(2026, 3, 1).getTime()

// --- Individual grant timeline generation ---

interface GrantEvent {
  date: number
  vested: number
}

function generateGrantEvents(
  grantDate: Date,
  totalShares: number,
  cliffMonths: number,
  totalMonths: number,
): GrantEvent[] {
  const events: GrantEvent[] = [{ date: grantDate.getTime(), vested: 0 }]

  for (let m = 1; m <= totalMonths; m++) {
    const d = new Date(grantDate)
    d.setMonth(d.getMonth() + m)

    let vested: number
    if (m < cliffMonths) {
      vested = 0
    } else {
      vested = Math.round((totalShares * m) / totalMonths)
    }

    events.push({ date: d.getTime(), vested })
  }

  return events
}

export const grantAEvents = generateGrantEvents(GRANT_A_DATE, GRANT_A_SHARES, GRANT_A_CLIFF, GRANT_A_MONTHS)
export const grantBEvents = generateGrantEvents(GRANT_B_DATE, GRANT_B_SHARES, GRANT_B_CLIFF, GRANT_B_MONTHS)

export const grantAInfo = {
  label: "Initial Grant",
  date: GRANT_A_DATE,
  shares: GRANT_A_SHARES,
  months: GRANT_A_MONTHS,
  cliff: GRANT_A_CLIFF,
  cliffDate: new Date(2025, 0, 1).getTime(),
  endDate: new Date(2028, 0, 1).getTime(),
}

export const grantBInfo = {
  label: "Refresh Grant",
  date: GRANT_B_DATE,
  shares: GRANT_B_SHARES,
  months: GRANT_B_MONTHS,
  cliff: GRANT_B_CLIFF,
  cliffDate: new Date(2026, 6, 1).getTime(),
  endDate: new Date(2029, 6, 1).getTime(),
}

// --- Cumulative timeline (both grants combined) ---

export interface CumulativePoint {
  date: number
  totalVested: number
  totalUnvested: number
}

export function computeCumulativeTimeline(): CumulativePoint[] {
  // Collect all unique dates
  const dateSet = new Set<number>()
  for (const ev of grantAEvents) dateSet.add(ev.date)
  for (const ev of grantBEvents) dateSet.add(ev.date)
  const dates = Array.from(dateSet).sort((a, b) => a - b)

  function vestedAt(events: GrantEvent[], ts: number): number {
    let v = 0
    for (const ev of events) {
      if (ev.date <= ts) v = ev.vested
      else break
    }
    return v
  }

  const totalShares = GRANT_A_SHARES + GRANT_B_SHARES

  return dates.map((ts) => {
    const vested = vestedAt(grantAEvents, ts) + vestedAt(grantBEvents, ts)
    return {
      date: ts,
      totalVested: vested,
      totalUnvested: totalShares - vested,
    }
  })
}

export const cumulativeData = computeCumulativeTimeline()

// --- Yearly summary ---

export interface YearlyData {
  year: number
  sharesVesting: number
}

export function computeYearlySummary(): YearlyData[] {
  const yearMap = new Map<number, number>()

  function addGrantYearly(events: GrantEvent[]) {
    for (let i = 1; i < events.length; i++) {
      const sharesThisMonth = events[i].vested - events[i - 1].vested
      if (sharesThisMonth > 0) {
        const year = new Date(events[i].date).getFullYear()
        yearMap.set(year, (yearMap.get(year) ?? 0) + sharesThisMonth)
      }
    }
  }

  addGrantYearly(grantAEvents)
  addGrantYearly(grantBEvents)

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, sharesVesting]) => ({ year, sharesVesting }))
}

export const yearlySummaryData = computeYearlySummary()

// --- Hero chart data (simplified cumulative for visual impact) ---

export const heroChartData = cumulativeData.filter((_, i, arr) => {
  return i === 0 || i % 3 === 0 || i === arr.length - 1
})
