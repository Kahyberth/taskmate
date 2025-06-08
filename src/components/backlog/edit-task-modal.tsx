import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/interfaces/task.interface";
import { Epic } from "@/interfaces/epic.interface";

interface EditTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (updatedTask: Partial<Task>) => void;
  projectMembers: any[];
  loadingMembers: boolean;
  epics: Epic[];
  onOpenEpicDialog: () => void;
}

export function EditTaskModal({
  isOpen,
  onOpenChange,
  task,
  onSave,
  projectMembers,
  loadingMembers,
  epics,
  onOpenEpicDialog
}: EditTaskModalProps) {
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState<Task["priority"]>("medium");
  const [editTaskStatus, setEditTaskStatus] = useState<Task["status"]>("to-do");
  const [editTaskStoryPoints, setEditTaskStoryPoints] = useState<number>(0);
  const [editTaskAssignedTo, setEditTaskAssignedTo] = useState<string | undefined>("unassigned");
  const [editTaskType, setEditTaskType] = useState<Task["type"]>('user_story');
  const [editTaskEpic, setEditTaskEpic] = useState<Epic | null>(null);
  const [editTaskAcceptanceCriteria, setEditTaskAcceptanceCriteria] = useState("");

  useEffect(() => {
    if (task) {
      setEditTaskTitle(task.title);
      setEditTaskDescription(task.description || "");
      setEditTaskPriority(task.priority);
      setEditTaskStatus(task.status);
      setEditTaskStoryPoints(task.storyPoints || 0);
      setEditTaskAssignedTo(task.assignedTo || "unassigned");
      setEditTaskType(task.type || 'user_story');
      setEditTaskEpic(task.epic || null);
      setEditTaskAcceptanceCriteria(task.acceptanceCriteria || "");
    }
  }, [task]);

  const handleSaveTaskEdit = () => {
    if (!task) return;
    
    const updatedTask = {
      id: task.id,
      title: editTaskTitle,
      description: editTaskDescription,
      priority: editTaskPriority,
      status: editTaskStatus,
      storyPoints: editTaskStoryPoints,
      assignedTo: editTaskAssignedTo === "unassigned" ? undefined : editTaskAssignedTo,
      type: editTaskType,
      epic: editTaskEpic,
      acceptanceCriteria: editTaskAcceptanceCriteria,
    };

    onSave(updatedTask);
    onOpenChange(false);
  };

  const handleStoryPointsChange = (value: string) => {
    const parsedValue = Number.parseFloat(value);
    if (!isNaN(parsedValue)) {
      setEditTaskStoryPoints(parsedValue);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">Edit User Story</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-title" className="text-right dark:text-gray-200">
              Title
            </Label>
            <Input
              id="task-title"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-description" className="text-right dark:text-gray-200">
              Description
            </Label>
            <Textarea
              id="task-description"
              value={editTaskDescription}
              onChange={(e) => setEditTaskDescription(e.target.value)}
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-acceptance-criteria" className="text-right dark:text-gray-200">
              Acceptance Criteria
            </Label>
            <Textarea
              id="task-acceptance-criteria"
              value={editTaskAcceptanceCriteria}
              onChange={(e) => setEditTaskAcceptanceCriteria(e.target.value)}
              placeholder="Define the criteria to consider this task as completed (one criterion per line)..."
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Priority</Label>
            <RadioGroup
              value={editTaskPriority}
              onValueChange={(value) => setEditTaskPriority(value as "low" | "medium" | "high" | "critical")}
              className="col-span-3 flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="priority-low" className="dark:border-gray-700" />
                <Label htmlFor="priority-low" className="text-green-600 dark:text-green-400">
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="priority-medium" className="dark:border-gray-700" />
                <Label htmlFor="priority-medium" className="text-yellow-600 dark:text-yellow-400">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="priority-high" className="dark:border-gray-700" />
                <Label htmlFor="priority-high" className="text-red-600 dark:text-red-400">
                  High
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Status</Label>
            <Select
              value={editTaskStatus}
              onValueChange={(value) => setEditTaskStatus(value as Task["status"])}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="to-do" className="dark:text-gray-200">To Do</SelectItem>
                <SelectItem value="in-progress" className="dark:text-gray-200">In Progress</SelectItem>
                <SelectItem value="review" className="dark:text-gray-200">In Review</SelectItem>
                <SelectItem value="done" className="dark:text-gray-200">Done</SelectItem>
                <SelectItem value="closed" className="dark:text-gray-200">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Type</Label>
            <Select
              value={editTaskType}
              onValueChange={(value) => setEditTaskType(value as 'bug' | 'feature' | 'task' | 'refactor' | 'user_story')}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="user_story" className="dark:text-gray-200">User Story</SelectItem>
                <SelectItem value="task" className="dark:text-gray-200">Task</SelectItem>
                <SelectItem value="bug" className="dark:text-gray-200">Bug</SelectItem>
                <SelectItem value="feature" className="dark:text-gray-200">Feature</SelectItem>
                <SelectItem value="refactor" className="dark:text-gray-200">Refactor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="story-points" className="text-right dark:text-gray-200">
              Points
            </Label>
            <Select
              value={editTaskStoryPoints.toString()}
              onValueChange={(value) => handleStoryPointsChange(value)}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select points" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="0" className="dark:text-gray-200">Not estimated (0 points)</SelectItem>
                <SelectItem value="1" className="dark:text-gray-200">1 point</SelectItem>
                <SelectItem value="2" className="dark:text-gray-200">2 points</SelectItem>
                <SelectItem value="3" className="dark:text-gray-200">3 points</SelectItem>
                <SelectItem value="5" className="dark:text-gray-200">5 points</SelectItem>
                <SelectItem value="8" className="dark:text-gray-200">8 points</SelectItem>
                <SelectItem value="13" className="dark:text-gray-200">13 points</SelectItem>
                <SelectItem value="20" className="dark:text-gray-200">20 points</SelectItem>
                <SelectItem value="40" className="dark:text-gray-200">40 points</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Epic</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select
                value={editTaskEpic?.id || "none"}
                onValueChange={(value) => setEditTaskEpic(epics.find(epic => epic.id === value) || null)}
              >
                <SelectTrigger className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Select epic" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="none" className="dark:text-gray-200">No epic</SelectItem>
                  {epics.map((epic) => (
                    <SelectItem key={epic.id} value={epic.id} className="dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"/>
                        {epic.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" 
                onClick={onOpenEpicDialog}
              >
                Manage Epics
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Assigned to</Label>
            <Select
              value={editTaskAssignedTo || "unassigned"}
              onValueChange={(value) => setEditTaskAssignedTo(value === "unassigned" ? undefined : value)}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="unassigned" className="dark:text-gray-200">Unassigned</SelectItem>
                {loadingMembers ? (
                  <SelectItem value="loading" disabled className="dark:text-gray-400">Loading members...</SelectItem>
                ) : projectMembers.length > 0 ? (
                  projectMembers.map((member) => (
                    <SelectItem key={member.userId} value={member.userId} className="dark:text-gray-200">
                      {member.name ? `${member.name} ${member.lastName || ''}` : member.userId}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-members" disabled className="dark:text-gray-400">No members available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSaveTaskEdit}
            className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}