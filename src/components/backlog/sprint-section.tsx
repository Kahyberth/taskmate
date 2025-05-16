import { Button } from "@/components/ui/button";
import { ChevronDown, CheckSquare } from "lucide-react";
import { TaskItem } from "./task-item";
import { Task } from "@/interfaces/task.interface";
import { Sprint } from "@/interfaces/sprint.interface";
import { Epic } from "@/interfaces/epic.interface";
import { useMemo } from "react";

interface SprintSectionProps {
  sprint: Sprint;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onMoveTaskToBacklog: (taskId: string) => void;
  onStatusChange: (sprintId: string, taskId: string, status: Task["status"]) => void;
  onStartSprint: (sprintId: string) => void;
  onCompleteSprint: (sprintId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  getPriorityColor: (priority?: string) => string;
  getTypeColor: (type?: string) => string;
  getStatusColor: (status: string) => string;
  getStatusDisplayText: (status: string) => string;
  getAssignedUser: (userId?: string) => { initials: string } | null;
  onAssignUser?: (taskId: string, userId: string | undefined) => void;
  getEpicById?: (epicId?: string) => Epic | null;
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
  onDeleteTask,
  getPriorityColor,
  getTypeColor,
  getStatusColor,
  getStatusDisplayText,
  getAssignedUser,
  onAssignUser,
  getEpicById,
}: SprintSectionProps) {
  const handleToggleClick = (e: React.MouseEvent) => {
    // Only toggle if clicking on the header section elements
    if (e.target instanceof Element && 
        (e.target.closest('.sprint-header') || 
         e.target.classList.contains('sprint-header'))) {
      onToggleExpand();
    }
  };
  
  // Calculate task counts by status
  const taskCounts = useMemo(() => {
    const todoCount = sprint.tasks.filter(task => task.status === "to-do").length;
    const inProgressCount = sprint.tasks.filter(task => 
      task.status === "in-progress" || task.status === "review"
    ).length;
    const doneCount = sprint.tasks.filter(task => 
      task.status === "resolved" || task.status === "closed"
    ).length;
    
    return { todoCount, inProgressCount, doneCount };
  }, [sprint.tasks]);
  
  return (
    <div className="mb-6 border border-gray-200 rounded-md p-3 shadow-sm bg-white dark:bg-black/20 dark:border-white/10">
      <div className="flex flex-col sprint-header" onClick={handleToggleClick}>
        {/* First row: sprint name and expand/collapse control */}
        <div className="flex items-center mb-2 cursor-pointer">
          <ChevronDown
            size={16}
            className={`mr-2 transition-transform ${isExpanded ? "transform rotate-0" : "transform rotate-270"}`}
          />
          <span className="font-medium dark:text-white">{sprint.name}</span>
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
            <button 
              className="text-xs text-gray-500 dark:text-gray-400 underline"
              onClick={(e) => e.stopPropagation()}
            >
              Añadir fechas
            </button> ({sprint.tasks.length}{" "}
            actividades)
          </span>
        </div>
        
        {/* Second row: stats and actions */}
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2">
          {/* To-do count */}
            <span className="text-xs text-gray-500 dark:text-gray-400">{taskCounts.todoCount}</span>
          {/* In-progress count */}
            <div className="w-6 h-4 bg-blue-100 dark:bg-blue-900/30 rounded-sm flex items-center justify-center text-xs text-blue-800 dark:text-blue-300">
            {taskCounts.inProgressCount}
          </div>
          {/* Done count */}
            <span className="text-xs text-gray-500 dark:text-gray-400">{taskCounts.doneCount}</span>
          </div>
          <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
              className="h-7 text-xs dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              sprint.isActive ? onCompleteSprint(sprint.id) : onStartSprint(sprint.id);
            }}
          >
            {sprint.isActive ? "Completar sprint" : "Iniciar sprint"}
          </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-8">
          {sprint.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleCompletion={onToggleTaskCompletion}
              onEdit={onEditTask}
              onMoveToBacklog={onMoveTaskToBacklog}
              getPriorityColor={getPriorityColor}
              getTypeColor={getTypeColor}
              getStatusColor={getStatusColor}
              getStatusDisplayText={getStatusDisplayText}
              getAssignedUser={getAssignedUser}
              onStatusChange={(taskId, status) => onStatusChange(sprint.id, taskId, status)}
              onAssignUser={onAssignUser}
              onDeleteTask={onDeleteTask}
              getEpicById={getEpicById}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center py-4 text-gray-400 dark:text-gray-500">
        <CheckSquare size={16} className="mr-2" />
        <span className="text-sm">
          {sprint.tasks.length} actividades | Estimación:{" "}
          {sprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0).toFixed(1).replace(/\.0$/, '')} puntos
          {sprint.tasks.some(task => task.storyPoints === 0 || task.storyPoints === undefined) && 
            " (algunas tareas sin estimar)"}
        </span>
      </div>
    </div>
  );
} 