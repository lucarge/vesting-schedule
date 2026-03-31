import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="mx-auto w-full max-w-5xl p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
