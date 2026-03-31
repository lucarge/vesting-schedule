import { useTheme } from "@/components/theme-provider"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

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
    </div>
  )
}
