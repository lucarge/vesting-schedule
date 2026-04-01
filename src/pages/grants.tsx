import { Link } from "react-router-dom"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GrantTable } from "@/components/grant-table"
import { useGrants } from "@/hooks/use-grants"

export function GrantsPage() {
  const { grants, removeGrant, totals } = useGrants()

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
      <GrantTable grants={grants} totals={totals} onRemoveGrant={removeGrant} />
    </div>
  )
}
