import type { ReactNode } from "react"

import type { Grant } from "@/types/grant"
import type { GrantTotals } from "@/hooks/use-grants"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"

const SCHEDULE_LABELS: Record<Grant["vestingSchedule"], string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
}

export type ColumnId =
  | "grantDate"
  | "schedule"
  | "vestingPeriod"
  | "cliff"
  | "shares"
  | "value"
  | "strikePrice"
  | "valuation"
  | "ownership"

export interface ColumnDef {
  id: ColumnId
  label: string
  align: "left" | "right"
  renderCell: (grant: Grant) => ReactNode
  renderFooter?: (totals: GrantTotals) => ReactNode
}

export interface ColumnConfig {
  id: ColumnId
  visible: boolean
}

export const COLUMN_DEFS: Record<ColumnId, ColumnDef> = {
  grantDate: {
    id: "grantDate",
    label: "Grant Date",
    align: "left",
    renderCell: (grant) => formatDate(grant.grantDate),
  },
  schedule: {
    id: "schedule",
    label: "Schedule",
    align: "left",
    renderCell: (grant) => SCHEDULE_LABELS[grant.vestingSchedule],
  },
  vestingPeriod: {
    id: "vestingPeriod",
    label: "Vesting Period",
    align: "right",
    renderCell: (grant) => `${grant.vestingPeriodMonths} mo`,
  },
  cliff: {
    id: "cliff",
    label: "Cliff",
    align: "right",
    renderCell: (grant) => `${grant.cliffMonths} mo`,
  },
  shares: {
    id: "shares",
    label: "Shares",
    align: "right",
    renderCell: (grant) => formatNumber(grant.grantedAmount),
    renderFooter: (totals) => formatNumber(totals.totalGrantedAmount),
  },
  value: {
    id: "value",
    label: "Value",
    align: "right",
    renderCell: (grant) => formatCurrency(grant.vsopsValue),
    renderFooter: (totals) => formatCurrency(totals.totalVsopsValue),
  },
  strikePrice: {
    id: "strikePrice",
    label: "Strike Price",
    align: "right",
    renderCell: (grant) => formatCurrency(grant.vsopsStrikePrice),
    renderFooter: (totals) => formatCurrency(totals.totalStrikeCost),
  },
  valuation: {
    id: "valuation",
    label: "Valuation",
    align: "right",
    renderCell: (grant) =>
      grant.companyValuation ? formatCurrency(grant.companyValuation) : "—",
  },
  ownership: {
    id: "ownership",
    label: "Ownership",
    align: "right",
    renderCell: (grant) =>
      grant.companyValuation
        ? `${((grant.vsopsValue / grant.companyValuation) * 100).toFixed(4)}%`
        : "—",
  },
}

export const DEFAULT_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "grantDate", visible: true },
  { id: "schedule", visible: true },
  { id: "vestingPeriod", visible: true },
  { id: "cliff", visible: true },
  { id: "shares", visible: true },
  { id: "value", visible: true },
  { id: "strikePrice", visible: true },
  { id: "valuation", visible: true },
  { id: "ownership", visible: true },
]
