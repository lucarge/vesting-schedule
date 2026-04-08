import type { ReactNode } from "react"

import type { GrantTotals } from "@/hooks/use-grants"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import type { GrantWithValuation } from "@/lib/valuation"

const SCHEDULE_LABELS: Record<GrantWithValuation["vestingSchedule"], string> = {
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
  | "netValue"
  | "appreciation"
  | "ownership"

export interface ColumnTotals extends GrantTotals {
  totalOwnership: number
}

export interface ColumnDef {
  id: ColumnId
  label: string
  align: "left" | "right"
  tooltip?: string
  footerColor?: "green" | "red"
  sortValue?: (grant: GrantWithValuation) => number | string
  renderCell: (grant: GrantWithValuation) => ReactNode
  renderFooter?: (totals: ColumnTotals) => ReactNode
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
    tooltip: "The date the stock option grant was issued",
    sortValue: (grant) => grant.grantDate.getTime(),
    renderCell: (grant) => formatDate(grant.grantDate),
  },
  schedule: {
    id: "schedule",
    label: "Schedule",
    align: "left",
    tooltip: "How often shares vest (monthly, quarterly, or yearly)",
    sortValue: (grant) => grant.vestingSchedule,
    renderCell: (grant) => SCHEDULE_LABELS[grant.vestingSchedule],
  },
  vestingPeriod: {
    id: "vestingPeriod",
    label: "Vesting Period",
    align: "right",
    tooltip: "Total duration over which shares vest",
    sortValue: (grant) => grant.vestingPeriodMonths,
    renderCell: (grant) => `${grant.vestingPeriodMonths} mo`,
  },
  cliff: {
    id: "cliff",
    label: "Cliff",
    align: "right",
    tooltip: "Initial period before any shares vest",
    sortValue: (grant) => grant.cliffMonths,
    renderCell: (grant) => `${grant.cliffMonths} mo`,
  },
  shares: {
    id: "shares",
    label: "Shares",
    align: "right",
    tooltip: "Total number of shares granted",
    sortValue: (grant) => grant.grantedAmount,
    renderCell: (grant) => formatNumber(grant.grantedAmount),
    renderFooter: (totals) => formatNumber(totals.totalGrantedAmount),
  },
  value: {
    id: "value",
    label: "Value",
    align: "right",
    tooltip: "Total value of the granted shares",
    footerColor: "green",
    sortValue: (grant) => grant.vsopsValue,
    renderCell: (grant) => formatCurrency(grant.vsopsValue),
    renderFooter: (totals) => formatCurrency(totals.totalVsopsValue),
  },
  strikePrice: {
    id: "strikePrice",
    label: "Strike Price",
    align: "right",
    tooltip:
      "Price per share you pay to exercise. Total in footer = strike price \u00D7 shares",
    footerColor: "red",
    sortValue: (grant) => grant.vsopsStrikePrice,
    renderCell: (grant) => formatCurrency(grant.vsopsStrikePrice),
    renderFooter: (totals) => formatCurrency(totals.totalStrikeCost),
  },
  netValue: {
    id: "netValue",
    label: "Net Value",
    align: "right",
    tooltip:
      "Value minus total strike cost (what you'd earn if exercised). Taxes may still apply depending on your jurisdiction and are not accounted for here",
    footerColor: "green",
    sortValue: (grant) =>
      grant.vsopsValue - grant.vsopsStrikePrice * grant.grantedAmount,
    renderCell: (grant) =>
      formatCurrency(
        grant.vsopsValue - grant.vsopsStrikePrice * grant.grantedAmount,
      ),
    renderFooter: (totals) =>
      formatCurrency(totals.totalVsopsValue - totals.totalStrikeCost),
  },
  appreciation: {
    id: "appreciation",
    label: "Appreciation",
    align: "right",
    tooltip:
      "How much the grant's value has grown based on company valuation changes",
    sortValue: (grant) => {
      if (!grant.applicableValuation || !grant.latestValuation) return 0
      return (
        ((grant.latestValuation - grant.applicableValuation) /
          grant.applicableValuation) *
        100
      )
    },
    renderCell: (grant) => {
      if (!grant.applicableValuation || !grant.latestValuation) return "—"
      const pct =
        ((grant.latestValuation - grant.applicableValuation) /
          grant.applicableValuation) *
        100
      const sign = pct >= 0 ? "+" : ""
      const color =
        pct >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400"
      return <span className={color}>{sign}{pct.toFixed(2)}%</span>
    },
  },
  ownership: {
    id: "ownership",
    label: "Ownership",
    align: "right",
    tooltip: "Percentage of the company represented by this grant",
    sortValue: (grant) =>
      grant.applicableValuation
        ? (grant.vsopsValue / grant.applicableValuation) * 100
        : 0,
    renderCell: (grant) =>
      grant.applicableValuation
        ? `${((grant.vsopsValue / grant.applicableValuation) * 100).toFixed(4)}%`
        : "—",
    renderFooter: (totals) =>
      totals.totalOwnership ? `${totals.totalOwnership.toFixed(4)}%` : "—",
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
  { id: "netValue", visible: true },
  { id: "appreciation", visible: true },
  { id: "ownership", visible: true },
]
