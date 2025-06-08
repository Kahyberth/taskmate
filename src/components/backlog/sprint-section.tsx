import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react";
import { TaskItem } from "./task-item";
import { Task } from "@/interfaces/task.interface";
import { Sprint } from "@/interfaces/sprint.interface";
import { useMemo, useState } from "react";
import { AssignedUser } from "@/interfaces/assigned-user.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notifications } from "@mantine/notifications";

interface SprintSectionProps {
  sprint: Sprint;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onMoveTaskToBacklog: (taskId: string) => void;
  onStatusChange: (sprintId: string, taskId: string, status: Task["status"]) => void;
  onStartSprint: (sprintId: string) => Promise<void>;
  onCompleteSprint: (sprintId: string) => Promise<void>;
  onDeleteSprint: (sprintId: string) => void;
  onEditSprint: (sprint: Sprint) => void;
  getAssignedUser: (userId?: string) => AssignedUser | null;
  onDeleteTask: (taskId: string, sprintId: string) => void;
}

export function SprintSection({
  sprint,
  isExpanded,
  onToggleExpand,
  onToggleTaskCompletion,
  onEditTask,
  onMoveTaskToBacklog,
  onStatusChange,
  onStartSprint,
  onCompleteSprint,
  onDeleteSprint,
  onEditSprint,
  getAssignedUser,
  onDeleteTask,
}: SprintSectionProps) {
  const [isStartingSprint, setIsStartingSprint] = useState(false);
  const [isCompletingSprint, setIsCompletingSprint] = useState(false);
  const [isDeletingSprint, setIsDeletingSprint] = useState(false);

  // Calculate task counts by status
  const taskCounts = useMemo(() => {
    const issues = sprint.issues || [];
    const todoCount = issues.filter(task => task.status === "to-do").length;
    const inProgressCount = issues.filter(task => 
      task.status === "in-progress" || task.status === "review"
    ).length;
    const doneCount = issues.filter(task => 
      task.status === "done" || task.status === "closed"
    ).length;
    
    return { todoCount, inProgressCount, doneCount };
  }, [sprint.issues]);

  const handleStartSprint = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStartingSprint(true);
    try {
      await onStartSprint(sprint.id);
    } finally {
      setIsStartingSprint(false);
    }
  };

  const handleCompleteSprint = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompletingSprint(true);
    try {
      await onCompleteSprint(sprint.id);
    } finally {
      setIsCompletingSprint(false);
    }
  };

  const handleDeleteSprint = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sprint.issues?.length || sprint.issues.length === 0) {
      setIsDeletingSprint(true);
      try {
        await onDeleteSprint(sprint.id);
      } finally {
        setIsDeletingSprint(false);
      }
    } else {
      notifications.show({
        title: "Cannot delete",
        message: "The sprint has assigned tasks. Move them to the backlog before deleting the sprint.",
        color: "red"
      });
    }
  };
  
  return (
    <div className="mb-4">
      <div className="border border-black/10 dark:border-white/10 rounded-md p-3 shadow-sm bg-white dark:bg-black/20">
        <div className="flex items-center justify-between backlog-header">
          <div className="flex items-center cursor-pointer">
            <ChevronDown
              className={`h-5 w-5 transform transition-transform dark:text-gray-400 ${
                isExpanded ? "" : "-rotate-90"
              }`}
              onClick={onToggleExpand}
            />
            <h3 className="text-lg font-semibold dark:text-gray-200 ml-2">{sprint.name}</h3>
            {sprint.goal && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                - {sprint.goal}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="ml-auto flex items-center gap-2">
              {/* To-do count */}
              <span className="text-xs text-gray-500 dark:text-gray-400">{taskCounts.todoCount}</span>
              {/* In-progress count */}
              <div className="w-6 h-4 bg-blue-100 dark:bg-blue-900/30 rounded-sm flex items-center justify-center text-xs text-blue-800 dark:text-blue-300">
                {taskCounts.inProgressCount}
              </div>
              {/* Done count */}
              <span className="text-xs text-gray-500 dark:text-gray-400">{taskCounts.doneCount}</span>
            </div>

            <Button
              variant={sprint.isStarted ? "destructive" : "outline"}
              size="sm"
              onClick={sprint.isStarted ? handleCompleteSprint : handleStartSprint}
              disabled={isStartingSprint || isCompletingSprint}
              className="h-7 text-xs dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 min-w-[120px]"
            >
              {isStartingSprint || isCompletingSprint ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {sprint.isStarted ? "Completing..." : "Starting..."}
                </>
              ) : (
                sprint.isStarted ? "Complete sprint" : "Start sprint"
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 dark:text-gray-200 dark:hover:bg-gray-800">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditSprint(sprint)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit sprint</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeleteSprint}
                  className="text-red-600 focus:text-red-600"
                  disabled={isDeletingSprint}
                >
                  {isDeletingSprint ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete sprint</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {(sprint.issues || []).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleCompletion={() => onToggleTaskCompletion(task.id)}
                onEdit={() => onEditTask(task)}
                onMoveToBacklog={() => onMoveTaskToBacklog(task.id)}
                onStatusChange={(taskId, status) => onStatusChange(sprint.id, taskId, status)}
                getAssignedUser={getAssignedUser}
                onDeleteTask={(taskId) => onDeleteTask(taskId, sprint.id)}
              />
            ))}
            {!sprint.issues?.length && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks in this sprint
              </div>
            )}
          </div>
        )}

        {isExpanded && sprint.issues?.length > 0 && (
          <div className="flex items-center justify-center py-4 text-gray-400 dark:text-gray-500">
            <span className="text-sm">
              Total estimation: {sprint.issues.reduce((sum, task) => sum + (task.storyPoints || 0), 0).toFixed(1).replace(/\.0$/, '')} points
              {sprint.issues.some(task => task.storyPoints === 0 || task.storyPoints === undefined) && 
                " (some tasks not estimated)"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}