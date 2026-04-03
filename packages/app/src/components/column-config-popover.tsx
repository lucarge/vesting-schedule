import { ChevronDown, ChevronUp, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { COLUMN_DEFS, type ColumnConfig, type ColumnId } from "@/lib/columns"

interface ColumnConfigPopoverProps {
  columnConfig: ColumnConfig[]
  onToggle: (id: ColumnId) => void
  onMove: (id: ColumnId, direction: "up" | "down") => void
  onReset: () => void
}

export function ColumnConfigPopover({
  columnConfig,
  onToggle,
  onMove,
  onReset,
}: ColumnConfigPopoverProps) {
  const visibleCount = columnConfig.filter((c) => c.visible).length

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="icon-xs" aria-label="Configure columns">
            <Settings2 />
          </Button>
        }
      />
      <PopoverContent className="w-56 p-2">
        <div className="flex flex-col gap-0.5">
          {columnConfig.map((col, idx) => {
            const def = COLUMN_DEFS[col.id]
            const isLastVisible = col.visible && visibleCount <= 1
            return (
              <div
                key={col.id}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
              >
                <Checkbox
                  checked={col.visible}
                  onCheckedChange={() => onToggle(col.id)}
                  disabled={isLastVisible}
                  aria-label={`Show ${def.label}`}
                />
                <span className="flex-1 text-sm">{def.label}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onMove(col.id, "up")}
                  disabled={idx === 0}
                  aria-label={`Move ${def.label} up`}
                >
                  <ChevronUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onMove(col.id, "down")}
                  disabled={idx === columnConfig.length - 1}
                  aria-label={`Move ${def.label} down`}
                >
                  <ChevronDown />
                </Button>
              </div>
            )
          })}
        </div>
        <div className="mt-2 border-t pt-2">
          <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
            Reset to defaults
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
