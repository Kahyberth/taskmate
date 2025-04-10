import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { AIAssistantDialog } from "@/components/dashboard/ai-assistant-dialog";
import { Outlet } from "react-router-dom";
import { TeamDashboardSidebar } from "@/components/teams-dashboard/dashboard-sidebar";

export default function TeamDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notificationCount={notificationCount}
      />

      <div className="flex flex-1 overflow-hidden">
        <TeamDashboardSidebar
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
          showAIAssistant={() => setShowAIAssistant(true)}
        />

        <main
          className={cn(
            "flex-1 w-full overflow-x-hidden px-4 sm:px-6 md:px-8 transition-all duration-300 ease-in-out ",
            sidebarOpen ? "md:ml-64" : "ml-0"
          )}
        >
          <Outlet />
        </main>
      </div>

      <AIAssistantDialog
        open={showAIAssistant}
        onOpenChange={setShowAIAssistant}
      />
    </div>
  );
}
