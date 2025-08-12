import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { AIAssistantDialog } from "@/components/dashboard/ai-assistant-dialog";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/navbar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const location = useLocation();

  const isChatPage = location.pathname.includes('/chat');

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
    <div className={cn(
      isChatPage ? "h-screen bg-white" : "min-h-screen dark:bg-slate-950 dark:text-white text-gray-900"
    )}>
      {!isChatPage && (
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      <div className={cn("flex flex-1", isChatPage ? "h-full" : "overflow-hidden")}>
        {!isChatPage && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
            showAIAssistant={() => setShowAIAssistant(true)}
          />
        )}

        <main
          className={cn(
            "flex-1 w-full transition-all duration-300 ease-in-out",
            isChatPage ? "h-full" : (sidebarOpen ? "md:ml-64" : "ml-0 overflow-x-hidden p-4 sm:p-6")
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