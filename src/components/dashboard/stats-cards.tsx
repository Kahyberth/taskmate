import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Progress } from "../ui/progress"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/client-gateway"

interface DashboardStat {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  progressValue: number
  progressClass: string
  changeColor: string
  progressLabel: string
}

interface Issue {
  id: string;
  title: string;
  status: string;
  type: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export function StatsCards() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  const { data: userIssues, isLoading: isLoadingIssues } = useQuery({
    queryKey: ['userIssues', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const response = await apiClient.get(`/issues/user/${user.id}`);
        return response.data as Issue[] || [];
      } catch (error) {
        console.error("Error fetching user issues:", error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
  
  // Calculate percentage changes (simulated for now)
  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${Math.abs(Math.round(change))}%`;
  }
  
  // Update stats when data is loaded
  useEffect(() => {
    if (userIssues && !isLoadingIssues) {
      // Calculate statistics from user issues
      const total = userIssues.length;
      const completed = userIssues.filter(issue => 
        issue.status === 'done' || issue.status === 'closed'
      ).length;
      const inProgress = userIssues.filter(issue => 
        issue.status === 'in-progress'
      ).length;
      
      const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;
      
    
      const previousTotal = total - Math.floor(total * 0.12);
      const previousCompleted = completed - Math.floor(completed * 0.08);
      const previousInProgress = inProgress - Math.floor(inProgress * 0.03);
      
      const totalChange = calculateChange(total, previousTotal);
      const completedChange = calculateChange(completed, previousCompleted);
      const inProgressChange = calculateChange(inProgress, previousInProgress);

      
      const totalTrend = total > previousTotal ? "up" : "down";
      const completedTrend = completed > previousCompleted ? "up" : "down";
      
      const inProgressTrend = inProgress < previousInProgress ? "down" : "up";
      
      const isTotalTrendPositive = totalTrend === "up"; 
      const isCompletedTrendPositive = completedTrend === "up"; 
      const isInProgressTrendPositive = inProgressTrend === "down"; 
      
      setStats([
        {
          title: "Total Tasks",
          value: total.toString(),
          change: totalChange,
          trend: totalTrend,
          progressValue: 100, // Always full for visualization
          progressClass: "bg-gradient-to-r from-indigo-500 to-purple-500",
          changeColor: isTotalTrendPositive ? "text-green-500 dark:text-green-400" : "text-amber-500 dark:text-amber-400",
          progressLabel: `${total} tareas asignadas`
        },
        {
          title: "Completed",
          value: completed.toString(),
          change: completedChange,
          trend: completedTrend,
          progressValue: completedPercentage,
          progressClass: "bg-gradient-to-r from-green-500 to-emerald-500",
          changeColor: isCompletedTrendPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400",
          progressLabel: `${completedPercentage}% del total`
        },
        {
          title: "In Progress",
          value: inProgress.toString(),
          change: inProgressChange,
          trend: inProgressTrend,
          progressValue: inProgressPercentage,
          progressClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
          changeColor: isInProgressTrendPositive ? "text-green-500 dark:text-green-400" : "text-yellow-500 dark:text-yellow-400",
          progressLabel: `${inProgressPercentage}% del total`
        }
      ]);
      
      setIsLoading(false);
    }
  }, [userIssues, isLoadingIssues]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {[1, 2, 3].map((_, index) => (
          <Card 
            key={index}
            className="bg-white border-gray-200 dark:bg-white/5 dark:border-white/10"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6 animate-pulse"></div>
              </div>
              <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="bg-white border-gray-200 dark:bg-white/5 dark:border-white/10"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className={`text-sm ${stat.changeColor} flex items-center`}>
                {stat.trend === "up" ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <Progress 
              value={stat.progressValue} 
              className={`mt-2 h-1 ${stat.progressClass}`}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.progressLabel}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}