import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet, useLocation } from "react-router-dom"
import { projectsMenuItems, dashboardMenuItems } from "@/lib/utils"
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Loader } from "@mantine/core";

export default function DashboardLayout() {
  const pathname = useLocation()
  const { profileLoading } = useContext(AuthContext);
  const isProjectRoute = pathname.pathname.startsWith("/projects")
  const menuItems = isProjectRoute ? projectsMenuItems : dashboardMenuItems
  
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader color="grape" type="dots" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-screen">
        <DashboardNav menuItems={menuItems}/>
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
