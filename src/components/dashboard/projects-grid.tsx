import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const projects = [
  {
    id: 1,
    name: "Rediseño de la plataforma",
    description: "Actualización completa de la interfaz de usuario",
    progress: 75,
    status: "En progreso",
    statusColor: "bg-yellow-500",
  },
  {
    id: 2,
    name: "API v2",
    description: "Desarrollo de la nueva API REST",
    progress: 32,
    status: "En progreso",
    statusColor: "bg-yellow-500",
  },
  {
    id: 3,
    name: "App Móvil",
    description: "Aplicación nativa para iOS y Android",
    progress: 100,
    status: "Completado",
    statusColor: "bg-green-500",
  },
  {
    id: 4,
    name: "Sistema de Autenticación",
    description: "Implementación de OAuth 2.0",
    progress: 15,
    status: "En progreso",
    statusColor: "bg-yellow-500",
  },
]

export function ProjectsGrid() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Proyectos Recientes</CardTitle>
        <Link 
          to="/dashboard/projects" 
          className="text-sm text-blue-600 hover:underline"
        >
          Ver todos
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/dashboard/projects/${project.id}`}
            className="group block space-y-2 rounded-lg border p-4 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold group-hover:text-blue-600">
                {project.name}
              </h3>
              <Badge 
                variant="secondary" 
                className={`h-2 w-2 rounded-full p-0 ${project.statusColor}`} 
              />
            </div>
            <p className="text-sm text-gray-500">{project.description}</p>
            <Progress value={project.progress} />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Progreso</span>
              <span>{project.progress}%</span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

