import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Progress } from "../ui/progress"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/client-gateway"
import { useProjectIssues, useProjectById } from "@/api/queries"

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

interface StatsCardsProps {
  selectedProjectId: string | null;
}

export function StatsCards({ selectedProjectId }: StatsCardsProps) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: userIssues, isLoading: isLoadingUserIssues } = useQuery({
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
    enabled: !!user?.id && !selectedProjectId,
  });
  

  const { data: projectIssues, isLoading: isLoadingProjectIssues } = useProjectIssues(
    selectedProjectId || undefined
  );
  
  const { data: projectData, isLoading: isLoadingProject } = useProjectById(
    selectedProjectId || undefined
  );
  
  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${Math.abs(Math.round(change))}%`;
  }
  
  useEffect(() => {

    const issues = selectedProjectId ? projectIssues : userIssues;
    const isDataLoading = selectedProjectId 
      ? (isLoadingProjectIssues || isLoadingProject) 
      : isLoadingUserIssues;
    
    if (issues && !isDataLoading) {
      const total = issues.length;
      const completed = issues.filter((issue: any) => 
        issue.status === 'done' || issue.status === 'closed'
      ).length;
      const inProgress = issues.filter((issue: any) => 
        issue.status === 'in-progress'
      ).length;
      
      const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;
      
      const previousTotal = total > 0 ? total - Math.floor(total * 0.12) : 0;
      const previousCompleted = completed > 0 ? completed - Math.floor(completed * 0.08) : 0;
      const previousInProgress = inProgress > 0 ? inProgress - Math.floor(inProgress * 0.03) : 0;
      
      const totalChange = calculateChange(total, previousTotal);
      const completedChange = calculateChange(completed, previousCompleted);
      const inProgressChange = calculateChange(inProgress, previousInProgress);

      const totalTrend = total >= previousTotal ? "up" : "down";
      const completedTrend = completed >= previousCompleted ? "up" : "down";
      const inProgressTrend = inProgress <= previousInProgress ? "down" : "up";
      
      const isTotalTrendPositive = totalTrend === "up";
      const isCompletedTrendPositive = completedTrend === "up";
      const isInProgressTrendPositive = inProgressTrend === "down";
      
      const titlePrefix = selectedProjectId && projectData 
        ? `${projectData[0].name}: ` 
        : "";
      
        console.log("totalprefix",titlePrefix,  "projectData", projectData, "selectedProjectId", selectedProjectId)
      
      setStats([
        {
          title: `${titlePrefix}Total Tasks`,
          value: total.toString(),
          change: totalChange,
          trend: totalTrend,
          progressValue: 100,
          progressClass: "bg-gradient-to-r from-indigo-500 to-purple-500",
          changeColor: isTotalTrendPositive ? "text-green-500 dark:text-green-400" : "text-amber-500 dark:text-amber-400",
          progressLabel: `${total} ${selectedProjectId ? 'project tasks' : 'assigned tasks'}`
        },
        {
          title: `${titlePrefix}Completed`,
          value: completed.toString(),
          change: completedChange,
          trend: completedTrend,
          progressValue: completedPercentage,
          progressClass: "bg-gradient-to-r from-green-500 to-emerald-500",
          changeColor: isCompletedTrendPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400",
          progressLabel: `${completedPercentage}% of total`
        },
        {
          title: `${titlePrefix}In Progress`,
          value: inProgress.toString(),
          change: inProgressChange,
          trend: inProgressTrend,
          progressValue: inProgressPercentage,
          progressClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
          changeColor: isInProgressTrendPositive ? "text-green-500 dark:text-green-400" : "text-yellow-500 dark:text-yellow-400",
          progressLabel: `${inProgressPercentage}% of total`
        }
      ]);
      
      setIsLoading(false);
    }
  }, [userIssues, isLoadingUserIssues, projectIssues, isLoadingProjectIssues, projectData, isLoadingProject, selectedProjectId]);

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
              {/* <div className={`text-sm ${stat.changeColor} flex items-center`}>
                {stat.trend === "up" ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div> */}
            </div>

            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${stat.progressClass}`}
                style={{ width: `${stat.progressValue}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.progressLabel}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}