import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Notifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge 
            variant="secondary" 
            className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-blue-600 p-0 text-[10px] font-bold text-white"
          >
            3
          </Badge>
          <span className="sr-only">Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex flex-col items-start">
          <p className="font-medium">Nueva tarea asignada</p>
          <p className="text-sm text-gray-500">María te asignó una nueva tarea</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-col items-start">
          <p className="font-medium">Comentario nuevo</p>
          <p className="text-sm text-gray-500">Carlos comentó en tu tarea</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-col items-start">
          <p className="font-medium">Reunión programada</p>
          <p className="text-sm text-gray-500">Daily Standup en 30 minutos</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

