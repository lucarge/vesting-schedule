import { useState } from "react"
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatDate, formatNumber } from "@/lib/format"
import { addMonths } from "date-fns"
import type { Grant } from "@/types/grant"
import type { GrantVestingTimeline } from "@/types/vesting"

const chartConfig = {
  vested: {
    label: "Vested",
    color: "var(--color-chart-5)",
  },
} satisfies ChartConfig

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(date)
}

interface GrantVestingChartProps {
  grant: Grant
  timeline: GrantVestingTimeline
}

export function GrantVestingChart({ grant, timeline }: GrantVestingChartProps) {
  // Build chart data: start at 0, step up at each vesting event
  const chartData = [
    { date: grant.grantDate.getTime(), vested: 0 },
    ...timeline.events.map((ev) => ({
      date: ev.date.getTime(),
      vested: ev.cumulativeVested,
    })),
  ]

  const cliffDate =
    grant.cliffMonths > 0
      ? addMonths(grant.grantDate, grant.cliffMonths).getTime()
      : null

  const [now] = useState(Date.now)
  const chartMin = chartData[0].date
  const chartMax = chartData[chartData.length - 1].date
  const showToday = now >= chartMin && now <= chartMax
  const todayPct =
    showToday ? `${((now - chartMin) / (chartMax - chartMin)) * 100}%` : null
  const gradientId = `grantFade-${grant.id}`
  const strokeGradientId = `grantStrokeFade-${grant.id}`

  const lastEvent = timeline.events[timeline.events.length - 1]
  const isFullyVested = lastEvent && now >= lastEvent.date.getTime()

  return (
    <Card className={isFullyVested ? "border-emerald-500/40" : undefined}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{formatDate(grant.grantDate)}</CardTitle>
          {isFullyVested && (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              Fully Vested
            </Badge>
          )}
        </div>
        <CardDescription>
          {formatNumber(grant.grantedAmount)} shares &middot;{" "}
          {grant.vestingPeriodMonths}mo {grant.vestingSchedule} &middot;{" "}
          {grant.cliffMonths}mo cliff
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
          <AreaChart data={chartData}>
            {todayPct && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset={todayPct} stopColor="var(--color-vested)" stopOpacity={0.4} />
                  <stop offset={todayPct} stopColor="var(--color-vested)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id={strokeGradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset={todayPct} stopColor="var(--color-vested)" stopOpacity={1} />
                  <stop offset={todayPct} stopColor="var(--color-vested)" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            )}
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(ts: number) => formatMonthYear(new Date(ts))}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const ts = payload?.[0]?.payload?.date as number | undefined
                    return ts ? formatMonthYear(new Date(ts)) : ""
                  }}
                />
              }
            />
            {cliffDate && (
              <ReferenceLine
                x={cliffDate}
                stroke="var(--color-muted-foreground)"
                strokeDasharray="4 4"
                label={{ value: "Cliff", position: "insideTopRight", fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
            )}
            {showToday && (
              <ReferenceLine
                x={now}
                stroke="var(--color-foreground)"
                strokeDasharray="4 4"
                label={{ value: "Today", position: "insideTopRight", fontSize: 11, fill: "var(--color-foreground)" }}
              />
            )}
            <Area
              dataKey="vested"
              type="stepAfter"
              fill={todayPct ? `url(#${gradientId})` : "var(--color-vested)"}
              stroke={todayPct ? `url(#${strokeGradientId})` : "var(--color-vested)"}
              fillOpacity={todayPct ? 1 : 0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
