import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Settings } from 'lucide-react'
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

interface MenuItemProps {
  menuItems: {
    title: string
    href: string
    icon: React.ElementType
  }[]
}

export function DashboardNav({ menuItems }: MenuItemProps ) {
  const pathname = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-2">
        <Link to="/" className="flex items-center gap-2 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-xl">
            <img src="/image/taskmate-x.png" alt="TaskMate Logo" width={32} height={32} />
          </div>
          <span className="text-xl font-bold">TaskMate</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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

