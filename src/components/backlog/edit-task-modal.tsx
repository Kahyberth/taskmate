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
  teamMembers: any[];
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
  teamMembers,
  epics,
  onOpenEpicDialog
}: EditTaskModalProps) {
  // Task state
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState<Task["priority"]>("medium");
  const [editTaskStatus, setEditTaskStatus] = useState<Task["status"]>("to-do");
  const [editTaskStoryPoints, setEditTaskStoryPoints] = useState<number>(0);
  const [editTaskAssignedTo, setEditTaskAssignedTo] = useState<string | undefined>("unassigned");
  const [editTaskType, setEditTaskType] = useState<'bug' | 'feature' | 'task' | 'refactor' | 'user_story'>('user_story');
  const [editTaskEpicId, setEditTaskEpicId] = useState<string | undefined>(undefined);

  // Update form state when task changes
  useEffect(() => {
    if (task) {
      setEditTaskTitle(task.title);
      setEditTaskDescription(task.description || "");
      setEditTaskPriority(task.priority);
      setEditTaskStatus(task.status);
      setEditTaskStoryPoints(task.storyPoints || 0);
      setEditTaskAssignedTo(task.assignedTo || "unassigned");
      setEditTaskType(task.type || 'user_story');
      setEditTaskEpicId(task.epicId);
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
      epicId: editTaskEpicId,
    };

    onSave(updatedTask);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">Editar historia de usuario</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-title" className="text-right dark:text-gray-200">
              Título
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
              Descripción
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
            <Label className="text-right dark:text-gray-200">Prioridad</Label>
            <RadioGroup
              value={editTaskPriority}
              onValueChange={(value) => setEditTaskPriority(value as "low" | "medium" | "high" | "critical")}
              className="col-span-3 flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="priority-low" className="dark:border-gray-700" />
                <Label htmlFor="priority-low" className="text-green-600 dark:text-green-400">
                  Baja
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="priority-medium" className="dark:border-gray-700" />
                <Label htmlFor="priority-medium" className="text-yellow-600 dark:text-yellow-400">
                  Media
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="priority-high" className="dark:border-gray-700" />
                <Label htmlFor="priority-high" className="text-red-600 dark:text-red-400">
                  Alta
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Estado</Label>
            <Select
              value={editTaskStatus}
              onValueChange={(value) => setEditTaskStatus(value as "to-do" | "in-progress" | "resolved" | "closed" | "review")}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="to-do" className="dark:text-gray-200">Por hacer</SelectItem>
                <SelectItem value="in-progress" className="dark:text-gray-200">En progreso</SelectItem>
                <SelectItem value="resolved" className="dark:text-gray-200">Resuelto</SelectItem>
                <SelectItem value="closed" className="dark:text-gray-200">Cerrado</SelectItem>
                <SelectItem value="review" className="dark:text-gray-200">En revisión</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Tipo</Label>
            <Select
              value={editTaskType}
              onValueChange={(value) => setEditTaskType(value as 'bug' | 'feature' | 'task' | 'refactor' | 'user_story')}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Seleccionar tipo" />
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
              Puntos
            </Label>
            <Select
              value={editTaskStoryPoints.toString()}
              onValueChange={(value) => setEditTaskStoryPoints(Number.parseFloat(value))}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Seleccionar puntos" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="0" className="dark:text-gray-200">Sin estimar (0 puntos)</SelectItem>
                <SelectItem value="0.5" className="dark:text-gray-200">0.5 puntos</SelectItem>
                <SelectItem value="1" className="dark:text-gray-200">1 punto</SelectItem>
                <SelectItem value="2" className="dark:text-gray-200">2 puntos</SelectItem>
                <SelectItem value="3" className="dark:text-gray-200">3 puntos</SelectItem>
                <SelectItem value="5" className="dark:text-gray-200">5 puntos</SelectItem>
                <SelectItem value="8" className="dark:text-gray-200">8 puntos</SelectItem>
                <SelectItem value="13" className="dark:text-gray-200">13 puntos</SelectItem>
                <SelectItem value="20" className="dark:text-gray-200">20 puntos</SelectItem>
                <SelectItem value="40" className="dark:text-gray-200">40 puntos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Épica</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select
                value={editTaskEpicId || "none"}
                onValueChange={(value) => setEditTaskEpicId(value === "none" ? undefined : value)}
              >
                <SelectTrigger className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Seleccionar épica" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="none" className="dark:text-gray-200">Sin épica</SelectItem>
                  {epics.map((epic) => (
                    <SelectItem key={epic.id} value={epic.id} className="dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: epic.color || "#4b5563" }}
                        />
                        {epic.title}
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
                Gestionar épicas
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Asignado a</Label>
            <Select
              value={editTaskAssignedTo || "unassigned"}
              onValueChange={(value) => setEditTaskAssignedTo(value === "unassigned" ? undefined : value)}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Seleccionar miembro" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="unassigned" className="dark:text-gray-200">Sin asignar</SelectItem>
                {loadingMembers ? (
                  <SelectItem value="loading" disabled className="dark:text-gray-400">Cargando miembros...</SelectItem>
                ) : projectMembers.length > 0 ? (
                  projectMembers.map((member) => (
                    <SelectItem key={member.user_id} value={member.user_id} className="dark:text-gray-200">
                      {member.user ? `${member.user.name} ${member.user.lastName || ''}` : member.user_id}
                    </SelectItem>
                  ))
                ) : (
                  // Fallback a miembros de ejemplo si no hay miembros reales
                  teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id} className="dark:text-gray-200">
                      {member.name}
                    </SelectItem>
                  ))
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
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSaveTaskEdit}
            className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 