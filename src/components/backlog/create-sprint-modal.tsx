import { useState } from "react";
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

interface CreateSprintModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSprint: (sprintData: {
    name: string;
    goal: string;
    startDate?: Date;
    endDate?: Date;
  }) => void;
}

export function CreateSprintModal({
  isOpen,
  onOpenChange,
  onCreateSprint,
}: CreateSprintModalProps) {
  const [sprintName, setSprintName] = useState("");
  const [sprintGoal, setSprintGoal] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleCreateSprint = () => {
    onCreateSprint({
      name: sprintName,
      goal: sprintGoal,
      startDate,
      endDate
    });

    // Reset form
    setSprintName("");
    setSprintGoal("");
    setStartDate(undefined);
    setEndDate(undefined);
    onOpenChange(false);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setEndDateOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Sprint</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sprint-name" className="text-right text-foreground">
              Name
            </Label>
            <Input
              id="sprint-name"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              className="col-span-3 bg-background text-foreground border-border"
              placeholder="Sprint name"
              required
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
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-foreground" />
                  {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
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
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-foreground" />
                  {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  initialFocus
                  disabled={(date) => {
                    // Deshabilitar fechas antes de la fecha de inicio
                    if (startDate) {
                      return date < startDate;
                    }
                    // Deshabilitar fechas pasadas si no hay fecha de inicio
                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                  }}
                  className="rounded-md border bg-popover"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sprint-goal" className="text-right text-foreground">
              Goal
            </Label>
            <Textarea
              id="sprint-goal"
              value={sprintGoal}
              onChange={(e) => setSprintGoal(e.target.value)}
              className="col-span-3 bg-background text-foreground border-border"
              rows={3}
              placeholder="Sprint goal (optional)"
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
            onClick={handleCreateSprint}
            disabled={!sprintName.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}