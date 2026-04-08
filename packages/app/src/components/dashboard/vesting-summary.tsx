import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { computeGrantTimeline } from "@/lib/vesting"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import { getAppreciationMultiplier } from "@/lib/valuation"
import type { Grant } from "@/types/grant"
import type { ValuationEntry } from "@/types/valuation"

interface VestingSummaryProps {
  grants: Grant[]
  valuations: ValuationEntry[]
}

const green = "font-semibold text-emerald-600 dark:text-emerald-400"

export function VestingSummary({ grants, valuations }: VestingSummaryProps) {
  const [now] = useState(Date.now)
  const summary = useMemo(() => {
    const timelines = grants.map((g) => ({
      grant: g,
      timeline: computeGrantTimeline(g),
    }))

    let vestedShares = 0
    let vestedValue = 0
    let vestedStrikeCost = 0
    let vestedAppreciatedValue = 0
    let hasAppreciation = false
    let fullVestingDate: Date | null = null

    for (const { grant, timeline } of timelines) {
      const valuePerShare =
        grant.grantedAmount > 0 ? grant.vsopsValue / grant.grantedAmount : 0
      const multiplier = getAppreciationMultiplier(valuations, grant.grantDate)
      const effectiveMultiplier = multiplier ?? 1
      if (multiplier !== undefined) hasAppreciation = true

      let grantVested = 0
      for (const ev of timeline.events) {
        if (ev.date.getTime() <= now) {
          grantVested = ev.cumulativeVested
        }
      }
      vestedShares += grantVested
      vestedValue += grantVested * valuePerShare
      vestedStrikeCost += grantVested * grant.vsopsStrikePrice
      vestedAppreciatedValue += grantVested * valuePerShare * effectiveMultiplier

      const lastEvent = timeline.events[timeline.events.length - 1]
      if (lastEvent) {
        if (!fullVestingDate || lastEvent.date > fullVestingDate) {
          fullVestingDate = lastEvent.date
        }
      }
    }

    const totalShares = grants.reduce((s, g) => s + g.grantedAmount, 0)
    const totalValue = grants.reduce((s, g) => s + g.vsopsValue, 0)
    const totalStrikeCost = grants.reduce(
      (s, g) => s + g.vsopsStrikePrice * g.grantedAmount,
      0,
    )

    const appreciationPct =
      hasAppreciation && vestedValue > 0
        ? ((vestedAppreciatedValue - vestedValue) / vestedValue) * 100
        : undefined

    return {
      vestedShares,
      vestedNetValue: vestedValue - vestedStrikeCost,
      vestedValue,
      vestedAppreciatedValue,
      vestedAppreciatedNetValue: vestedAppreciatedValue - vestedStrikeCost,
      totalShares,
      totalNetValue: totalValue - totalStrikeCost,
      totalValue,
      fullVestingDate,
      isFullyVested: fullVestingDate ? now >= fullVestingDate.getTime() : false,
      appreciationPct,
    }
  }, [grants, valuations, now])

  const {
    vestedShares,
    vestedNetValue,
    vestedValue,
    vestedAppreciatedValue,
    vestedAppreciatedNetValue,
    totalShares,
    totalNetValue,
    totalValue,
    fullVestingDate,
    isFullyVested,
    appreciationPct,
  } = summary

  const appreciationLine = appreciationPct !== undefined && (
    <p className="mt-1 text-muted-foreground">
      {appreciationPct >= 0 ? "↑" : "↓"}{" "}
      {Math.abs(appreciationPct).toFixed(1)}% since grant — current net value of{" "}
      <span className="font-medium text-foreground">
        {formatCurrency(vestedAppreciatedNetValue)}
      </span>
      {" "}and total value of{" "}
      <span className="font-medium text-foreground">
        {formatCurrency(vestedAppreciatedValue)}
      </span>
    </p>
  )

  return (
    <Card>
      <CardContent className="py-5 text-sm leading-relaxed">
        {isFullyVested ? (
          <>
            <p>
              You are fully vested with{" "}
              <span className="font-semibold">{formatNumber(totalShares)}</span> shares,
              for a net value of{" "}
              <span className={green}>{formatCurrency(totalNetValue)}</span> and a
              total value of{" "}
              <span className={green}>{formatCurrency(totalValue)}</span>.
            </p>
            {appreciationLine}
          </>
        ) : (
          <>
            <p>
              You have vested{" "}
              <span className="font-semibold">{formatNumber(vestedShares)}</span> shares
              so far, for a net value of{" "}
              <span className={green}>{formatCurrency(vestedNetValue)}</span> and
              a total value of{" "}
              <span className={green}>{formatCurrency(vestedValue)}</span>. You
              will be fully vested on{" "}
              <span className="font-semibold">
                {fullVestingDate ? formatDate(fullVestingDate) : "—"}
              </span>
              , and by then you'll own{" "}
              <span className="font-semibold">{formatNumber(totalShares)}</span> shares,
              for a net value of{" "}
              <span className={green}>{formatCurrency(totalNetValue)}</span> and a
              total value of{" "}
              <span className={green}>{formatCurrency(totalValue)}</span>.
            </p>
            {appreciationLine}
          </>
        )}
      </CardContent>
    </Card>
  )
}
