import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatNumber } from "@/lib/format"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { computeGrantTimeline } from "@/lib/vesting"
import { getAppreciationMultiplier } from "@/lib/valuation"
import { getYear } from "date-fns"
import type { Grant } from "@/types/grant"
import type { ValuationEntry } from "@/types/valuation"
import type { YearlySummary as YearlySummaryData } from "@/types/vesting"

const chartConfig = {
  sharesVesting: {
    label: "Shares",
    color: "var(--color-chart-3)",
  },
  valueVesting: {
    label: "Value (EUR)",
    color: "var(--color-chart-5)",
  },
} satisfies ChartConfig

interface YearlySummaryProps {
  data: YearlySummaryData[]
  valuations: ValuationEntry[]
  grants: Grant[]
}

interface YearlyRow extends YearlySummaryData {
  appreciatedValue?: number
  appreciatedNetValue?: number
}

export function YearlySummary({ data, valuations, grants }: YearlySummaryProps) {
  const { rows, hasAppreciation } = useMemo(() => {
    // Build a map of per-grant appreciation multipliers
    const multipliers = new Map<string, number>()
    let anyAppreciation = false
    for (const grant of grants) {
      const m = getAppreciationMultiplier(valuations, grant.grantDate)
      if (m !== undefined) {
        multipliers.set(grant.id, m)
        anyAppreciation = true
      }
    }

    if (!anyAppreciation) {
      return { rows: data as YearlyRow[], hasAppreciation: false }
    }

    const yearMap = new Map<number, { appreciatedValue: number; appreciatedStrikeCost: number }>()

    for (const grant of grants) {
      const timeline = computeGrantTimeline(grant)
      const valuePerShare = grant.grantedAmount > 0 ? grant.vsopsValue / grant.grantedAmount : 0
      const m = multipliers.get(grant.id) ?? 1

      for (const ev of timeline.events) {
        const year = getYear(ev.date)
        const existing = yearMap.get(year) ?? { appreciatedValue: 0, appreciatedStrikeCost: 0 }
        existing.appreciatedValue += ev.sharesVested * valuePerShare * m
        existing.appreciatedStrikeCost += ev.sharesVested * grant.vsopsStrikePrice
        yearMap.set(year, existing)
      }
    }

    const enrichedRows: YearlyRow[] = data.map((row) => {
      const yearData = yearMap.get(row.year)
      if (!yearData) return row
      return {
        ...row,
        appreciatedValue: yearData.appreciatedValue,
        appreciatedNetValue: yearData.appreciatedValue - yearData.appreciatedStrikeCost,
      }
    })

    return { rows: enrichedRows, hasAppreciation: true }
  }, [data, valuations, grants])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Vesting Summary</CardTitle>
        <CardDescription>Shares and value vesting per calendar year</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ChartContainer config={chartConfig} className="aspect-[3/1] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={60} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <span>
                      {chartConfig[name as keyof typeof chartConfig]?.label}:{" "}
                      {typeof value === "number"
                        ? name === "valueVesting"
                          ? formatCurrency(value)
                          : formatNumber(value)
                        : value}
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="sharesVesting"
              fill="var(--color-sharesVesting)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">
                      Shares
                    </TooltipTrigger>
                    <TooltipContent>
                      Number of shares vesting in this year
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">
                      Net Value
                    </TooltipTrigger>
                    <TooltipContent>
                      Value minus total strike cost (at grant valuation)
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">
                      Value
                    </TooltipTrigger>
                    <TooltipContent>
                      Total value of shares at grant valuation
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              {hasAppreciation && (
                <>
                  <TableHead className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">
                          Current Net Value
                        </TooltipTrigger>
                        <TooltipContent>
                          Net value adjusted for current company valuation
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">
                          Current Value
                        </TooltipTrigger>
                        <TooltipContent>
                          Total value adjusted for current company valuation
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.year}>
                <TableCell className="font-medium">{row.year}</TableCell>
                <TableCell className="text-right">
                  {formatNumber(row.sharesVesting)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.netValueVesting)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.valueVesting)}
                </TableCell>
                {hasAppreciation && (
                  <>
                    <TableCell className="text-right text-emerald-600 dark:text-emerald-400">
                      {row.appreciatedNetValue !== undefined
                        ? formatCurrency(row.appreciatedNetValue)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 dark:text-emerald-400">
                      {row.appreciatedValue !== undefined
                        ? formatCurrency(row.appreciatedValue)
                        : "—"}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
