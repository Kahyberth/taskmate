import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Task } from "@/interfaces/task.interface";
import { Epic } from "@/interfaces/epic.interface";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getPriorityColor, getStatusColor, getStatusDisplayText } from "@/lib/utils";

interface EpicIssuesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  epic: Epic | null;
  issuesbyepic: Task[];
  onEditTask: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  getAssignedUser: (userId?: string) => { initials: string } | null;
}

export function EpicIssuesDialog({
  open,
  onOpenChange,
  epic,
  issuesbyepic,
  onEditTask,
  getAssignedUser,
}: EpicIssuesDialogProps) {
  if (!epic) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[80vh] overflow-y-auto"
        aria-describedby="epic-issues-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
            {epic.name}
          </DialogTitle>
          <DialogDescription id="epic-issues-description">
            Tasks associated with the epic {epic.name}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {issuesbyepic.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              There are no tasks associated with this epic
            </div>
          ) : (
            <div className="space-y-2">
              {issuesbyepic.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-3 border border-black/10 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{task.code}</span>
                      <h3 className="text-sm font-medium truncate">{task.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {task.priority && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusDisplayText(task.status)}
                      </span>
                      {task.assignedTo && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {getAssignedUser(task.assignedTo)?.initials || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => onEditTask(task)}
                  >
                    <Edit size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}