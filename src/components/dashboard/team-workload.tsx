import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const teamWorkload = [
  {
    name: "María García",
    role: "Frontend Developer",
    image: "/placeholder.svg",
    initials: "MG",
    tasks: 12,
    completed: 8,
    progress: 67,
  },
  {
    name: "Carlos Ruiz",
    role: "Backend Developer",
    image: "/placeholder.svg",
    initials: "CR",
    tasks: 15,
    completed: 12,
    progress: 80,
  },
  {
    name: "Ana Martínez",
    role: "UI Designer",
    image: "/placeholder.svg",
    initials: "AM",
    tasks: 8,
    completed: 3,
    progress: 38,
  },
  {
    name: "David López",
    role: "DevOps Engineer",
    image: "/placeholder.svg",
    initials: "DL",
    tasks: 10,
    completed: 7,
    progress: 70,
  },
]

export function TeamWorkload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carga de Trabajo del Equipo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {teamWorkload.map((member) => (
            <div key={member.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.image} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {member.completed}/{member.tasks} tareas
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={member.progress} />
                <p className="text-xs text-gray-500 text-right">{member.progress}% completado</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

