import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { cn, projectItems, teamDashboardMenuItems, dashboardMenuItems } from "@/lib/utils";

interface SidebarProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  showAIAssistant?: () => void;
}

export function Sidebar({
  sidebarOpen,
  isMobile,
  showAIAssistant,
}: SidebarProps) {
  const { pathname } = useLocation();
  const isTeamRoute = pathname.startsWith("/teams");
  const isProjectRoute = pathname.startsWith("/dashboard/projects");
  const menuItems = isTeamRoute ? teamDashboardMenuItems : dashboardMenuItems;

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r border-black/10 dark:border-white/10 dark:bg-black/20 bg-white backdrop-blur-md transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        isMobile && !sidebarOpen && "hidden"
      )}
    >
      <nav className="p-4">
        {/* Navegación Principal */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href} className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Lista de Proyectos (solo en dashboard) */}
        {!isProjectRoute && (
          <div className="mt-8">
            <h3 className="mb-2 px-4 text-xs font-semibold dark:text-white/50 text-black/50">
              PROYECTOS RECIENTES
            </h3>
            <div className="space-y-1">
              {projectItems.map((project) => (
                <Link key={project.href} to={project.href} className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className={`mr-2 h-2 w-2 rounded-full ${project.color}`} />
                    {project.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sección del AI Assistant */}
        <div className="mt-auto pt-8 relative">
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-700/90 to-purple-800/30 border border-white/20 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105">
            {/* Capas de ondas */}
            <div className="absolute inset-0 wave-overlay wave-overlay-1 pointer-events-none"></div>
            <div className="absolute inset-0 wave-overlay wave-overlay-2 pointer-events-none"></div>

            <CardHeader className="relative pb-2">
              <CardTitle className="flex items-center text-sm font-semibold text-white">
                <Sparkles className="mr-2 h-5 w-5 text-purple-300" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-xs text-white/80">
                Ask me anything about your tasks, projects, or productivity
                insights.
              </p>
              <Button
                className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-md"
                onClick={showAIAssistant}
              >
                Open Assistant
              </Button>
            </CardContent>
          </Card>
          <style>{`
    @keyframes wave1 {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
    @keyframes wave2 {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
    .wave-overlay {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.25),
        transparent
      );
      filter: blur(2px);
    }
    .wave-overlay-1 {
      opacity: 0.4;
      animation: wave1 6s linear infinite;
    }
    .wave-overlay-2 {
      opacity: 0.3;
      animation: wave2 10s linear infinite;
    }
  `}</style>
        </div>
      </nav>
    </aside>
  );
}
