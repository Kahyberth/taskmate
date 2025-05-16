import { Circle } from "lucide-react";
import { Epic } from "@/interfaces/epic.interface";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define available epic colors - should match those in epic-dialog.tsx
const epicColors = [
  { name: "purple", value: "#9333ea", bg: "bg-purple-100", text: "text-purple-800" },
  { name: "blue", value: "#2563eb", bg: "bg-blue-100", text: "text-blue-800" },
  { name: "green", value: "#16a34a", bg: "bg-green-100", text: "text-green-800" },
  { name: "yellow", value: "#ca8a04", bg: "bg-yellow-100", text: "text-yellow-800" },
  { name: "red", value: "#dc2626", bg: "bg-red-100", text: "text-red-800" },
  { name: "pink", value: "#db2777", bg: "bg-pink-100", text: "text-pink-800" },
  { name: "indigo", value: "#4f46e5", bg: "bg-indigo-100", text: "text-indigo-800" },
  { name: "gray", value: "#4b5563", bg: "bg-gray-100", text: "text-gray-800" },
];

interface EpicBadgeProps {
  epic: Epic;
}

export function EpicBadge({ epic }: EpicBadgeProps) {
  const getEpicColorClasses = (color?: string) => {
    if (!color) return "bg-gray-100 text-gray-800";
    const epicColor = epicColors.find(c => c.value === color);
    return epicColor ? `${epicColor.bg} ${epicColor.text}` : "bg-gray-100 text-gray-800";
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getEpicColorClasses(epic.color)}`}>
            <Circle size={8} className="fill-current" />
            <span>{epic.title}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p className="font-medium">Épica: {epic.title}</p>
          {epic.description && <p className="text-xs">{epic.description}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 