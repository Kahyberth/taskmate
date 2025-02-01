import { DashboardNav } from "@/components/projects-dashboard/dashboard-nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function ProjectsDashboardLayout() {
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
