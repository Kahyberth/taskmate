import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { upcomingTasks } from "@/data/dashboard-data";

export function UpcomingTasksChart() {
  
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

  return (
    <div className="space-y-2">
      {upcomingTasks.map((task) => (
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