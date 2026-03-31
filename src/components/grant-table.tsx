import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Grant } from "@/types/grant"
import type { GrantTotals } from "@/hooks/use-grants"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"

const SCHEDULE_LABELS: Record<Grant["vestingSchedule"], string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
}

interface GrantTableProps {
  grants: Grant[]
  totals: GrantTotals
  onRemoveGrant: (id: string) => void
}

export function GrantTable({ grants, totals, onRemoveGrant }: GrantTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grants</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grant Date</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="text-right">Vesting Period</TableHead>
              <TableHead className="text-right">Cliff</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Strike Price</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {grants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No grants added yet.
                </TableCell>
              </TableRow>
            ) : (
              grants.map((grant) => (
                <TableRow key={grant.id}>
                  <TableCell>{formatDate(grant.grantDate)}</TableCell>
                  <TableCell>{SCHEDULE_LABELS[grant.vestingSchedule]}</TableCell>
                  <TableCell className="text-right">{grant.vestingPeriodMonths} mo</TableCell>
                  <TableCell className="text-right">{grant.cliffMonths} mo</TableCell>
                  <TableCell className="text-right">{formatNumber(grant.grantedAmount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(grant.vsopsValue)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(grant.vsopsStrikePrice)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRemoveGrant(grant.id)}
                      aria-label="Remove grant"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {grants.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatNumber(totals.totalGrantedAmount)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(totals.totalVsopsValue)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(totals.totalStrikeCost)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
