import { GrantForm } from "@/components/grant-form"
import { GrantTable } from "@/components/grant-table"
import { useGrants } from "@/hooks/use-grants"

export function App() {
  const { grants, addGrant, removeGrant, totals } = useGrants()

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">VSOP Vesting Tracker</h1>
        <p className="text-sm text-muted-foreground">
          Track your virtual stock option grants and vesting schedules.
        </p>
      </div>
      <GrantForm onAddGrant={addGrant} />
      <GrantTable grants={grants} totals={totals} onRemoveGrant={removeGrant} />
      <div className="font-mono text-xs text-muted-foreground">
        (Press <kbd>d</kbd> to toggle dark mode)
      </div>
    </div>
  )
}

export default App
