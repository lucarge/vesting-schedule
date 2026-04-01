import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <SidebarTrigger className="absolute top-4 left-4 z-10" />
        <div className="mx-auto w-full max-w-5xl p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
