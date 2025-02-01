import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquarePlus, CalendarPlus, GitPullRequestIcon as GitPullRequestPlus } from 'lucide-react'
import { useNavigate } from "react-router-dom"

const actions = [
  {
    title: "Nueva Tarea",
    description: "Crear una nueva tarea o issue",
    icon: Plus,
    link: "tasks/new",
    variant: "default" as const,
  },
  {
    title: "Iniciar Chat",
    description: "Comenzar una nueva conversación",
    icon: MessageSquarePlus,
    link: "chat",
    variant: "outline" as const,
  },
  {
    title: "Programar Reunión",
    description: "Agendar una nueva reunión",
    icon: CalendarPlus,
    link: "meetings/new",
    variant: "outline" as const,
  },
  {
    title: "Crear Pull Request",
    description: "Abrir un nuevo pull request",
    icon: GitPullRequestPlus,
    link: "pull-requests/new",
    variant: "outline" as const,
  },
]

export function QuickActions() {

  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant={action.variant}
                onClick={() => navigate(action.link)}
                className="h-auto flex-col items-start gap-2 p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs text-gray-500">{action.description}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

