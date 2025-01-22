import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-screen">
        <DashboardNav />
        <div className="flex w-full flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 bg-gray-50/40 w-full p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
