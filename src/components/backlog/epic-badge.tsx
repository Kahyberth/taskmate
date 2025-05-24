import { Circle } from "lucide-react";
import { Epic } from "@/interfaces/epic.interface";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EpicBadgeProps {
  epic: Epic;
}

export function EpicBadge({ epic }: EpicBadgeProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white dark:text-gray-100">
            <Circle size={8} className="fill-current" />
            <span>{epic.name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="dark:bg-gray-800 dark:text-gray-200">
          <p className="font-medium">Épica: {epic.name}</p>
          {epic.description && <p className="text-xs dark:text-gray-400">{epic.description}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 