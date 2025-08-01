import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, CheckSquare } from "lucide-react";
import { TaskItem } from "./task-item";
import { Task } from "@/interfaces/task.interface";
import { Epic } from "@/interfaces/epic.interface";
import { AssignedUser } from "@/interfaces/assigned-user.interface";
import { useMemo } from "react";
import { Pagination } from '@mantine/core';
import { CreateIssueForm } from "./create-issue-form";
import { TaskSkeleton } from "./task-skeleton";

interface BacklogSectionProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  tasks: Task[];
  totalTasks: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onMoveTaskToSprint: (taskId: string, sprintId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onCreateSprint: () => void;
  onDeleteTask: (taskId: string) => void;
  availableSprints: { id: string; name: string }[];
  newUserStoryTitle: string;
  onNewUserStoryTitleChange: (title: string) => void;
  newUserStoryType: 'bug' | 'feature' | 'task' | 'refactor' | 'user_story';
  onNewUserStoryTypeChange: (type: 'bug' | 'feature' | 'task' | 'refactor' | 'user_story') => void;
  newUserStoryPriority: 'low' | 'medium' | 'high' | 'critical';
  onNewUserStoryPriorityChange: (priority: 'low' | 'medium' | 'high' | 'critical') => void;
  newUserStoryEpic?: Epic | null;
  onNewUserStoryEpicChange: (epic: Epic | null) => void;
  onCreateUserStory: () => Promise<void>;
  getAssignedUser: (userId?: string) => AssignedUser | null;
  onAssignUser?: (taskId: string, userId: string | undefined) => void;
  epics: Epic[];
  onOpenEpicDialog: () => void;
  searchTerm: string;
  isLoading: boolean;
}

export function BacklogSection({
  isExpanded,
  onToggleExpand,
  tasks,
  totalTasks,
  totalPages,
  currentPage,
  onPageChange,
  onToggleTaskCompletion,
  onEditTask,
  onMoveTaskToSprint,
  onStatusChange,
  onCreateSprint,
  onDeleteTask,
  availableSprints,
  newUserStoryTitle,
  onNewUserStoryTitleChange,
  newUserStoryType,
  onNewUserStoryTypeChange,
  newUserStoryPriority,
  onNewUserStoryPriorityChange,
  newUserStoryEpic,
  onNewUserStoryEpicChange,
  onCreateUserStory,
  getAssignedUser,
  onAssignUser,
  epics = [],
  searchTerm,
  isLoading = false,
}: BacklogSectionProps) {
  const taskCounts = useMemo(() => {
    const todoCount = tasks.filter(task => task.status === "to-do").length;
    const inProgressCount = tasks.filter(task => 
      task.status === "in-progress" || task.status === "review"
    ).length;
    const doneCount = tasks.filter(task => 
      task.status === "done" || task.status === "closed"
    ).length;
    
    return { todoCount, inProgressCount, doneCount };
  }, [tasks]);

  const handleToggleClick = (e: React.MouseEvent) => {
    if (e.target instanceof Element && 
        (e.target.closest('.backlog-header') || 
         e.target.classList.contains('backlog-header'))) {
      onToggleExpand();
    }
  };
  
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="border border-black/10 dark:border-white/10 rounded-md p-3 shadow-sm bg-white dark:bg-black/20 mb-6">
      <div className="flex items-center mb-2 backlog-header" onClick={handleToggleClick}>
        <div className="flex items-center cursor-pointer">
          <ChevronDown
            size={16}
            className={`mr-2 transition-transform ${isExpanded ? "transform rotate-0" : "transform rotate-270"}`}
          />
          <h3 className="text-lg font-semibold dark:text-gray-200 ml-2">Backlog</h3>
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
            {searchTerm ? (
              <>Filtering: {totalTasks} result{totalTasks !== 1 ? 's' : ''}</>
            ) : (
              `(${totalTasks} tasks)`
            )}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{taskCounts.todoCount}</span>
          <div className="w-6 h-4 bg-blue-100 dark:bg-blue-900/30 rounded-sm flex items-center justify-center text-xs text-blue-800 dark:text-blue-300">
            {taskCounts.inProgressCount}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{taskCounts.doneCount}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" 
            onClick={(e) => {
              e.stopPropagation();
              onCreateSprint();
            }}
          >
            Create Sprint
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal size={14} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-8">
          <p className="text-md">
            Create Issue
          </p>
            
          <CreateIssueForm
            onCreateUserStory={onCreateUserStory}
            newUserStoryTitle={newUserStoryTitle}
            onNewUserStoryTitleChange={onNewUserStoryTitleChange}
            newUserStoryType={newUserStoryType}
            onNewUserStoryTypeChange={onNewUserStoryTypeChange}
            newUserStoryPriority={newUserStoryPriority}
            onNewUserStoryPriorityChange={onNewUserStoryPriorityChange}
            newUserStoryEpic={newUserStoryEpic}
            onNewUserStoryEpicChange={onNewUserStoryEpicChange}
            epics={epics}
          />

          <div className="mt-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TaskSkeleton key={index} />
              ))
            ) : tasks.length > 0 ? (
              <>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleCompletion={onToggleTaskCompletion}
                    onEdit={onEditTask}
                    onMoveToSprint={onMoveTaskToSprint}
                    availableSprints={availableSprints}
                    getAssignedUser={getAssignedUser}
                    onStatusChange={onStatusChange}
                    onAssignUser={onAssignUser}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No tasks matching the search were found" : "No tasks in the backlog"}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination 
                total={totalPages}
                value={currentPage} 
                onChange={handlePageChange}
                size="sm"
                radius="md"
                withEdges
                getItemProps={(page) => ({
                  style: {
                    backgroundColor: page === currentPage ? '#4263EB' : '',
                    color: page === currentPage ? 'white' : '',
                  }
                })}
              />
              <div className="ml-4 text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>
      )}
      
      {isExpanded && tasks.length > 0 && (
        <div className="flex items-center justify-center py-4 text-gray-400 dark:text-gray-500">
          <CheckSquare size={16} className="mr-2" />
          <span className="text-sm">
            {totalTasks} tasks | Estimation:{" "}
            {tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0).toFixed(1).replace(/\.0$/, '')} points
            {tasks.some(task => task.storyPoints === 0 || task.storyPoints === undefined) && 
              " (some tasks not estimated)"}
          </span>
        </div>
      )}
    </div>
  );
}