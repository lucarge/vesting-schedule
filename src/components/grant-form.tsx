import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Grant, GrantFormData, VestingSchedule } from "@/types/grant"

const defaultFormData: GrantFormData = {
  grantDate: new Date(),
  vestingSchedule: "monthly",
  vestingPeriodMonths: "48",
  cliffMonths: "12",
  grantedAmount: "",
  vsopsValue: "",
  vsopsStrikePrice: "",
  companyValuation: "",
  ownershipPercentage: "",
}

interface GrantFormProps {
  onAddGrant: (grant: Grant) => void
}

export function GrantForm({ onAddGrant }: GrantFormProps) {
  const [form, setForm] = useState<GrantFormData>(defaultFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof GrantFormData, string>>>({})
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [valueMode, setValueMode] = useState<"total" | "per-share">("total")

  function updateField<K extends keyof GrantFormData>(key: K, value: GrantFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function validate(): Partial<Record<keyof GrantFormData, string>> | null {
    const errs: Partial<Record<keyof GrantFormData, string>> = {}

    if (!form.grantDate) errs.grantDate = "Required"

    const vestingPeriod = parseInt(form.vestingPeriodMonths)
    if (!form.vestingPeriodMonths || isNaN(vestingPeriod) || vestingPeriod < 1) {
      errs.vestingPeriodMonths = "Must be at least 1"
    }

    const cliff = parseInt(form.cliffMonths)
    if (form.cliffMonths === "" || isNaN(cliff) || cliff < 0) {
      errs.cliffMonths = "Must be 0 or more"
    } else if (!isNaN(vestingPeriod) && cliff >= vestingPeriod) {
      errs.cliffMonths = "Must be less than vesting period"
    }

    const amount = parseInt(form.grantedAmount)
    if (!form.grantedAmount || isNaN(amount) || amount < 1) {
      errs.grantedAmount = "Must be at least 1"
    }

    const value = parseFloat(form.vsopsValue)
    if (!form.vsopsValue || isNaN(value) || value <= 0) {
      errs.vsopsValue = "Must be greater than 0"
    }

    const strike = parseFloat(form.vsopsStrikePrice)
    if (!form.vsopsStrikePrice || isNaN(strike) || strike <= 0) {
      errs.vsopsStrikePrice = "Must be greater than 0"
    }

    // Valuation is optional, but if provided must be > 0
    if (form.companyValuation) {
      const valuation = parseFloat(form.companyValuation)
      if (isNaN(valuation) || valuation <= 0) {
        errs.companyValuation = "Must be greater than 0"
      }
    }

    // Ownership is optional, but if provided must be between 0 and 100
    if (form.ownershipPercentage) {
      const ownership = parseFloat(form.ownershipPercentage)
      if (isNaN(ownership) || ownership <= 0 || ownership > 100) {
        errs.ownershipPercentage = "Must be between 0 and 100"
      }
    }

    // If both are provided, they must be consistent — but we just let valuation win
    // No cross-field error needed

    return Object.keys(errs).length > 0 ? errs : null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const validationErrors = validate()
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }

    const totalValue =
      valueMode === "per-share"
        ? parseFloat(form.vsopsValue) * parseInt(form.grantedAmount)
        : parseFloat(form.vsopsValue)

    let companyValuation: number | undefined
    if (form.companyValuation) {
      companyValuation = parseFloat(form.companyValuation)
    } else if (form.ownershipPercentage) {
      // ownership% = (value / valuation) * 100
      // valuation = value / (ownership% / 100)
      companyValuation = totalValue / (parseFloat(form.ownershipPercentage) / 100)
    }

    const grant: Grant = {
      id: crypto.randomUUID(),
      grantDate: form.grantDate!,
      vestingSchedule: form.vestingSchedule,
      vestingPeriodMonths: parseInt(form.vestingPeriodMonths),
      cliffMonths: parseInt(form.cliffMonths),
      grantedAmount: parseInt(form.grantedAmount),
      vsopsValue: totalValue,
      vsopsStrikePrice: parseFloat(form.vsopsStrikePrice),
      companyValuation,
    }

    onAddGrant(grant)
    setForm(defaultFormData)
    setErrors({})
    setValueMode("total")
  }

  const hasValuation = !!form.companyValuation
  const hasOwnership = !!form.ownershipPercentage

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Grant</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <Field label="Grant date" tooltip="The date the stock option grant was issued" error={errors.grantDate}>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.grantDate && "text-muted-foreground",
                      )}
                      aria-invalid={!!errors.grantDate}
                    />
                  }
                >
                  <CalendarIcon className="mr-1.5 size-4" />
                  {form.grantDate ? format(form.grantDate, "MMM d, yyyy") : "Pick a date"}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    startMonth={new Date(2010, 0)}
                    endMonth={new Date(2040, 11)}
                    selected={form.grantDate}
                    onSelect={(date) => {
                      updateField("grantDate", date)
                      setDatePickerOpen(false)
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field label="Vesting schedule" tooltip="How often shares vest (monthly, quarterly, or yearly)" error={errors.vestingSchedule}>
              <Select
                value={form.vestingSchedule}
                onValueChange={(value) => {
                  if (value) updateField("vestingSchedule", value as VestingSchedule)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Vesting period (months)" tooltip="Total duration over which shares vest" error={errors.vestingPeriodMonths}>
              <Input
                type="number"
                min={1}
                value={form.vestingPeriodMonths}
                onChange={(e) => updateField("vestingPeriodMonths", e.target.value)}
                aria-invalid={!!errors.vestingPeriodMonths}
              />
            </Field>

            <Field label="Cliff (months)" tooltip="Initial period before any shares vest" error={errors.cliffMonths}>
              <Input
                type="number"
                min={0}
                value={form.cliffMonths}
                onChange={(e) => updateField("cliffMonths", e.target.value)}
                aria-invalid={!!errors.cliffMonths}
              />
            </Field>

            <Field label="Number of shares" tooltip="Total number of shares in this grant" error={errors.grantedAmount}>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 10000"
                value={form.grantedAmount}
                onChange={(e) => updateField("grantedAmount", e.target.value)}
                aria-invalid={!!errors.grantedAmount}
              />
            </Field>

            <Field
              label="Value (EUR)"
              tooltip="Total monetary value of the granted shares"
              error={errors.vsopsValue}
              trailing={
                <div className="flex rounded-md border border-border text-[0.65rem] leading-none dark:border-input">
                  <button
                    type="button"
                    className={cn(
                      "rounded-l-[5px] px-1.5 py-1 transition-colors",
                      valueMode === "total"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setValueMode("total")}
                  >
                    Total
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-r-[5px] px-1.5 py-1 transition-colors",
                      valueMode === "per-share"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setValueMode("per-share")}
                  >
                    Per share
                  </button>
                </div>
              }
            >
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder={valueMode === "total" ? "e.g. 50000" : "e.g. 5.00"}
                value={form.vsopsValue}
                onChange={(e) => updateField("vsopsValue", e.target.value)}
                aria-invalid={!!errors.vsopsValue}
              />
            </Field>

            <Field label="Strike price (EUR)" tooltip="Price per share you pay to exercise the option" error={errors.vsopsStrikePrice}>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="e.g. 5.00"
                value={form.vsopsStrikePrice}
                onChange={(e) => updateField("vsopsStrikePrice", e.target.value)}
                aria-invalid={!!errors.vsopsStrikePrice}
              />
            </Field>

            <Field
              label="Company valuation (EUR)"
              tooltip="Company valuation at the time of the grant. Optional — only needed to calculate ownership percentage"
              error={errors.companyValuation}
            >
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="e.g. 10000000"
                value={form.companyValuation}
                onChange={(e) => updateField("companyValuation", e.target.value)}
                aria-invalid={!!errors.companyValuation}
                disabled={hasOwnership}
              />
            </Field>

            <Field
              label="Ownership (%)"
              tooltip="Your ownership percentage. Alternative to company valuation — the valuation will be calculated from this"
              error={errors.ownershipPercentage}
            >
              <Input
                type="number"
                min={0}
                max={100}
                step="0.0001"
                placeholder="e.g. 0.5"
                value={form.ownershipPercentage}
                onChange={(e) => updateField("ownershipPercentage", e.target.value)}
                aria-invalid={!!errors.ownershipPercentage}
                disabled={hasValuation}
              />
            </Field>

            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Add Grant
              </Button>
            </div>
          </form>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  tooltip,
  error,
  trailing,
  children,
}: {
  label: string
  tooltip?: string
  error?: string
  trailing?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-5 items-center gap-1.5">
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger render={<Label />} className="underline decoration-dotted decoration-muted-foreground/50 underline-offset-4">
              {label}
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ) : (
          <Label>{label}</Label>
        )}
        {trailing}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
