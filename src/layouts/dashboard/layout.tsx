import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { AIAssistantDialog } from "@/components/dashboard/ai-assistant-dialog";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/navbar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="min-h-screen dark:bg-slate-950 dark:text-white text-gray-900">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notificationCount={notificationCount}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
          showAIAssistant={() => setShowAIAssistant(true)}
        />

        <main
          className={cn(
            "flex-1 w-full overflow-x-hidden p-4 sm:p-6 transition-all duration-300 ease-in-out",
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