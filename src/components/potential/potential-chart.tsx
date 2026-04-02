import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
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
import { formatCurrency, formatCurrencyCompact } from "@/lib/format"
import type { PotentialScenario } from "@/lib/potential"

const chartConfig = {
  netValue: {
    label: "Net Value",
    color: "var(--color-chart-5)",
  },
  dilutedNetValue: {
    label: "After Dilution",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig

interface PotentialChartProps {
  data: PotentialScenario[]
  multiplier: number
  dilutionPercent: number
}

export function PotentialChart({
  data,
  multiplier,
  dilutionPercent,
}: PotentialChartProps) {
  const showDilution = dilutionPercent > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Value by Valuation Multiple</CardTitle>
        <CardDescription>
          How your stock option net value changes across different company
          valuation scenarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="netValueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-netValue)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-netValue)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient
                id="dilutedNetValueGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-dilutedNetValue)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-dilutedNetValue)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="multiplier"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}x`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={80}
              tickFormatter={(v: number) => formatCurrencyCompact(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_label, payload) => {
                    const m = payload?.[0]?.payload?.multiplier
                    return m != null ? `${m}x valuation` : ""
                  }}
                  formatter={(value, name) => {
                    const config = chartConfig[name as keyof typeof chartConfig]
                    return (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {config?.label}
                        </span>
                        <span className="font-mono font-medium">
                          {formatCurrency(value as number)}
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            {showDilution && <ChartLegend content={<ChartLegendContent />} />}
            <Area
              dataKey="netValue"
              type="monotone"
              fill="url(#netValueGrad)"
              stroke="var(--color-netValue)"
              strokeWidth={2}
            />
            {showDilution && (
              <Area
                dataKey="dilutedNetValue"
                type="monotone"
                fill="url(#dilutedNetValueGrad)"
                stroke="var(--color-dilutedNetValue)"
                strokeWidth={2}
              />
            )}
            <ReferenceLine
              x={1}
              stroke="var(--color-foreground)"
              strokeDasharray="4 4"
              label={{
                value: "Current",
                position: "insideTopLeft",
                fontSize: 11,
                fill: "var(--color-foreground)",
              }}
            />
            {multiplier !== 1 && (
              <ReferenceLine
                x={multiplier}
                stroke="var(--color-chart-3)"
                strokeDasharray="4 4"
                label={{
                  value: `${multiplier}x`,
                  position: "insideTopRight",
                  fontSize: 11,
                  fill: "var(--color-chart-3)",
                }}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
