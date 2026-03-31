import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { formatNumber } from "@/lib/format"
import type { CumulativePoint } from "@/types/vesting"

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
  const chartData = data.map((p) => ({
    date: p.date.getTime(),
    totalVested: p.totalVested,
    totalUnvested: p.totalUnvested,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Vesting</CardTitle>
        <CardDescription>
          Total vested and unvested shares across all grants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
          <AreaChart data={chartData} stackOffset="none">
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
              width={60}
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
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="totalVested"
              type="stepAfter"
              stackId="a"
              fill="var(--color-totalVested)"
              stroke="var(--color-totalVested)"
              fillOpacity={0.6}
            />
            <Area
              dataKey="totalUnvested"
              type="stepAfter"
              stackId="a"
              fill="var(--color-totalUnvested)"
              stroke="var(--color-totalUnvested)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
