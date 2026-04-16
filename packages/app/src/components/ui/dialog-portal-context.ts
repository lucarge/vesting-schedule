import { createContext, useContext } from "react"

const DialogPortalContainerContext = createContext<HTMLElement | null>(null)

export function useDialogPortalContainer() {
  return useContext(DialogPortalContainerContext)
}

export { DialogPortalContainerContext }
