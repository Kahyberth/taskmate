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
  const [editSprintStartDate, setEditSprintStartDate] = useState<Date | undefined>();
  const [editSprintEndDate, setEditSprintEndDate] = useState<Date | undefined>();
  const [editSprintGoal, setEditSprintGoal] = useState("");
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  useEffect(() => {
    if (sprint) {
      setEditSprintName(sprint.name);
      setEditSprintStartDate(sprint.startedAt ? new Date(sprint.startedAt) : undefined);
      setEditSprintEndDate(sprint.fnishedAt ? new Date(sprint.fnishedAt) : undefined);
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

  const handleStartDateSelect = (date: Date | undefined) => {
    setEditSprintStartDate(date);
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEditSprintEndDate(date);
    setEndDateOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Sprint</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-name" className="text-right text-foreground">
              Name
            </Label>
            <Input
              id="edit-sprint-name"
              value={editSprintName}
              onChange={(e) => setEditSprintName(e.target.value)}
              className="col-span-3 bg-background text-foreground border-border"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-foreground">Start Date</Label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal bg-background text-foreground border-border",
                    !editSprintStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-foreground" />
                  {editSprintStartDate ? format(editSprintStartDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editSprintStartDate}
                  onSelect={handleStartDateSelect}
                  initialFocus
                  disabled={(date) => {
                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                  }}
                  className="rounded-md border bg-popover"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-foreground">End Date</Label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal bg-background text-foreground border-border",
                    !editSprintEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-foreground" />
                  {editSprintEndDate ? format(editSprintEndDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  mode="single" 
                  selected={editSprintEndDate} 
                  onSelect={handleEndDateSelect} 
                  initialFocus
                  disabled={(date) => {
                    
                    if (editSprintStartDate) {
                      return date < editSprintStartDate;
                    }
                    
                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                  }}
                  className="rounded-md border bg-popover"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-goal" className="text-right text-foreground">
              Goal
            </Label>
            <Textarea
              id="edit-sprint-goal"
              value={editSprintGoal}
              onChange={(e) => setEditSprintGoal(e.target.value)}
              className="col-span-3 bg-background text-foreground border-border"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSaveSprintEdit}
            disabled={!editSprintName.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}