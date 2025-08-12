import { useState, useEffect, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { AIAssistantDialog } from "@/components/dashboard/ai-assistant-dialog";
import { Widget } from "@/components/dashboard/widgets/widget";
import { widgetTypes } from "@/data/dashboard-data";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AIInsightsWidget } from "@/components/dashboard/widgets/allsights-chart";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import { useProjectsByUser } from "@/api/queries";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BurndownChart from "@/components/dashboard/burndown-chart";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeWidgets, setActiveWidgets] = useState([
    "taskCompletion",
    "projectProgress",
    "timeAllocation",
    "upcomingTasks",
    "aiInsights",
    "burndownChart",
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
    burndownChart: "large",
  });
  const [dashboardRefreshRate] = useState(30);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Check if user has projects
  const { data: projectsData, isLoading: isLoadingProjects } = useProjectsByUser(user?.id);
  const hasProjects = projectsData?.projects && projectsData.projects.length > 0;
  const router = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
        ? `The ${widgetTypes.find((w) => w.id === widgetId)?.name ?? "Unknown"
        } widget has been removed.`
        : `The ${widgetTypes.find((w) => w.id === widgetId)?.name ?? "Unknown"
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
  // Show empty state if no projects and not loading
  if (!isLoadingProjects && !hasProjects) {
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
              Let's get started with your first project!
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
            <FolderPlus className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Create your first project to start organizing your tasks and tracking your progress.
              You'll be able to see statistics, charts, and insights here.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => {
              router("projects");
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
            <Button variant="outline" onClick={() => {
              router("projects");
            }}>
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Create Project</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set up your first project</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 dark:text-green-400 text-sm font-semibold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Add Tasks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create and assign tasks</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-semibold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Track Progress</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your dashboard</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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



      {/* Main Widgets Grid */}
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


        {/* Burndown Chart Section - Moved up for prominence */}
        {activeWidgets.includes("burndownChart") && (
          <div className="col-span-1 md:col-span-4">
            <BurndownChart selectedProjectId={selectedProjectId} />
          </div>
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