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
}

export function YearlySummary({ data }: YearlySummaryProps) {
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
                      Value minus total strike cost
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
                      Total value of shares based on current valuation
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
