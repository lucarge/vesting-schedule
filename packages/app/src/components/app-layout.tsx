import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <div className="p-4 lg:absolute lg:top-4 lg:left-4 lg:z-10 lg:p-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={<SidebarTrigger />}
              />
              <TooltipContent side="right">
                Toggle Sidebar <kbd data-slot="kbd">⌘B</kbd>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mx-auto w-full max-w-5xl px-6 pb-6 lg:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
