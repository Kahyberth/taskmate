import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, CheckCheck, FileText, Download, MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatMessageProps {
  message: {
    id: string
    type: "text" | "file" | "image"
    content: string
    sender: {
      name: string
      image: string
    }
    timestamp: string
    status: "sent" | "delivered" | "seen"
    fileType?: string
    fileSize?: string
  }
  showAvatar?: boolean
}

const statusIcons = {
  sent: Check,
  delivered: CheckCheck,
  seen: () => (
    <CheckCheck className="text-blue-500" />
  ),
}

export function ChatMessage({ message, showAvatar = true }: ChatMessageProps) {
  const StatusIcon = statusIcons[message.status]

  return (
    <div className="group flex items-start gap-3">
      {showAvatar ? (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.image} />
          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8" />
      )}
      <div className="flex-1 space-y-1">
        {showAvatar && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {message.sender.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {message.timestamp}
            </span>
          </div>
        )}

        <div className="flex items-start gap-2">
          <div className="flex-1">
            {message.type === "text" ? (
              <div className="w-fit max-w-[85%] rounded-lg bg-accent/50 px-4 py-2">
                <p className="text-sm">{message.content}</p>
              </div>
            ) : message.type === "file" ? (
              <div className="w-fit rounded-lg border bg-background p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{message.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {message.fileSize}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-fit max-w-[85%] overflow-hidden rounded-lg border bg-background p-1 shadow-sm">
                <img
                  src={message.content || "/placeholder.svg"}
                  alt="Shared image"
                  className="rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
            <StatusIcon className="h-3 w-3 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Responder</DropdownMenuItem>
                <DropdownMenuItem>Reaccionar</DropdownMenuItem>
                <DropdownMenuItem>Reenviar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

