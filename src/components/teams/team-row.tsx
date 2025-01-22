import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronRight, MoreHorizontal, Users } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Team } from "@/lib/store"

interface TeamRowProps {
  team: Team
}

export function TeamRow({ team }: TeamRowProps) {
  return (
    <div className="group relative rounded-lg border p-4 hover:border-primary">
      <Link to={`/dashboard/teams/${team.id}`} className="absolute inset-0 z-10" />
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <div className="space-y-1">
          <h3 className="font-semibold">{team.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {team.description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {team.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +{team.members.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div>
            <p className="font-medium">{team.projects}</p>
            <p className="text-muted-foreground">Proyectos</p>
          </div>
          <div>
            <p className="font-medium">{team.tasks}</p>
            <p className="text-muted-foreground">Tareas</p>
          </div>
        </div>

        <div className="w-32">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progreso</span>
            <span>{team.progress}%</span>
          </div>
          <Progress value={team.progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative z-20 h-8 w-8"
          >
            <Users className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative z-20 h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
              <DropdownMenuItem>Invitar miembros</DropdownMenuItem>
              <DropdownMenuItem>Editar equipo</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Abandonar equipo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

