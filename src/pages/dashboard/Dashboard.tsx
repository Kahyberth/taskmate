import { useState, useEffect, SetStateAction, useContext } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Calendar,
  Clock,
  Bell,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Sparkles,
  Zap,
  MessageSquare,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/context/AuthContext";
import { AIAssistantDialog } from "@/components/dashboard/ai-assistant-dialog";

// Sample data for charts
const taskCompletionData = [
  { name: "Mon", completed: 12, pending: 5, total: 17 },
  { name: "Tue", completed: 19, pending: 3, total: 22 },
  { name: "Wed", completed: 15, pending: 8, total: 23 },
  { name: "Thu", completed: 22, pending: 4, total: 26 },
  { name: "Fri", completed: 18, pending: 7, total: 25 },
  { name: "Sat", completed: 10, pending: 2, total: 12 },
  { name: "Sun", completed: 8, pending: 1, total: 9 },
];

const projectProgressData = [
  { name: "Website Redesign", progress: 75, total: 100 },
  { name: "Mobile App", progress: 45, total: 100 },
  { name: "API Integration", progress: 90, total: 100 },
  { name: "Documentation", progress: 60, total: 100 },
  { name: "Testing", progress: 30, total: 100 },
];

const timeAllocationData = [
  { name: "Development", value: 40, color: "#4f46e5" },
  { name: "Meetings", value: 20, color: "#8b5cf6" },
  { name: "Planning", value: 15, color: "#a855f7" },
  { name: "Research", value: 15, color: "#d946ef" },
  { name: "Other", value: 10, color: "#ec4899" },
];

const teamPerformanceData = [
  { name: "Week 1", team1: 30, team2: 25, team3: 28 },
  { name: "Week 2", team1: 35, team2: 30, team3: 32 },
  { name: "Week 3", team1: 32, team2: 35, team3: 30 },
  { name: "Week 4", team1: 40, team2: 38, team3: 35 },
];

const recentActivities = [
  {
    id: 1,
    user: "Alex Johnson",
    action: "completed task",
    item: "Update user documentation",
    time: "10 minutes ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    user: "Sarah Williams",
    action: "commented on",
    item: "API Integration issue",
    time: "25 minutes ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    user: "Michael Brown",
    action: "created project",
    item: "Mobile App Phase 2",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    user: "Emily Davis",
    action: "completed task",
    item: "Design review",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    user: "David Wilson",
    action: "updated",
    item: "Project timeline",
    time: "3 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Team meeting",
    priority: "high",
    due: "Today, 2:00 PM",
    completed: false,
  },
  {
    id: 2,
    title: "Review pull requests",
    priority: "medium",
    due: "Today, 4:00 PM",
    completed: false,
  },
  {
    id: 3,
    title: "Update documentation",
    priority: "low",
    due: "Tomorrow, 10:00 AM",
    completed: false,
  },
  {
    id: 4,
    title: "Prepare presentation",
    priority: "high",
    due: "Tomorrow, 2:00 PM",
    completed: false,
  },
  {
    id: 5,
    title: "Weekly report",
    priority: "medium",
    due: "Friday, 12:00 PM",
    completed: true,
  },
];

const notifications = [
  {
    id: 1,
    type: "mention",
    message: "Alex mentioned you in a comment",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "task",
    message: "New task assigned: Update API documentation",
    time: "25 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    message: "Server deployment completed successfully",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "update",
    message: "TaskMate 2.0.1 update available",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "reminder",
    message: "Meeting with design team in 30 minutes",
    time: "30 minutes ago",
    read: false,
  },
];

const aiInsights = [
  {
    id: 1,
    insight:
      "Based on your work patterns, scheduling deep work sessions in the morning could improve productivity by 27%",
    type: "productivity",
  },
  {
    id: 2,
    insight:
      "Your team completes tasks 15% faster when they're broken down into smaller subtasks",
    type: "workflow",
  },
  {
    id: 3,
    insight:
      'Project "Website Redesign" is at risk of missing its deadline based on current progress',
    type: "risk",
  },
  {
    id: 4,
    insight:
      "You spend 35% of your time in meetings. Consider delegating some recurring meetings to boost productivity",
    type: "time",
  },
];

// Widget types for customization
const widgetTypes = [
  { id: "taskCompletion", name: "Task Completion", icon: CheckCircle2 },
  { id: "projectProgress", name: "Project Progress", icon: Briefcase },
  { id: "timeAllocation", name: "Time Allocation", icon: Clock },
  { id: "teamPerformance", name: "Team Performance", icon: Users },
  { id: "upcomingTasks", name: "Upcoming Tasks", icon: Calendar },
  { id: "recentActivity", name: "Recent Activity", icon: Clock3 },
  { id: "aiInsights", name: "AI Insights", icon: Sparkles },
  { id: "notifications", name: "Notifications", icon: Bell },
];

// Dashboard component
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

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: any) => {
    switch (type) {
      case "mention":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "task":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "update":
        return <Download className="h-4 w-4 text-purple-500" />;
      case "reminder":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "productivity":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "workflow":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "risk":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "time":
        return <Clock className="h-5 w-5 text-green-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning 🌞";
    } else if (hour < 18) {
      return "Good afternoon ";
    } else {
      return "Good night 🌙";
    }
  };

  return (
    <>
      {/* Dashboard header */}
      <div>
        <h1 className="text-2xl font-bold">{getGreeting()}</h1>
        <h2 className="text-lg font-semibold text-white/70">
          Welcome back, {user?.name ?? "User"}
        </h2>
        <h3>
          <span className="text-sm font-semibold text-white/70">
            Today is{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </h3>
        <p className="text-white/70">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Dashboard summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white">134</div>
              <div className="text-sm text-green-400 flex items-center">
                <ChevronUp className="h-4 w-4 mr-1" />
                12%
              </div>
            </div>
            <Progress
              value={65}
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white">94</div>
              <div className="text-sm text-green-400 flex items-center">
                <ChevronUp className="h-4 w-4 mr-1" />
                8%
              </div>
            </div>
            <Progress
              value={70}
              className="mt-2 h-1 bg-white/10 bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white">28</div>
              <div className="text-sm text-yellow-400 flex items-center">
                <ChevronDown className="h-4 w-4 mr-1" />
                3%
              </div>
            </div>
            <Progress value={21} className="mt-2 h-1 bg-white/10" />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-red-400 flex items-center">
                <ChevronUp className="h-4 w-4 mr-1" />
                15%
              </div>
            </div>
            <Progress value={9} className="mt-2 h-1 bg-white/10" />
          </CardContent>
        </Card>
      </div>

      {/* Dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Task Completion Chart */}
        {activeWidgets.includes("taskCompletion") && (
          <Card
            className={`${getWidgetSizeClass(
              "taskCompletion"
            )} bg-white/5 border-white/10`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Task Completion
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("taskCompletion", "small")}
                  >
                    Small
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("taskCompletion", "medium")}
                  >
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("taskCompletion", "large")}
                  >
                    Large
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => toggleWidget("taskCompletion")}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-[200px] w-full bg-white/5" />
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={taskCompletionData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorCompleted"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPending"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ec4899"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ec4899"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#ffffff50" />
                      <YAxis stroke="#ffffff50" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          color: "#fff",
                        }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(value) => [`${value} tasks`, undefined]}
                        labelFormatter={(label) => `Day: ${label}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorCompleted)"
                        name="Completed"
                      />
                      <Area
                        type="monotone"
                        dataKey="pending"
                        stroke="#ec4899"
                        fillOpacity={1}
                        fill="url(#colorPending)"
                        name="Pending"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-2 flex items-center justify-center">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Optimized Predictions
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Project Progress */}
        {activeWidgets.includes("projectProgress") && (
          <Card
            className={`${getWidgetSizeClass(
              "projectProgress"
            )} bg-white/5 border-white/10`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Project Progress
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("projectProgress", "small")}
                  >
                    Small
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      changeWidgetSize("projectProgress", "medium")
                    }
                  >
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("projectProgress", "large")}
                  >
                    Large
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => toggleWidget("projectProgress")}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-[200px] w-full bg-white/5" />
                </div>
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectProgressData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff10"
                        horizontal={false}
                      />
                      <XAxis type="number" stroke="#ffffff50" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#ffffff50"
                        width={100}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          color: "#fff",
                        }}
                        formatter={(value) => [`${value}%`, "Progress"]}
                      />
                      <Bar
                        dataKey="progress"
                        fill="#8b5cf6"
                        radius={[0, 4, 4, 0]}
                      >
                        {projectProgressData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.progress > 75
                                ? "#10b981"
                                : entry.progress > 50
                                ? "#8b5cf6"
                                : entry.progress > 25
                                ? "#f59e0b"
                                : "#ef4444"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Time Allocation */}
        {activeWidgets.includes("timeAllocation") && (
          <Card
            className={`${getWidgetSizeClass(
              "timeAllocation"
            )} bg-white/5 border-white/10`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Time Allocation
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("timeAllocation", "small")}
                  >
                    Small
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("timeAllocation", "medium")}
                  >
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("timeAllocation", "large")}
                  >
                    Large
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => toggleWidget("timeAllocation")}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-[200px] w-full bg-white/5" />
                </div>
              ) : (
                <div className="h-[250px] flex flex-col items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timeAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        isAnimationActive={false}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {timeAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          color: "#fff",
                        }}
                        formatter={(value) => [`${value}%`, undefined]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 text-xs text-white/70">
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                      AI Optimized
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        {activeWidgets.includes("aiInsights") && (
          <Card
            className={`${getWidgetSizeClass(
              "aiInsights"
            )} relative bg-gradient-to-br from-indigo-900/80 via-black/50 to-purple-900/80 border-white/20 overflow-hidden`}
          >
            {/* Overlay animado: dos capas para un efecto más dinámico y pronunciado */}
            <div className="absolute inset-0 wave-overlay wave-overlay-1 pointer-events-none"></div>
            <div className="absolute inset-0 wave-overlay wave-overlay-2 pointer-events-none"></div>

            <CardHeader className="relative flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-white/70">
                <Sparkles className="mr-2 h-4 w-4 text-purple-300 " />
                AI Insights
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("aiInsights", "small")}
                  >
                    Small
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("aiInsights", "medium")}
                  >
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("aiInsights", "large")}
                  >
                    Large
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toggleWidget("aiInsights")}>
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="relative">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-[20px] w-full bg-white/5" />
                  <Skeleton className="h-[20px] w-full bg-white/5" />
                  <Skeleton className="h-[20px] w-full bg-white/5" />
                </div>
              ) : (
                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="mt-0.5">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div>
                        <p className="text-sm">{insight.insight}</p>
                        <Badge
                          variant="outline"
                          className="mt-2 text-xs border-white/10"
                        >
                          {insight.type.charAt(0).toUpperCase() +
                            insight.type.slice(1)}{" "}
                          Insight
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {/* Botón para abrir el AIAssistantDialog */}
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white"
                    onClick={() => setShowAIAssistant(true)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Open AI Assistant
                  </Button>
                </div>
              )}
            </CardContent>

            {/* Estilos para la animación de ondas intensificada */}
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
          rgba(255, 255, 255, 0.35),
          transparent
        );
        filter: blur(3px);
      }
      .wave-overlay-1 {
        opacity: 0.6;
        animation: wave1 4s linear infinite;
      }
      .wave-overlay-2 {
        opacity: 0.5;
        animation: wave2 8s linear infinite;
      }
    `}</style>
          </Card>
        )}

        {/* Upcoming Tasks */}
        {activeWidgets.includes("upcomingTasks") && (
          <Card
            className={`${getWidgetSizeClass(
              "upcomingTasks"
            )} bg-white/5 border-white/10`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Upcoming Tasks
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("upcomingTasks", "small")}
                  >
                    Small
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("upcomingTasks", "medium")}
                  >
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeWidgetSize("upcomingTasks", "large")}
                  >
                    Large
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => toggleWidget("upcomingTasks")}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-[20px] w-full bg-white/5" />
                  <Skeleton className="h-[20px] w-full bg-white/5" />
                  <Skeleton className="h-[20px] w-full bg-white/5" />
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md",
                        task.completed
                          ? "bg-green-500/10 line-through text-white/50"
                          : "bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          className="mr-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                        <div>
                          <Label
                            htmlFor={`task-${task.id}`}
                            className={cn(
                              task.completed
                                ? "line-through text-white/50"
                                : "text-white"
                            )}
                          >
                            {task.title}
                          </Label>
                          <p className="text-xs text-white/50">{task.due}</p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs",
                          getPriorityColor(task.priority)
                        )}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                  <Button className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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
      {showAIAssistant && (
        <AIAssistantDialog
          open={showAIAssistant}
          onOpenChange={setShowAIAssistant}
        />
      )}
    </>
  );
}
