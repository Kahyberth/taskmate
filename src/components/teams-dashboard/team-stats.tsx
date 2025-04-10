import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  BarChart3Icon,
  UsersIcon,
  Target,
  Award,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
  { name: "Jan", hours: 120 },
  { name: "Feb", hours: 150 },
  { name: "Mar", hours: 180 },
  { name: "Apr", hours: 170 },
  { name: "May", hours: 200 },
  { name: "Jun", hours: 220 },
];

const areaData = [
  { name: "Mon", value: 40 },
  { name: "Tue", value: 30 },
  { name: "Wed", value: 45 },
  { name: "Thu", value: 50 },
  { name: "Fri", value: 60 },
  { name: "Sat", value: 20 },
  { name: "Sun", value: 10 },
];

const performanceData = [
  { name: "Week 1", actual: 65, target: 70 },
  { name: "Week 2", actual: 68, target: 70 },
  { name: "Week 3", actual: 75, target: 75 },
  { name: "Week 4", actual: 80, target: 80 },
  { name: "Week 5", actual: 82, target: 85 },
  { name: "Week 6", actual: 87, target: 90 },
];

export default function TeamStats() {
  return (
    <Card className="col-span-2 overflow-hidden border bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BarChart3Icon className="h-5 w-5 mr-2 text-primary" />
              Team Statistics
            </CardTitle>
            <CardDescription>Overview of team performance</CardDescription>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Last updated:</span>
            <span className="font-medium">Today, 10:30 AM</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

          <StatsCard
            title="Projects Completed"
            value="24"
            change="+4"
            isPositive={true}
            icon={<TrendingUpIcon className="h-5 w-5 text-primary" />}
          />
          <StatsCard
            title="Team Efficiency"
            value="87%"
            change="+2.5%"
            isPositive={true}
            icon={<UsersIcon className="h-5 w-5 text-primary" />}
          />
          <StatsCard
            title="Avg. Response Time"
            value="1.2h"
            change="-0.3h"
            isPositive={true}
            icon={<BarChart3Icon className="h-5 w-5 text-primary" />}
          />
        </div>

        <Tabs defaultValue="hours" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="hours">Monthly Hours</TabsTrigger>
            <TabsTrigger value="activity">Weekly Activity</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent
            value="hours"
            className="animate-in fade-in-50 duration-300"
          >
            <div className="h-[200px] sm:h-[250px] md:h-[300px]">
              <div className="text-sm font-medium mb-2 flex items-center">
                <Award className="h-4 w-4 mr-1 text-primary" />
                <span>Monthly Team Hours</span>
                <Badge variant="outline" className="ml-2 bg-primary/5 text-xs">
                  +15% vs Last Month
                </Badge>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent
            value="activity"
            className="animate-in fade-in-50 duration-300"
          >
            <div className="h-[250px]">
              <div className="text-sm font-medium mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-1 text-primary" />
                <span>Weekly Activity Trend</span>
                <Badge variant="outline" className="ml-2 bg-primary/5 text-xs">
                  Peak on Friday
                </Badge>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent
            value="performance"
            className="animate-in fade-in-50 duration-300"
          >
            <div className="h-[250px]">
              <div className="text-sm font-medium mb-2 flex items-center">
                <Target className="h-4 w-4 mr-1 text-primary" />
                <span>Team Performance vs Targets</span>
                <Badge variant="outline" className="ml-2 bg-primary/5 text-xs">
                  97% Achievement
                </Badge>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "hsl(var(--muted-foreground))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function StatsCard({
  title,
  value,
  change,
  isPositive,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card/50 p-4 rounded-xl border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <div
        className={cn(
          "flex items-center mt-1 text-sm",
          isPositive ? "text-green-500" : "text-red-500"
        )}
      >
        {isPositive ? (
          <ArrowUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 mr-1" />
        )}
        <span>{change} from last month</span>
      </div>
    </div>
  );
}