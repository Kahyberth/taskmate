import { ProjectCard } from "@/components/projects/project-card"
import { ProjectRow } from "@/components/projects/project-row"
import { useProjectsStore } from "@/lib/store"


const projects = [
  {
    id: "1",
    name: "Rediseño de Plataforma E-commerce",
    description:
      "Actualización completa del diseño y funcionalidad de la plataforma de comercio electrónico.",
    status: "in_progress" as const,
    progress: 65,
    priority: "high" as const,
    dueDate: "2024-03-15",
    members: [
      {
        name: "María García",
        image: "/placeholder.svg",
        role: "Project Lead",
      },
      {
        name: "Carlos Ruiz",
        image: "/placeholder.svg",
        role: "Senior Developer",
      },
      {
        name: "Ana Martínez",
        image: "/placeholder.svg",
        role: "UI Designer",
      },
    ],
    activity: [
      {
        type: "comment",
        description: "Actualización del diseño de la página principal completada",
        date: "Hace 2 horas",
      },
      {
        type: "task_completed",
        description: "Implementación del nuevo carrito de compras",
        date: "Hace 4 horas",
      },
    ],
    metrics: {
      tasks: {
        total: 45,
        completed: 28,
      },
      commits: 128,
      pullRequests: 15,
      issues: 8,
    },
  },
]


export function ProjectsGrid() {
  const { viewMode } = useProjectsStore()

  return (
    <div className="mt-6 space-y-6">
      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

