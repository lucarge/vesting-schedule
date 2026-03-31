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
  type ChartConfig,
} from "@/components/ui/chart"
import { formatDate, formatNumber } from "@/lib/format"
import { addMonths } from "date-fns"
import type { Grant } from "@/types/grant"
import type { GrantVestingTimeline } from "@/types/vesting"

const chartConfig = {
  unvested: {
    label: "Unvested",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(date)
}

interface GrantBurndownProps {
  grant: Grant
  timeline: GrantVestingTimeline
}

export function GrantBurndown({ grant, timeline }: GrantBurndownProps) {
  // Build chart data: start at full amount, step down at each event
  const chartData = [
    { date: grant.grantDate.getTime(), unvested: grant.grantedAmount },
    ...timeline.events.map((ev) => ({
      date: ev.date.getTime(),
      unvested: ev.unvested,
    })),
  ]

  const cliffDate =
    grant.cliffMonths > 0
      ? addMonths(grant.grantDate, grant.cliffMonths).getTime()
      : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatDate(grant.grantDate)}</CardTitle>
        <CardDescription>
          {formatNumber(grant.grantedAmount)} shares &middot;{" "}
          {grant.vestingPeriodMonths}mo {grant.vestingSchedule} &middot;{" "}
          {grant.cliffMonths}mo cliff
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
          <AreaChart data={chartData}>
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
                label={{ value: "Cliff", position: "top", fontSize: 11 }}
              />
            )}
            <Area
              dataKey="unvested"
              type="stepAfter"
              fill="var(--color-unvested)"
              stroke="var(--color-unvested)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
