import { useState } from "react"
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatNumber } from "@/lib/format"
import type { CumulativePoint } from "@/types/vesting"

type ChartMode = "shares" | "value"
const CHART_MODE_KEY = "vsop-cumulative-chart-mode"

const chartConfig = {
  totalVested: {
    label: "Vested",
    color: "var(--color-chart-5)",
  },
  totalUnvested: {
    label: "Unvested",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(date)
}

interface CumulativeChartProps {
  data: CumulativePoint[]
}

export function CumulativeChart({ data }: CumulativeChartProps) {
  const [mode, setMode] = useState<ChartMode>(() => {
    const stored = localStorage.getItem(CHART_MODE_KEY)
    return stored === "value" ? "value" : "shares"
  })

  function handleModeChange(newMode: string | number) {
    const m = newMode as ChartMode
    setMode(m)
    localStorage.setItem(CHART_MODE_KEY, m)
  }

  const isValue = mode === "value"
  const chartData = data.map((p) => ({
    date: p.date.getTime(),
    totalVested: isValue ? p.totalVestedValue : p.totalVested,
    totalUnvested: isValue ? p.totalUnvestedValue : p.totalUnvested,
  }))

  const [now] = useState(Date.now)
  const chartMin = chartData[0].date
  const chartMax = chartData[chartData.length - 1].date
  const showToday = now >= chartMin && now <= chartMax
  const todayPct =
    showToday ? `${((now - chartMin) / (chartMax - chartMin)) * 100}%` : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cumulative Vesting</CardTitle>
            <CardDescription>
              Total vested and unvested {isValue ? "value" : "shares"} across all grants
            </CardDescription>
          </div>
          <Tabs value={mode} onValueChange={handleModeChange}>
            <TabsList>
              <TabsTrigger value="shares">Shares</TabsTrigger>
              <TabsTrigger value="value">Value</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
          <AreaChart data={chartData} stackOffset="none">
            {todayPct && (
              <defs>
                <linearGradient id="vestedFade" x1="0" y1="0" x2="1" y2="0">
                  <stop offset={todayPct} stopColor="var(--color-totalVested)" stopOpacity={0.6} />
                  <stop offset={todayPct} stopColor="var(--color-totalVested)" stopOpacity={0.15} />
                </linearGradient>
                <linearGradient id="unvestedFade" x1="0" y1="0" x2="1" y2="0">
                  <stop offset={todayPct} stopColor="var(--color-totalUnvested)" stopOpacity={0.3} />
                  <stop offset={todayPct} stopColor="var(--color-totalUnvested)" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="vestedStrokeFade" x1="0" y1="0" x2="1" y2="0">
                  <stop offset={todayPct} stopColor="var(--color-totalVested)" stopOpacity={1} />
                  <stop offset={todayPct} stopColor="var(--color-totalVested)" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="unvestedStrokeFade" x1="0" y1="0" x2="1" y2="0">
                  <stop offset={todayPct} stopColor="var(--color-totalUnvested)" stopOpacity={1} />
                  <stop offset={todayPct} stopColor="var(--color-totalUnvested)" stopOpacity={0.3} />
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
              width={isValue ? 80 : 60}
              tickFormatter={(v: number) => isValue ? formatCurrency(v) : formatNumber(v)}
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
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="totalVested"
              type="stepAfter"
              stackId="a"
              fill={todayPct ? "url(#vestedFade)" : "var(--color-totalVested)"}
              stroke={todayPct ? "url(#vestedStrokeFade)" : "var(--color-totalVested)"}
              fillOpacity={todayPct ? 1 : 0.6}
            />
            <Area
              dataKey="totalUnvested"
              type="stepAfter"
              stackId="a"
              fill={todayPct ? "url(#unvestedFade)" : "var(--color-totalUnvested)"}
              stroke={todayPct ? "url(#unvestedStrokeFade)" : "var(--color-totalUnvested)"}
              fillOpacity={todayPct ? 1 : 0.3}
            />
            {showToday && (
              <ReferenceLine
                x={now}
                stroke="var(--color-foreground)"
                strokeDasharray="4 4"
                label={{ value: "Today", position: "insideTopRight", fontSize: 11, fill: "var(--color-foreground)" }}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
