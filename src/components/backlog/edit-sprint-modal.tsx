import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Sprint } from "@/interfaces/sprint.interface";

interface EditSprintModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sprint: Sprint | null;
  onSave: (updatedSprint: Sprint) => void;
}

export function EditSprintModal({
  isOpen,
  onOpenChange,
  sprint,
  onSave
}: EditSprintModalProps) {
  const [editSprintName, setEditSprintName] = useState("");
  const [editSprintStartDate, setEditSprintStartDate] = useState<Date>();
  const [editSprintEndDate, setEditSprintEndDate] = useState<Date>();
  const [editSprintGoal, setEditSprintGoal] = useState("");

  useEffect(() => {
    if (sprint) {
      setEditSprintName(sprint.name);
      setEditSprintStartDate(sprint.startedAt || undefined);
      setEditSprintEndDate(sprint.fnishedAt || undefined);
      setEditSprintGoal(sprint.goal || "");
    }
  }, [sprint]);

  const handleSaveSprintEdit = () => {
    if (!sprint) return;

    const updatedSprint: Sprint = {
      ...sprint,
      name: editSprintName,
      startedAt: editSprintStartDate || null,
      fnishedAt: editSprintEndDate || null,
      goal: editSprintGoal,
    };

    onSave(updatedSprint);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">Edit Sprint</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-name" className="text-right dark:text-gray-200">
              Name
            </Label>
            <Input
              id="edit-sprint-name"
              value={editSprintName}
              onChange={(e) => setEditSprintName(e.target.value)}
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
                    !editSprintStartDate && "text-muted-foreground dark:text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editSprintStartDate ? format(editSprintStartDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                <Calendar
                  mode="single"
                  selected={editSprintStartDate}
                  onSelect={setEditSprintStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
                    !editSprintEndDate && "text-muted-foreground dark:text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editSprintEndDate ? format(editSprintEndDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                <Calendar mode="single" selected={editSprintEndDate} onSelect={setEditSprintEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-goal" className="text-right dark:text-gray-200">
              Goal
            </Label>
            <Textarea
              id="edit-sprint-goal"
              value={editSprintGoal}
              onChange={(e) => setEditSprintGoal(e.target.value)}
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
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSaveSprintEdit}
            className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}