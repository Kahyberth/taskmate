import { useState, useEffect, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { AIAssistantDialog } from "@/components/dashboard/ai-assistant-dialog";
import { Widget } from "@/components/dashboard/widgets/widget";
import { widgetTypes } from "@/data/dashboard-data";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AIInsightsWidget } from "@/components/dashboard/widgets/allsights-chart";
import { ProjectSelector } from "@/components/dashboard/project-selector";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeWidgets, setActiveWidgets] = useState([
    "taskCompletion",
    "projectProgress",
    "timeAllocation",
    "upcomingTasks",
    "aiInsights",
  ]);
  const [widgetSizes, setWidgetSizes] = useState({
    taskCompletion: "large",
    projectProgress: "medium",
    timeAllocation: "medium",
    teamPerformance: "large",
    upcomingTasks: "medium",
    recentActivity: "medium",
    aiInsights: "medium",
    notifications: "small",
  });
  const [dashboardRefreshRate, setDashboardRefreshRate] = useState(30);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refreshing dashboard data...");
    }, dashboardRefreshRate * 1000);

    return () => clearInterval(interval);
  }, [dashboardRefreshRate]);

  const toggleWidget = (widgetId: string) => {
    if (activeWidgets.includes(widgetId)) {
      setActiveWidgets(activeWidgets.filter((id) => id !== widgetId));
    } else {
      setActiveWidgets([...activeWidgets, widgetId]);
    }

    toast({
      title: activeWidgets.includes(widgetId)
        ? "Widget removed"
        : "Widget added",
      description: activeWidgets.includes(widgetId)
        ? `The ${
            widgetTypes.find((w) => w.id === widgetId)?.name ?? "Unknown"
          } widget has been removed.`
        : `The ${
            widgetTypes.find((w) => w.id === widgetId)?.name ?? "Unknown"
          } widget has been added.`,
    });
  };

  const changeWidgetSize = (widgetId: string, size: string) => {
    setWidgetSizes({
      ...widgetSizes,
      [widgetId]: size,
    });
  };

  const getWidgetSizeClass = (widgetId: keyof typeof widgetSizes) => {
    const size = widgetSizes[widgetId];
    switch (size) {
      case "small":
        return "col-span-1";
      case "medium":
        return "col-span-1 md:col-span-2";
      case "large":
        return "col-span-1 md:col-span-4";
      default:
        return "col-span-1 md:col-span-2";
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning 🌤️";
    } else if (hour < 18) {
      return "Good afternoon 🌞";
    } else {
      return "Good night 🌙";
    }
  };
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-gray-900 dark:text-gray-200">
          <h1 className="text-2xl font-bold">{getGreeting()}</h1>
          <h2 className="text-lg font-semibold">
            Welcome back, {user?.name ?? "User"}
          </h2>
          <h3>
            <span className="text-sm font-semibold">
              Today is{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </h3>
          <p className="pb-2">
            Here's what's happening with your projects today.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <ProjectSelector 
            selectedProjectId={selectedProjectId} 
            onProjectChange={setSelectedProjectId} 
          />
        </div>
      </div>

      <StatsCards selectedProjectId={selectedProjectId} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeWidgets.includes("taskCompletion") && (
          <Widget
            size={getWidgetSizeClass("taskCompletion")}
            isLoading={isLoading}
            onChangeSize={(size) => changeWidgetSize("taskCompletion", size)}
            onRemove={() => toggleWidget("taskCompletion")}
            widgetType="taskCompletion"
            label="Task Completion"
            selectedProjectId={selectedProjectId}
          />
        )}

        {activeWidgets.includes("projectProgress") && (
          <Widget
            size={getWidgetSizeClass("projectProgress")}
            isLoading={isLoading}
            onChangeSize={(size) => changeWidgetSize("projectProgress", size)}
            onRemove={() => toggleWidget("projectProgress")}
            label="Project Progress" 
            widgetType="projectProgress"
            selectedProjectId={selectedProjectId}
          />
        )}

        {activeWidgets.includes("aiInsights") && (
          <AIInsightsWidget
            size={getWidgetSizeClass("aiInsights")}
            isLoading={isLoading}
            onChangeSize={(size: string) => changeWidgetSize("aiInsights", size)}
            onRemove={() => toggleWidget("aiInsights")}
            label="AI Insights"
            widgetType="aiInsights"
            setShowAIAssistant={setShowAIAssistant}
            selectedProjectId={selectedProjectId}
          />
        )}

        {/* {activeWidgets.includes("upcomingTasks") && (
          <Widget
            size={getWidgetSizeClass("upcomingTasks")}
            isLoading={isLoading}
            onChangeSize={(size) => changeWidgetSize("upcomingTasks", size)}
            onRemove={() => toggleWidget("upcomingTasks")}
            label="Upcoming Tasks"
            widgetType="upcomingTasks"
            selectedProjectId={selectedProjectId}
          />
        )} */}
      </div>

      <AIAssistantDialog
        open={showAIAssistant}
        onOpenChange={setShowAIAssistant}
      />
    </div>
  );
}