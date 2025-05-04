import { useState, useEffect, useContext, SetStateAction } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/context/AuthContext";
import { AIAssistantDialog } from "@/components/dashboard/ai-assistant-dialog";
import { Widget } from "@/components/dashboard/widgets/widget";
import { widgetTypes } from "@/data/dashboard-data";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { AIIsightsWidget } from "@/components/dashboard/widgets/allsights-chart";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeWidgets, setActiveWidgets] = useState([
    "taskCompletion",
    "projectProgress",
    "timeAllocation",
    "upcomingTasks",
    "aiInsights",
  ]);
  const [colorTheme, setColorTheme] = useState("default");
  const [currentUserRole, setCurrentUserRole] = useState("admin");
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
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [dashboardRefreshRate, setDashboardRefreshRate] = useState(30); // seconds
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch new data from the server
      console.log("Refreshing dashboard data...");
    }, dashboardRefreshRate * 1000);

    return () => clearInterval(interval);
  }, [dashboardRefreshRate]);

  // Handle widget customization
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

  // Change widget size
  const changeWidgetSize = (widgetId: string, size: string) => {
    setWidgetSizes({
      ...widgetSizes,
      [widgetId]: size,
    });
  };

  // Handle theme change
  const handleThemeChange = (theme: SetStateAction<string>) => {
    setColorTheme(theme);
    toast({
      title: "Theme updated",
      description: `Dashboard theme has been updated to ${theme}.`,
    });
  };

  // Get widget size class
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
      {/* Dashboard Header */}
      <div className="text-gray-900 dark:text-gray-200">
        <h1 className="text-2xl font-bold">{getGreeting()}</h1>
        <h2 className="text-lg font-semibold">
          Welcome back, {user?.name ?? "User"}
        </h2>
        <h3>
          <span className="text-sm font-semibold ">
            Today is{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </h3>
        <p className=" pb-2">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeWidgets.includes("taskCompletion") && (
          <Widget
            size={getWidgetSizeClass("taskCompletion")}
            isLoading={isLoading}
            onChangeSize={(size) => changeWidgetSize("taskCompletion", size)}
            onRemove={() => toggleWidget("taskCompletion")}
            widgetType="taskCompletion"
            label="Task Completion" 
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
          />
        )}

        {activeWidgets.includes("timeAllocation") && (
          <Widget
            size={getWidgetSizeClass("timeAllocation")}
            isLoading={isLoading}
            onChangeSize={(size) => changeWidgetSize("timeAllocation", size)}
            onRemove={() => toggleWidget("timeAllocation")}
            label="Time Allocation"
            widgetType="timeAllocation"
          />
        )}

        {activeWidgets.includes("aiInsights") && (
          <AIIsightsWidget
            size={getWidgetSizeClass("aiInsights")}
            isLoading={isLoading}
            onChangeSize={(size) => changeWidgetSize("aiInsights", size)}
            onRemove={() => toggleWidget("aiInsights")}
            label="AI Insights"
            widgetType="aiInsights"
            setShowAIAssistant={setShowAIAssistant}
          />
        )}

        {activeWidgets.includes("upcomingTasks") && (
          <Widget
            size={getWidgetSizeClass("upcomingTasks")}
            isLoading={isLoading}
            onChangeSize={(size) => changeWidgetSize("upcomingTasks", size)}
            onRemove={() => toggleWidget("upcomingTasks")}
            label="Upcoming Tasks"
            widgetType="upcomingTasks"
          />
        )}
      </div>
      
      {/* Customization panel */}
      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent className="sm:max-w-[600px] bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Customize Dashboard</DialogTitle>
            <DialogDescription>
              Personalize your dashboard by adding, removing, or rearranging
              widgets.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Widgets</h3>
              <div className="grid grid-cols-2 gap-2">
                {widgetTypes.map((widget) => {
                  const isActive = activeWidgets.includes(widget.id);
                  return (
                    <div
                      key={widget.id}
                      className={cn(
                        "flex items-center space-x-2 rounded-md border p-2 cursor-pointer",
                        isActive
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}
                      onClick={() => toggleWidget(widget.id)}
                    >
                      <Checkbox
                        checked={isActive}
                        className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <div className="flex items-center space-x-2">
                        <widget.icon className="h-4 w-4" />
                        <span>{widget.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme</h3>
              <div className="flex space-x-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full cursor-pointer border-2",
                    colorTheme === "default"
                      ? "border-white"
                      : "border-transparent"
                  )}
                  style={{
                    background:
                      "linear-gradient(to bottom right, #1e293b, #0f172a)",
                  }}
                  onClick={() => handleThemeChange("default")}
                />
                <div
                  className={cn(
                    "w-8 h-8 rounded-full cursor-pointer border-2",
                    colorTheme === "purple"
                      ? "border-white"
                      : "border-transparent"
                  )}
                  style={{
                    background:
                      "linear-gradient(to bottom right, #4c1d95, #2e1065)",
                  }}
                  onClick={() => handleThemeChange("purple")}
                />
                <div
                  className={cn(
                    "w-8 h-8 rounded-full cursor-pointer border-2",
                    colorTheme === "blue"
                      ? "border-white"
                      : "border-transparent"
                  )}
                  style={{
                    background:
                      "linear-gradient(to bottom right, #1e40af, #1e3a8a)",
                  }}
                  onClick={() => handleThemeChange("blue")}
                />
                <div
                  className={cn(
                    "w-8 h-8 rounded-full cursor-pointer border-2",
                    colorTheme === "green"
                      ? "border-white"
                      : "border-transparent"
                  )}
                  style={{
                    background:
                      "linear-gradient(to bottom right, #065f46, #064e3b)",
                  }}
                  onClick={() => handleThemeChange("green")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Refresh Rate</h3>
              <div className="flex items-center space-x-2">
                <Slider
                  defaultValue={[dashboardRefreshRate]}
                  max={120}
                  min={10}
                  step={5}
                  onValueChange={(value) => setDashboardRefreshRate(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">
                  {dashboardRefreshRate}s
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">User Role</h3>
              <Select
                defaultValue={currentUserRole}
                onValueChange={setCurrentUserRole}
              >
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomizing(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCustomizing(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIAssistantDialog
        open={showAIAssistant}
        onOpenChange={setShowAIAssistant}
      />
    </div>
  );
}