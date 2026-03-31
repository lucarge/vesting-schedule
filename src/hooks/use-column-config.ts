import { useEffect, useMemo, useState } from "react"

import {
  COLUMN_DEFS,
  DEFAULT_COLUMN_CONFIG,
  type ColumnConfig,
  type ColumnDef,
  type ColumnId,
} from "@/lib/columns"

const STORAGE_KEY = "vsop-column-config"

const ALL_COLUMN_IDS = new Set(Object.keys(COLUMN_DEFS) as ColumnId[])

function loadConfig(): ColumnConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_COLUMN_CONFIG

    const stored: ColumnConfig[] = JSON.parse(raw)
    // Remove stale IDs
    const valid = stored.filter((c) => ALL_COLUMN_IDS.has(c.id))
    // Append any new IDs not in stored config
    const storedIds = new Set(valid.map((c) => c.id))
    for (const id of ALL_COLUMN_IDS) {
      if (!storedIds.has(id)) {
        valid.push({ id, visible: true })
      }
    }
    return valid
  } catch {
    return DEFAULT_COLUMN_CONFIG
  }
}

export function useColumnConfig() {
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(loadConfig)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columnConfig))
  }, [columnConfig])

  const visibleColumns: ColumnDef[] = useMemo(
    () =>
      columnConfig
        .filter((c) => c.visible)
        .map((c) => COLUMN_DEFS[c.id]),
    [columnConfig],
  )

  const toggleColumn = (id: ColumnId) => {
    setColumnConfig((prev) => {
      const visibleCount = prev.filter((c) => c.visible).length
      const target = prev.find((c) => c.id === id)
      // Prevent hiding the last visible column
      if (target?.visible && visibleCount <= 1) return prev
      return prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    })
  }

  const moveColumn = (id: ColumnId, direction: "up" | "down") => {
    setColumnConfig((prev) => {
      const idx = prev.findIndex((c) => c.id === id)
      const swapIdx = direction === "up" ? idx - 1 : idx + 1
      if (idx < 0 || swapIdx < 0 || swapIdx >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })
  }

  const resetToDefaults = () => {
    setColumnConfig(DEFAULT_COLUMN_CONFIG)
  }

  return { columnConfig, visibleColumns, toggleColumn, moveColumn, resetToDefaults }
}
