import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from "lucide-react"

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ColumnConfigPopover } from "@/components/column-config-popover"
import type { Grant } from "@/types/grant"
import type { GrantTotals } from "@/hooks/use-grants"
import { useColumnConfig } from "@/hooks/use-column-config"
import { cn } from "@/lib/utils"

interface GrantTableProps {
  grants: Grant[]
  totals: GrantTotals
  onEditGrant: (grant: Grant) => void
  onRemoveGrant: (id: string) => void
}

const FOOTER_COLOR_CLASSES = {
  green: "text-emerald-600 dark:text-emerald-400",
  red: "text-red-600 dark:text-red-400",
} as const

export function GrantTable({ grants, totals, onEditGrant, onRemoveGrant }: GrantTableProps) {
  const {
    columnConfig,
    visibleColumns,
    toggleColumn,
    moveColumn,
    resetToDefaults,
    sortConfig,
    toggleSort,
    sortGrants,
  } = useColumnConfig()

  const sortedGrants = sortGrants(grants)

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
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((col) => (
                  <TableHead
                    key={col.id}
                    className={cn(
                      col.align === "right" && "text-right",
                      col.sortValue && "cursor-pointer select-none",
                    )}
                    onClick={
                      col.sortValue ? () => toggleSort(col.id) : undefined
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.tooltip ? (
                        <Tooltip>
                          <TooltipTrigger className="underline decoration-dotted decoration-muted-foreground/50 underline-offset-4">
                            {col.label}
                          </TooltipTrigger>
                          <TooltipContent>{col.tooltip}</TooltipContent>
                        </Tooltip>
                      ) : (
                        col.label
                      )}
                      {col.sortValue &&
                        (sortConfig.column === col.id ? (
                          sortConfig.direction === "asc" ? (
                            <ArrowUp className="size-3.5 text-foreground" />
                          ) : (
                            <ArrowDown className="size-3.5 text-foreground" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3.5 text-muted-foreground/50" />
                        ))}
                    </span>
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
                sortedGrants.map((grant) => (
                  <TableRow key={grant.id}>
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.id}
                        className={
                          col.align === "right" ? "text-right" : undefined
                        }
                      >
                        {col.renderCell(grant)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onEditGrant(grant)}
                          aria-label="Edit grant"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onRemoveGrant(grant.id)}
                          aria-label="Remove grant"
                        >
                          <Trash2 />
                        </Button>
                      </div>
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
                      className={cn(
                        "font-medium",
                        (col.align === "right" || idx > 0) && "text-right",
                        idx > 0 &&
                          col.renderFooter &&
                          col.footerColor &&
                          FOOTER_COLOR_CLASSES[col.footerColor],
                      )}
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
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
