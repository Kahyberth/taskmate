import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, Video, Info, ImageIcon, File, Smile, Send, Users, MoreVertical, Search } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatMessage } from "./chat-message"
import { FileUploadButton } from "./file-upload-button"

interface ChatMainProps {
  chatId: string
}

const messages = [
  {
    id: "1",
    type: "text" as "text",
    content: "Hola equipo, ¿cómo va el desarrollo del nuevo feature?",
    sender: {
      name: "María García",
      image: "/placeholder.svg",
    },
    timestamp: "10:30",
    status: "seen",
  },
  {
    id: "2",
    type: "text",
    content: "Vamos bien, ya terminamos la parte del frontend",
    sender: {
      name: "Carlos Ruiz",
      image: "/placeholder.svg",
    },
    timestamp: "10:31",
    status: "delivered",
  },
  {
    id: "3",
    type: "file" as const,
    content: "diseño-final.fig",
    fileType: "fig",
    fileSize: "2.4 MB",
    sender: {
      name: "Ana Martínez",
      image: "/placeholder.svg",
    },
    timestamp: "10:32",
    status: "sent",
  },
]

export function ChatMain({ chatId }: ChatMainProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle message submission
    setMessage("")
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex items-center justify-between border-b px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Equipo Frontend</h2>
              <Badge variant="secondary" className="rounded-full">
                <Users className="mr-1 h-3 w-3" />
                5
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              María García está escribiendo...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Info className="mr-2 h-4 w-4" />
                Información del chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" />
                Buscar en el chat
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Salir del grupo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              showAvatar={
                index === 0 || 
                messages[index - 1].sender.name !== message.sender.name
              }
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex gap-1">
            <FileUploadButton 
              icon={ImageIcon}
              accept="image/*"
              tooltip="Enviar imagen"
            />
            <FileUploadButton 
              icon={File}
              accept=".doc,.docx,.pdf"
              tooltip="Enviar archivo"
            />
          </div>
          <div className="relative flex-1">
            <Input
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-accent/50 border-0 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button type="submit" size="icon" className="h-10 w-10 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

