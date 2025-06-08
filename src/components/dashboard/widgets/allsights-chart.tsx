import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Users, AlertCircle, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useAIInsights, useProjectIssues, useProjectById } from "@/api/queries";

interface AIInsightProps {
  size: string;
  isLoading: boolean;
  onChangeSize: (size: string) => void;
  onRemove: () => void;
  widgetType: string;  
  label: string;
  setShowAIAssistant: (show: boolean) => void;
  selectedProjectId: string | null;
}

export function AIInsightsWidget({
  size,
  isLoading: widgetLoading,
  onChangeSize,
  onRemove,
  setShowAIAssistant,
  selectedProjectId,
}: AIInsightProps) {
  const { user } = useContext(AuthContext);
  const [insights, setInsights] = useState<any[]>([]);
  
  // Get all insights
  const { data: aiInsights, isLoading: insightsLoading } = useAIInsights(user?.id);
  
  // For project-specific insights
  const { data: projectIssues, isLoading: issuesLoading } = useProjectIssues(
    selectedProjectId || undefined
  );
  
  const { data: projectData, isLoading: projectLoading } = useProjectById(
    selectedProjectId || undefined
  );

  const isLoading = widgetLoading || insightsLoading || 
    (selectedProjectId ? (issuesLoading || projectLoading) : false);

  useEffect(() => {
    if (selectedProjectId && projectIssues && projectData) {
      // Generate project-specific insights
      const projectInsights = generateProjectInsights(projectIssues, projectData);
      setInsights(projectInsights);
    } else if (!selectedProjectId && aiInsights) {
      // Use general insights
      setInsights(aiInsights);
    }
  }, [selectedProjectId, aiInsights, projectIssues, projectData]);

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

  return (
    <Card
      className={`${size} relative bg-gradient-to-br from-indigo-600/80 via-black/20 to-purple-600/80 dark:from-indigo-900/80 dark:via-black/50 dark:to-purple-900/80 border-white/20 overflow-hidden`}
    >
      <div className="absolute inset-0 wave-overlay wave-overlay-1 pointer-events-none"></div>
      <div className="absolute inset-0 wave-overlay wave-overlay-2 pointer-events-none"></div>

      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Sparkles className="mr-2 h-4 w-4 text-purple-300" />
          {selectedProjectId ? `${projectData?.name || 'Project'} Insights` : 'AI Insights'}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onChangeSize("small")}>
              Small
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeSize("medium")}>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeSize("large")}>
              Large
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onRemove}>
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
        ) : !insights || insights.length === 0 ? (
          <div className="text-center text-white/70 py-4">
            <p>Not enough data to generate insights.</p>
            <p className="text-sm mt-2">Keep using the app to receive personalized recommendations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight: any) => (
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
  );
}

// Helper function to generate project-specific insights
const generateProjectInsights = (issues: any[], project: any) => {
  if (!issues || !issues.length || !project) return [];
  
  const insights: any[] = [];
  
  // Insight 1: Task type distribution
  const taskTypes: Record<string, number> = {};
  issues.forEach((issue) => {
    if (!taskTypes[issue.type]) {
      taskTypes[issue.type] = 0;
    }
    taskTypes[issue.type]++;
  });
  
  const mostCommonType = Object.entries(taskTypes).sort((a, b) => b[1] - a[1])[0];
  if (mostCommonType) {
    const [type, count] = mostCommonType;
    const percentage = Math.round((count / issues.length) * 100);
    
    insights.push({
      id: `project-${project.id}-1`,
      insight: `${percentage}% of tasks in this project are of type "${type}". Consider diversifying task types for better project balance.`,
      type: "workflow"
    });
  }
  
  // Insight 2: Task completion rate
  const completedIssues = issues.filter(issue => 
    issue.status === 'done' || issue.status === 'closed'
  ).length;
  
  const completionRate = Math.round((completedIssues / issues.length) * 100);
  
  let completionInsight = "";
  let insightType = "productivity";
  
  if (completionRate < 30) {
    completionInsight = `This project has a low completion rate of ${completionRate}%. Consider breaking tasks into smaller pieces.`;
    insightType = "risk";
  } else if (completionRate > 70) {
    completionInsight = `Great job! This project has a high completion rate of ${completionRate}%.`;
    insightType = "productivity";
  } else {
    completionInsight = `This project has a moderate completion rate of ${completionRate}%. Focus on completing in-progress tasks.`;
    insightType = "productivity";
  }
  
  insights.push({
    id: `project-${project.id}-2`,
    insight: completionInsight,
    type: insightType
  });
  
  // Insight 3: Recent activity
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentUpdates = issues.filter(issue => {
    const updatedAt = new Date(issue.updatedAt);
    return updatedAt > oneWeekAgo;
  }).length;
  
  const recentActivityPercentage = Math.round((recentUpdates / issues.length) * 100);
  
  if (recentActivityPercentage < 20) {
    insights.push({
      id: `project-${project.id}-3`,
      insight: `Only ${recentActivityPercentage}% of tasks were updated in the last week. This project may be stalled.`,
      type: "time"
    });
  } else if (recentActivityPercentage > 50) {
    insights.push({
      id: `project-${project.id}-3`,
      insight: `${recentActivityPercentage}% of tasks were updated in the last week. This project is very active.`,
      type: "time"
    });
  }
  
  // If we have few insights, add a generic one
  if (insights.length < 2) {
    insights.push({
      id: `project-${project.id}-generic`,
      insight: `This project has ${issues.length} tasks in total. ${completedIssues} tasks are completed.`,
      type: "productivity"
    });
  }
  
  return insights;
};
