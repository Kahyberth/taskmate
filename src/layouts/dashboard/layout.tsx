import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { AIAssistantDialog } from "@/components/dashboard/ai-assistant-dialog";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/navbar";
import ChannelsSidebar from "@/components/teams-dashboard/channels-sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const location = useLocation();
  const { team_id } = useParams<{ team_id: string }>();

  // Extraer team_id directamente de la URL como fallback
  const urlTeamId = location.pathname.match(/\/teams\/dashboard\/([^\/]+)/)?.[1];
  const finalTeamId = team_id || urlTeamId;

  const isChatPage = location.pathname.includes('/chat') || location.pathname.endsWith('/chat');

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
      "min-h-screen dark:bg-slate-950 dark:text-white text-gray-900",
      isChatPage ? "h-screen" : ""
    )}>
      {!isChatPage && (
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      <div className={cn("flex flex-1", isChatPage ? "h-full" : "overflow-hidden")}>
        {isChatPage && finalTeamId ? (
          <ChannelsSidebar
            team_id={finalTeamId}
            selectedId={selectedChannelId}
            onSelectChannel={setSelectedChannelId}
            showAIAssistant={() => setShowAIAssistant(true)}
          />
        ) : (
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
          <Outlet context={{ selectedChannelId }} />
        </main>
      </div>

      <AIAssistantDialog
        open={showAIAssistant}
        onOpenChange={setShowAIAssistant}
      />
    </div>
  );
}