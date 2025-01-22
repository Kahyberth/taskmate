import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Users } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Team } from "@/lib/store"

interface TeamCardProps {
  team: Team
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary">
      <Link to={`/dashboard/teams/${team.id}`} className="absolute inset-0 z-10" />
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{team.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {team.description}
            </p>
          </div>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso general</span>
            <span className="font-medium">{team.progress}%</span>
          </div>
          <Progress value={team.progress} />
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <p className="font-medium">{team.projects}</p>
            <p className="text-muted-foreground">Proyectos</p>
          </div>
          <div>
            <p className="font-medium">{team.tasks}</p>
            <p className="text-muted-foreground">Tareas</p>
          </div>
          <div>
            <p className="font-medium">{team.members.length}</p>
            <p className="text-muted-foreground">Miembros</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <div className="flex -space-x-2">
            {team.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="border-2 border-background">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +{team.members.length - 4}
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="relative z-20">
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

