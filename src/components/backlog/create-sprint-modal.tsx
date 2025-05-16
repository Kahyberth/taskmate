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
    startDate?: Date;
    endDate?: Date;
    goal: string;
  }) => void;
  nextSprintNumber: number;
}

export function CreateSprintModal({
  isOpen,
  onOpenChange,
  onCreateSprint,
  nextSprintNumber
}: CreateSprintModalProps) {
  const [sprintName, setSprintName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [sprintGoal, setSprintGoal] = useState("");

  const handleCreateSprint = () => {
    onCreateSprint({
      name: sprintName || `Tablero Sprint ${nextSprintNumber}`,
      startDate,
      endDate,
      goal: sprintGoal
    });

    // Reset form
    setSprintName("");
    setStartDate(undefined);
    setEndDate(undefined);
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
              placeholder={`Tablero Sprint ${nextSprintNumber}`}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Fecha inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
                    !startDate && "text-muted-foreground dark:text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right dark:text-gray-200">Fecha fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
                    !endDate && "text-muted-foreground dark:text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
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
          >
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 