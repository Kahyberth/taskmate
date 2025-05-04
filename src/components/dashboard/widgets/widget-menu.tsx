import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { WidgetSize } from "@/data/dashboard-types";

interface WidgetMenuProps {
  onChangeSize: (size: WidgetSize) => void;
  onRemove: () => void;
}

export function WidgetMenu({ onChangeSize, onRemove }: WidgetMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem onClick={() => onChangeSize("small")}>Small</DropdownMenuItem> */}
        <DropdownMenuItem onClick={() => onChangeSize("medium")}>Medium</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeSize("large")}>Large</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRemove}>Remove</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}