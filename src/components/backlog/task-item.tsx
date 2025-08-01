import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash, ChevronDown, MoveRight, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/interfaces/task.interface";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EpicBadge } from "./epic-badge";
import { IssueDetailModal } from "./issue-detail-modal";
import { getTypeIcon, getPriorityColor, getStatusColor, getStatusDisplayText } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleCompletion: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onMoveToSprint?: (taskId: string, sprintId: string) => void;
  onMoveToBacklog?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  availableSprints?: { id: string; name: string }[];
  getAssignedUser: (userId?: string) => { initials: string; name?: string; lastName?: string } | null;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onAssignUser?: (taskId: string, userId: string | undefined) => void;
}

export function TaskItem({
  task,
  onEdit,
  onMoveToSprint,
  onMoveToBacklog,
  onDeleteTask,
  availableSprints,
  getAssignedUser,
  onStatusChange,
}: TaskItemProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [movingToSprintId, setMovingToSprintId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isIssueDetailOpen, setIsIssueDetailOpen] = useState(false);

  const handleMoveToSprint = async (sprintId: string) => {
    if (!onMoveToSprint) return;
    setIsMoving(true);
    setMovingToSprintId(sprintId);
    try {
      await onMoveToSprint(task.id, sprintId);
    } finally {
      setIsMoving(false);
      setMovingToSprintId(null);
    }
  };

  const handleMoveToBacklog = async () => {
    if (!onMoveToBacklog) return;
    setIsMoving(true);
    try {
      await onMoveToBacklog(task.id);
    } finally {
      setIsMoving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!onDeleteTask) return;
    setIsDeleting(true);
    try {
      await onDeleteTask(task.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };


  const handleTaskUpdate = async (updatedTask: Partial<Task>) => {
    try {
      const mergedTask = {
        ...task,
        ...updatedTask,
        title: updatedTask.title || task.title,
        status: updatedTask.status || task.status,
        priority: updatedTask.priority || task.priority,
        description: updatedTask.description || task.description,
        acceptanceCriteria: updatedTask.acceptanceCriteria || task.acceptanceCriteria,
      } as Task;
      
      await onEdit(mergedTask);
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating task:", error);
      return Promise.reject(error);
    }
  };

  const handleOpenEditModal = (taskToEdit: Task) => {
    setIsIssueDetailOpen(false);
    onEdit(taskToEdit);
  };

  return (
    <div className={`border border-black/10 dark:border-white/10 rounded-md mb-1 ${isMoving || isDeleting ? 'opacity-60' : ''}`}>
      <div 
        className="flex flex-wrap items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
        onClick={() => setIsIssueDetailOpen(true)}
      >
        <div className="flex items-center mr-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            className="mr-2"
            id={`checkbox-${task.id}`}
            checked={task.status === "done"}
            disabled={true}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400 text-sm">{task.code}</span>
            {task.type && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center justify-center">
                      {getTypeIcon(task.type)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="font-medium dark:bg-gray-800 dark:text-gray-200">
                    <p className="capitalize">{task.type.replace('_', ' ')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-[100px] mr-2">
          <span className={`${task.status === "done" ? "line-through text-gray-400 dark:text-gray-500" : "dark:text-gray-200"}`}>
              {task.title}
            </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end ml-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-wrap gap-1 items-center order-2 sm:order-1">
            {task.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            )}
            {task.epic && <EpicBadge epic={task.epic} />}
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full">
              {typeof task.storyPoints === 'number' && task.storyPoints > 0
                ? `${task.storyPoints % 1 === 0 ? task.storyPoints : task.storyPoints.toFixed(1)} pts`
                : "Not estimated"}
            </span>

            {task.assignedTo ? (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-6 w-6 hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-700 transition-all">
                        <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {getAssignedUser(task.assignedTo)?.initials || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="font-medium dark:bg-gray-800 dark:text-gray-200">
                      <p>
                        {getAssignedUser(task.assignedTo)?.name || 'User'}
                        {getAssignedUser(task.assignedTo)?.lastName ? 
                          ` ${getAssignedUser(task.assignedTo)?.lastName}` : 
                          ''}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                  Unassigned
                </span>
              )}
        </div>
        
          <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2 sm:ml-3">
          <Button
            variant="ghost"
            size="icon"
              className="h-7 w-7 dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            disabled={isMoving || isDeleting}
          >
            <Edit size={14} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                  className="h-7 text-xs dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" 
                disabled={isMoving || isDeleting}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={`px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                  {getStatusDisplayText(task.status)}
                </span>
                <ChevronDown size={14} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent onClick={(e) => e.stopPropagation()} className="dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "to-do")} className="dark:text-gray-200 dark:hover:bg-gray-700">
                To Do
              </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "in-progress")} className="dark:text-gray-200 dark:hover:bg-gray-700">
                In Progress
              </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "review")} className="dark:text-gray-200 dark:hover:bg-gray-700">
                In Review
              </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "done")} className="dark:text-gray-200 dark:hover:bg-gray-700">
                Done
              </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "closed")} className="dark:text-gray-200 dark:hover:bg-gray-700">
                Closed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {onMoveToSprint && availableSprints && availableSprints.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                    className="h-7 text-xs dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  disabled={isMoving || isDeleting || availableSprints.length === 0}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isMoving ? (
                    <>
                      <Loader2 size={14} className="mr-1 animate-spin" />
                      <span className="hidden sm:inline">Moving...</span>
                    </>
                  ) : (
                    <>
                      <MoveRight size={14} className="mr-1" />
                      <span className="hidden sm:inline">Move to sprint</span>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                {availableSprints.length === 0 ? (
                    <DropdownMenuItem disabled className="dark:text-gray-400">No sprints available</DropdownMenuItem>
                ) : (
                  availableSprints.map((sprint) => (
                    <DropdownMenuItem 
                      key={sprint.id} 
                      onClick={() => handleMoveToSprint(sprint.id)}
                      disabled={isMoving || isDeleting}
                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      {movingToSprintId === sprint.id ? (
                        <>
                          <Loader2 size={14} className="mr-1 animate-spin" />
                          Moving...
                        </>
                      ) : (
                        sprint.name
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {onMoveToBacklog && (
            <Button
              variant="outline"
              size="sm"
                className="h-7 text-xs dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                handleMoveToBacklog();
              }}
              disabled={isMoving || isDeleting}
            >
              {isMoving ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  <span className="hidden sm:inline">Moving...</span>
                </>
              ) : (
                <>
                  <MoveRight size={14} className="mr-1" />
                  <span className="hidden sm:inline">To backlog</span>
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30" 
            disabled={isMoving || isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            title="Delete task"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash size={14} />}
          </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-200">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              This action will permanently delete the task "{task.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteTask();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <IssueDetailModal
        isOpen={isIssueDetailOpen}
        onOpenChange={setIsIssueDetailOpen}
        task={task}
        onTaskUpdate={handleTaskUpdate}
        getAssignedUser={getAssignedUser}
        onOpenEditModal={handleOpenEditModal}
      />
    </div>
  );
}