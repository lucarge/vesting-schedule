import { cn } from "@/lib/utils"

function Select({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex h-8 w-full appearance-none rounded-lg border border-border bg-transparent px-2.5 text-sm transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-input dark:bg-input/30 dark:focus-visible:border-ring",
        className,
      )}
      {...props}
    />
  )
}

export { Select }
