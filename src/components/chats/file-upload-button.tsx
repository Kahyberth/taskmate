import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type LucideIcon } from 'lucide-react'

interface FileUploadButtonProps {
  icon: LucideIcon
  accept: string
  tooltip: string
}

export function FileUploadButton({
  icon: Icon,
  accept,
  tooltip,
}: FileUploadButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
        >
          <input
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept={accept}
          />
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

