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
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ColumnConfigPopover } from "@/components/column-config-popover"
import type { Grant } from "@/types/grant"
import type { GrantTotals } from "@/hooks/use-grants"
import { useColumnConfig } from "@/hooks/use-column-config"

interface GrantTableProps {
  grants: Grant[]
  totals: GrantTotals
  onRemoveGrant: (id: string) => void
}

export function GrantTable({ grants, totals, onRemoveGrant }: GrantTableProps) {
  const { columnConfig, visibleColumns, toggleColumn, moveColumn, resetToDefaults } =
    useColumnConfig()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grants</CardTitle>
        <CardAction>
          <ColumnConfigPopover
            columnConfig={columnConfig}
            onToggle={toggleColumn}
            onMove={moveColumn}
            onReset={resetToDefaults}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableHead
                  key={col.id}
                  className={col.align === "right" ? "text-right" : undefined}
                >
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {grants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + 1}
                  className="text-center text-muted-foreground"
                >
                  No grants added yet.
                </TableCell>
              </TableRow>
            ) : (
              grants.map((grant) => (
                <TableRow key={grant.id}>
                  {visibleColumns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={col.align === "right" ? "text-right" : undefined}
                    >
                      {col.renderCell(grant)}
                    </TableCell>
                  ))}
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
                {visibleColumns.map((col, idx) => (
                  <TableCell
                    key={col.id}
                    className={
                      col.align === "right" || idx > 0
                        ? "text-right font-medium"
                        : "font-medium"
                    }
                  >
                    {idx === 0
                      ? "Total"
                      : col.renderFooter
                        ? col.renderFooter(totals)
                        : null}
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
