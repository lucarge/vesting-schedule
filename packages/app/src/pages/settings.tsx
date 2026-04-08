import { useRef, useState } from "react"
import { Download, Trash2, Upload } from "lucide-react"
import { format } from "date-fns"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BackupData {
  version: number
  grants: unknown[]
  valuations?: unknown[]
  columnConfig?: unknown[]
  theme?: string
}

function isValidBackup(data: unknown): data is BackupData {
  return (
    typeof data === "object" &&
    data !== null &&
    "version" in data &&
    ((data as BackupData).version === 1 || (data as BackupData).version === 2) &&
    "grants" in data &&
    Array.isArray((data as BackupData).grants)
  )
}

function exportData() {
  const backup: BackupData = {
    version: 2,
    grants: JSON.parse(localStorage.getItem("vsop-grants") || "[]"),
    valuations: JSON.parse(localStorage.getItem("vsop-valuations") || "[]"),
    columnConfig: JSON.parse(
      localStorage.getItem("vsop-column-config") || "[]",
    ),
    theme: localStorage.getItem("theme") || undefined,
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `vsop-backup-${format(new Date(), "yyyy-MM-dd")}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [pendingBackup, setPendingBackup] = useState<BackupData | null>(null)
  const [pendingClear, setPendingClear] = useState(false)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setImportError(null)
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        if (!isValidBackup(data)) {
          setImportError("Invalid backup file.")
          return
        }
        setPendingBackup(data)
      } catch {
        setImportError("Could not parse the file as JSON.")
      }
    }
    reader.readAsText(file)
    // Reset so the same file can be selected again
    e.target.value = ""
  }

  function applyBackup(backup: BackupData) {
    localStorage.setItem("vsop-grants", JSON.stringify(backup.grants))
    if (backup.valuations) {
      localStorage.setItem("vsop-valuations", JSON.stringify(backup.valuations))
    }
    if (backup.columnConfig) {
      localStorage.setItem(
        "vsop-column-config",
        JSON.stringify(backup.columnConfig),
      )
    }
    if (backup.theme) {
      localStorage.setItem("theme", backup.theme)
    }
    setPendingBackup(null)
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your preferences.
        </p>
      </div>
      <div className="max-w-sm space-y-2">
        <Label htmlFor="theme-select">Theme</Label>
        <Select
          value={theme}
          onValueChange={(value) => {
            if (value) setTheme(value)
          }}
        >
          <SelectTrigger id="theme-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          You can also press <kbd>d</kbd> to toggle between light and dark mode.
        </p>
      </div>
      <div className="max-w-sm space-y-2">
        <Label>Data</Label>
        <p className="text-xs text-muted-foreground">
          Export or import your grants and preferences.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="mr-1.5 size-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-1.5 size-4" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        {importError && (
          <p className="text-xs text-destructive">{importError}</p>
        )}
        {pendingBackup && (
          <div className="rounded-md border border-border bg-muted/50 p-3 space-y-2">
            <p className="text-xs">
              This will replace all your current data ({pendingBackup.grants.length}{" "}
              {pendingBackup.grants.length === 1 ? "grant" : "grants"} in
              backup). Continue?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => applyBackup(pendingBackup)}
              >
                Replace data
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPendingBackup(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="max-w-sm space-y-2">
        <Label>Danger zone</Label>
        <p className="text-xs text-muted-foreground">
          Permanently delete all grants and preferences.
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setPendingClear(true)}
        >
          <Trash2 className="mr-1.5 size-4" />
          Clear all data
        </Button>
        {pendingClear && (
          <div className="rounded-md border border-destructive bg-muted/50 p-3 space-y-2">
            <p className="text-xs">
              This will permanently delete all your grants, valuations, column
              preferences, and theme settings. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  localStorage.removeItem("vsop-grants")
                  localStorage.removeItem("vsop-valuations")
                  localStorage.removeItem("vsop-column-config")
                  localStorage.removeItem("vsop-sort-config")
                  localStorage.removeItem("vsop-cumulative-chart-mode")
                  localStorage.removeItem("theme")
                  window.location.reload()
                }}
              >
                Clear all data
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPendingClear(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
