import { useRef, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ValuationEntry } from "@/types/valuation"

interface ValuationFormData {
  date: Date | undefined
  valuation: string
  amountRaised: string
}

const defaultFormData: ValuationFormData = {
  date: new Date(),
  valuation: "",
  amountRaised: "",
}

function entryToFormData(entry: ValuationEntry): ValuationFormData {
  return {
    date: entry.date,
    valuation: String(entry.valuation),
    amountRaised: entry.amountRaised ? String(entry.amountRaised) : "",
  }
}

interface ValuationFormProps {
  onAdd?: (entry: ValuationEntry) => void
  initialEntry?: ValuationEntry
  onUpdate?: (entry: ValuationEntry) => void
  className?: string
}

export function ValuationForm({ onAdd, initialEntry, onUpdate, className }: ValuationFormProps) {
  const isEditing = !!initialEntry
  const [form, setForm] = useState<ValuationFormData>(
    initialEntry ? entryToFormData(initialEntry) : defaultFormData,
  )
  const [errors, setErrors] = useState<Partial<Record<keyof ValuationFormData, string>>>({})
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  function updateField<K extends keyof ValuationFormData>(key: K, value: ValuationFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function validate(): Partial<Record<keyof ValuationFormData, string>> | null {
    const errs: Partial<Record<keyof ValuationFormData, string>> = {}
    if (!form.date) errs.date = "Required"
    const val = parseFloat(form.valuation)
    if (!form.valuation || isNaN(val) || val <= 0) {
      errs.valuation = "Must be greater than 0"
    }
    if (form.amountRaised) {
      const raised = parseFloat(form.amountRaised)
      if (isNaN(raised) || raised <= 0) {
        errs.amountRaised = "Must be greater than 0"
      }
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

    const amountRaised = form.amountRaised
      ? parseFloat(form.amountRaised)
      : undefined

    const entry: ValuationEntry = {
      id: isEditing ? initialEntry.id : crypto.randomUUID(),
      date: form.date!,
      valuation: parseFloat(form.valuation),
      amountRaised,
    }

    if (isEditing) {
      onUpdate?.(entry)
    } else {
      onAdd?.(entry)
      setForm(defaultFormData)
      setErrors({})
    }
  }

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <TooltipProvider>
      <form ref={formRef} onSubmit={handleSubmit} className={cn("grid gap-4", isEditing ? "grid-cols-1" : "grid-cols-[1fr_1fr_1fr_auto] items-end", className)}>
        <Field label="Date" tooltip="The effective date of this valuation" error={errors.date}>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.date && "text-muted-foreground",
                  )}
                  aria-invalid={!!errors.date}
                />
              }
            >
              <CalendarIcon className="mr-1.5 size-4" />
              {form.date ? format(form.date, "MMM d, yyyy") : "Pick a date"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" container={isEditing ? formRef.current : undefined}>
              <Calendar
                mode="single"
                captionLayout="dropdown"
                startMonth={new Date(2010, 0)}
                endMonth={new Date(2040, 11)}
                selected={form.date}
                onSelect={(date) => {
                  updateField("date", date)
                  setDatePickerOpen(false)
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Company valuation (EUR)" tooltip="Pre-money company valuation at this date" error={errors.valuation}>
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 10000000"
            value={form.valuation}
            onChange={(e) => updateField("valuation", e.target.value)}
            aria-invalid={!!errors.valuation}
          />
        </Field>

        <Field label="Amount raised (EUR)" tooltip="Optional — capital raised in this round, used to calculate dilution" error={errors.amountRaised}>
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 2000000"
            value={form.amountRaised}
            onChange={(e) => updateField("amountRaised", e.target.value)}
            aria-invalid={!!errors.amountRaised}
          />
        </Field>

        <Button type="submit" className={isEditing ? "w-full" : undefined}>
          {isEditing ? "Save" : "Add"}
        </Button>
      </form>
    </TooltipProvider>
  )
}

function Field({
  label,
  tooltip,
  error,
  children,
}: {
  label: string
  tooltip?: string
  error?: string
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
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
