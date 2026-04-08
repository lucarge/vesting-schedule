import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ValuationForm } from "@/components/valuation-form"
import { useValuations } from "@/hooks/use-valuations"
import { formatCurrency, formatCurrencyCompact, formatDate } from "@/lib/format"
import { computeCumulativeDilution } from "@/lib/valuation"
import type { ValuationEntry } from "@/types/valuation"

const chartConfig = {
  valuation: {
    label: "Valuation",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig

export function ValuationsPage() {
  const { valuations, addValuation, updateValuation, removeValuation } = useValuations()
  const [editingEntry, setEditingEntry] = useState<ValuationEntry | null>(null)

  const sorted = [...valuations].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )

  const cumulativeDilution = computeCumulativeDilution(valuations)
  const hasAnyRaise = valuations.some((v) => v.amountRaised && v.amountRaised > 0)

  const chartData = [...valuations]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((v) => ({
      date: v.date.toISOString().slice(0, 10),
      valuation: v.valuation,
    }))

  function handleUpdate(entry: ValuationEntry) {
    updateValuation(entry)
    setEditingEntry(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Company Valuations</h1>
        <p className="text-sm text-muted-foreground">
          Track how your company's valuation changes over time. Grants are
          automatically matched to the most recent valuation on or before their
          grant date.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <ValuationForm onAdd={addValuation} />
        </CardContent>
      </Card>

      {sorted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Valuation</TableHead>
                  {hasAnyRaise && (
                    <TableHead className="text-right">Raised</TableHead>
                  )}
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(entry.valuation)}
                    </TableCell>
                    {hasAnyRaise && (
                      <TableCell className="text-right">
                        {entry.amountRaised
                          ? formatCurrency(entry.amountRaised)
                          : "—"}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setEditingEntry(entry)}
                          aria-label="Edit valuation"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeValuation(entry.id)}
                          aria-label="Remove valuation"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {cumulativeDilution > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Cumulative dilution from funding rounds:{" "}
                <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
                  {cumulativeDilution.toFixed(2)}%
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {chartData.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Valuation Over Time</CardTitle>
            <CardDescription>
              How your company's valuation has changed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="valuationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-valuation)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-valuation)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
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
                      formatter={(value) => (
                        <span className="font-mono font-medium">
                          {formatCurrency(value as number)}
                        </span>
                      )}
                    />
                  }
                />
                <Area
                  dataKey="valuation"
                  type="monotone"
                  fill="url(#valuationGrad)"
                  stroke="var(--color-valuation)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={editingEntry !== null}
        onOpenChange={(open) => {
          if (!open) setEditingEntry(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Valuation</DialogTitle>
            <DialogDescription>
              Update the details of this valuation entry.
            </DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <ValuationForm
              key={editingEntry.id}
              initialEntry={editingEntry}
              onUpdate={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
