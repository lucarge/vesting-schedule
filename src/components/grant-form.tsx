import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
}

interface GrantFormProps {
  onAddGrant: (grant: Grant) => void
}

export function GrantForm({ onAddGrant }: GrantFormProps) {
  const [form, setForm] = useState<GrantFormData>(defaultFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof GrantFormData, string>>>({})
  const [datePickerOpen, setDatePickerOpen] = useState(false)

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

    return Object.keys(errs).length > 0 ? errs : null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const validationErrors = validate()
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }

    const grant: Grant = {
      id: crypto.randomUUID(),
      grantDate: form.grantDate!,
      vestingSchedule: form.vestingSchedule,
      vestingPeriodMonths: parseInt(form.vestingPeriodMonths),
      cliffMonths: parseInt(form.cliffMonths),
      grantedAmount: parseInt(form.grantedAmount),
      vsopsValue: parseFloat(form.vsopsValue),
      vsopsStrikePrice: parseFloat(form.vsopsStrikePrice),
    }

    onAddGrant(grant)
    setForm(defaultFormData)
    setErrors({})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Grant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Field label="Grant date" error={errors.grantDate}>
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

          <Field label="Vesting schedule" error={errors.vestingSchedule}>
            <Select
              value={form.vestingSchedule}
              onChange={(e) => updateField("vestingSchedule", e.target.value as VestingSchedule)}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </Field>

          <Field label="Vesting period (months)" error={errors.vestingPeriodMonths}>
            <Input
              type="number"
              min={1}
              value={form.vestingPeriodMonths}
              onChange={(e) => updateField("vestingPeriodMonths", e.target.value)}
              aria-invalid={!!errors.vestingPeriodMonths}
            />
          </Field>

          <Field label="Cliff (months)" error={errors.cliffMonths}>
            <Input
              type="number"
              min={0}
              value={form.cliffMonths}
              onChange={(e) => updateField("cliffMonths", e.target.value)}
              aria-invalid={!!errors.cliffMonths}
            />
          </Field>

          <Field label="Number of shares" error={errors.grantedAmount}>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 10000"
              value={form.grantedAmount}
              onChange={(e) => updateField("grantedAmount", e.target.value)}
              aria-invalid={!!errors.grantedAmount}
            />
          </Field>

          <Field label="Total value (EUR)" error={errors.vsopsValue}>
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="e.g. 50000"
              value={form.vsopsValue}
              onChange={(e) => updateField("vsopsValue", e.target.value)}
              aria-invalid={!!errors.vsopsValue}
            />
          </Field>

          <Field label="Strike price (EUR)" error={errors.vsopsStrikePrice}>
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

          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Add Grant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
