import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { upcomingTasks } from "@/data/dashboard-data";
import { useEffect, useState } from "react";

import { useProjectIssues } from "@/api/queries";
import { Skeleton } from "@/components/ui/skeleton";

interface UpcomingTasksChartProps {
  selectedProjectId: string | null;
}

// Define the Issue interface to match the API response
interface Issue {
  id: string;
  title?: string;
  summary?: string;
  status: string;
  priority?: string;
  dueDate?: string;
  code?: string;
}

export function UpcomingTasksChart({ selectedProjectId }: UpcomingTasksChartProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  
  // Fetch project-specific issues when a project is selected
  const { data: projectIssues, isLoading } = useProjectIssues(
    selectedProjectId || undefined
  );
  
  useEffect(() => {
    if (selectedProjectId && projectIssues) {
      // Format project issues to match the task format
      const formattedTasks = projectIssues
        .filter((issue: Issue) => issue.status !== 'done' && issue.status !== 'closed')
        .slice(0, 5) // Take only the first 5 tasks for display
        .map((issue: Issue) => ({
          id: issue.id,
          title: issue.title || issue.summary || `Task ${issue.code || '#'}`,
          due: issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'No due date',
          priority: issue.priority || 'medium',
          completed: issue.status === 'done' || issue.status === 'closed'
        }));
      
      setTasks(formattedTasks);
    } else {
      // If no project is selected, use the sample data
      setTasks(upcomingTasks);
    }
  }, [selectedProjectId, projectIssues]);
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  if (isLoading && selectedProjectId) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[250px] text-gray-500 dark:text-gray-400">
        <p>No upcoming tasks available</p>
        <Button className="mt-4 bg-black/10 dark:bg-white/10 hover:dark:bg-white/20 hover:bg-black/20 text-black dark:text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-center justify-between p-2 rounded-md",
            task.completed
              ? "bg-green-500/10 line-through text-black/50 dark:text-white/50"
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
                    ? "line-through text-black/50 dark:text-white/50"
                    : "text-black dark:text-white"
                )}
              >
                {task.title}
              </Label>
              <p className="text-xs text-black/50 dark:text-white/50">
                {task.due}
              </p>
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
      <Button className="w-full mt-2 bg-black/10 dark:bg-white/10 hover:dark:bg-white/20 hover:bg-black/20 text-black dark:text-white">
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
}