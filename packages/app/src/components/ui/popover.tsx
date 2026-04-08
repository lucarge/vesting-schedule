import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

function PopoverContent({
  className,
  sideOffset = 8,
  container,
  ...props
}: PopoverPrimitive.Popup.Props & {
  sideOffset?: number
  container?: PopoverPrimitive.Portal.Props["container"]
}) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Positioner sideOffset={sideOffset}>
        <PopoverPrimitive.Popup
          className={cn(
            "z-50 w-auto rounded-xl border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
