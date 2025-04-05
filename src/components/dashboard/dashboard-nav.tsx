import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { BarChart2, Calendar, Home, LayoutGrid, Settings, Users2, PlaySquare } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Proyectos",
    href: "/dashboard/projects",
    icon: LayoutGrid,
  },
  {
    title: "Planning Poker",
    href: "/dashboard/planning-poker",
    icon: PlaySquare,
  },
  {
    title: "Equipos",
    href: "/dashboard/teams",
    icon: Users2,
  },
]

export function DashboardNav() {
  const pathname = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-2 py-4">
        <Link to="/" className="flex items-center gap-2 px-4">
          <div className="h-8 w-8 rounded bg-blue-600" />
          <span className="text-xl font-bold">TaskMate</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.pathname === item.href}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

