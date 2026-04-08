import { useState } from "react"
import { Link } from "react-router-dom"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GrantTable } from "@/components/grant-table"
import { EditGrantDialog } from "@/components/edit-grant-dialog"
import { useGrants } from "@/hooks/use-grants"
import { useValuations } from "@/hooks/use-valuations"
import type { Grant } from "@/types/grant"

export function GrantsPage() {
  const { grants, updateGrant, removeGrant, totals } = useGrants()
  const { valuations } = useValuations()
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Grants</h1>
          <p className="text-sm text-muted-foreground">
            Manage your virtual stock option grants.
          </p>
        </div>
        <Button render={<Link to="/grants/new" />}>
          <PlusIcon className="mr-1.5 size-4" />
          Add Grant
        </Button>
      </div>
      <GrantTable
        grants={grants}
        totals={totals}
        valuations={valuations}
        onEditGrant={setEditingGrant}
        onRemoveGrant={removeGrant}
      />
      <EditGrantDialog
        grant={editingGrant}
        open={editingGrant !== null}
        onOpenChange={(open) => {
          if (!open) setEditingGrant(null)
        }}
        onUpdateGrant={updateGrant}
      />
    </div>
  )
}
