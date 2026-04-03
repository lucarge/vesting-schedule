import { DayPicker } from "react-day-picker"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn("p-0", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex h-9 items-center justify-center px-8",
        caption_label: "inline-flex items-center text-sm font-medium",
        dropdowns: "flex items-center gap-1.5",
        dropdown_root:
          "relative inline-flex items-center rounded-md border border-border bg-transparent px-2 py-1 text-sm font-medium transition-colors hover:bg-muted dark:border-input",
        dropdown: "absolute inset-0 cursor-pointer opacity-0",
        chevron: "",
        nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon-xs" }),
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon-xs" }),
        ),
        month_grid: "mx-auto w-max border-collapse",
        weekdays: "flex",
        weekday:
          "w-8 text-[0.8rem] font-normal text-muted-foreground text-center",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-8 rounded-md font-normal",
        ),
        selected:
          "[&>.rdp-day_button]:bg-primary [&>.rdp-day_button]:text-primary-foreground [&>.rdp-day_button]:hover:bg-primary [&>.rdp-day_button]:hover:text-primary-foreground",
        today:
          "[&>.rdp-day_button]:bg-accent [&>.rdp-day_button]:text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "down")
            return (
              <ChevronDown className="ml-0.5 size-3.5 text-muted-foreground" />
            )
          return orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
