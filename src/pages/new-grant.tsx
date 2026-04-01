import { useNavigate } from "react-router-dom"

import { GrantForm } from "@/components/grant-form"
import { useGrants } from "@/hooks/use-grants"
import type { Grant } from "@/types/grant"

export function NewGrantPage() {
  const { addGrant } = useGrants()
  const navigate = useNavigate()

  function handleAddGrant(grant: Grant) {
    addGrant(grant)
    navigate("/grants")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Add Grant</h1>
        <p className="text-sm text-muted-foreground">
          Add a new virtual stock option grant.
        </p>
      </div>
      <GrantForm onAddGrant={handleAddGrant} />
    </div>
  )
}
