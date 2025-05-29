import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CreateSprintModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSprint: (sprintData: {
    name: string;
    goal: string;
  }) => void;
}

export function CreateSprintModal({
  isOpen,
  onOpenChange,
  onCreateSprint,
}: CreateSprintModalProps) {
  const [sprintName, setSprintName] = useState("");
  const [sprintGoal, setSprintGoal] = useState("");

  const handleCreateSprint = () => {
    onCreateSprint({
      name: sprintName,
      goal: sprintGoal
    });

    // Reset form
    setSprintName("");
    setSprintGoal("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">Crear nuevo sprint</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sprint-name" className="text-right dark:text-gray-200">
              Nombre
            </Label>
            <Input
              id="sprint-name"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
              placeholder="Nombre del sprint"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sprint-goal" className="text-right dark:text-gray-200">
              Meta
            </Label>
            <Textarea
              id="sprint-goal"
              value={sprintGoal}
              onChange={(e) => setSprintGoal(e.target.value)}
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
              rows={3}
            />
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
            onClick={handleCreateSprint}
            className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            disabled={!sprintName.trim()}
          >
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 