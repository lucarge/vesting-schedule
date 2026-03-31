import { useMemo, useState } from "react"

import type { Grant } from "@/types/grant"

export interface GrantTotals {
  totalGrantedAmount: number
  totalVsopsValue: number
  totalStrikeCost: number
}

export function useGrants() {
  const [grants, setGrants] = useState<Grant[]>([])

  const addGrant = (grant: Grant) => {
    setGrants((prev) => [...prev, grant])
  }

  const removeGrant = (id: string) => {
    setGrants((prev) => prev.filter((g) => g.id !== id))
  }

  const totals: GrantTotals = useMemo(
    () => ({
      totalGrantedAmount: grants.reduce((sum, g) => sum + g.grantedAmount, 0),
      totalVsopsValue: grants.reduce((sum, g) => sum + g.vsopsValue, 0),
      totalStrikeCost: grants.reduce(
        (sum, g) => sum + g.vsopsStrikePrice * g.grantedAmount,
        0,
      ),
    }),
    [grants],
  )

  return { grants, addGrant, removeGrant, totals }
}
