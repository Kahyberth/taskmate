"use client"

import { ProjectCard } from "@/components/projects/project-card"
import { ProjectRow } from "@/components/projects/project-row"
import { useProjectsStore } from "@/lib/store"


const projects = [
  {
    id: "1",
    name: "Rediseño de Plataforma E-commerce",
    description: "Actualización completa del diseño y funcionalidad de la plataforma de comercio electrónico.",
    status: "in_progress",
    progress: 65,
    priority: "high",
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
        user: "María García",
        content: "Actualización del diseño de la página principal completada",
        timestamp: "Hace 2 horas",
      },
      {
        type: "task_completed",
        user: "Carlos Ruiz",
        content: "Implementación del nuevo carrito de compras",
        timestamp: "Hace 4 horas",
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
  {
    id: "2",
    name: "Sistema de Gestión de Inventario",
    description: "Desarrollo de un sistema integral para gestión y seguimiento de inventario en tiempo real.",
    status: "planning",
    progress: 25,
    priority: "medium",
    dueDate: "2024-04-20",
    members: [
      {
        name: "David López",
        image: "/placeholder.svg",
        role: "Tech Lead",
      },
      {
        name: "Laura Torres",
        image: "/placeholder.svg",
        role: "Backend Developer",
      },
    ],
    activity: [
      {
        type: "milestone",
        user: "David López",
        content: "Definición de arquitectura completada",
        timestamp: "Hace 1 día",
      },
    ],
    metrics: {
      tasks: {
        total: 32,
        completed: 8,
      },
      commits: 45,
      pullRequests: 6,
      issues: 12,
    },
  },
  {
    id: "3",
    name: "App Móvil de Delivery",
    description: "Aplicación móvil para servicio de entrega a domicilio con seguimiento en tiempo real.",
    status: "completed",
    progress: 100,
    priority: "completed",
    dueDate: "2024-01-10",
    members: [
      {
        name: "Sofia Herrera",
        image: "/placeholder.svg",
        role: "Mobile Lead",
      },
      {
        name: "Juan Pérez",
        image: "/placeholder.svg",
        role: "iOS Developer",
      },
      {
        name: "Andrea López",
        image: "/placeholder.svg",
        role: "Android Developer",
      },
    ],
    activity: [
      {
        type: "release",
        user: "Sofia Herrera",
        content: "Versión 1.0 lanzada en App Store y Play Store",
        timestamp: "Hace 5 días",
      },
    ],
    metrics: {
      tasks: {
        total: 64,
        completed: 64,
      },
      commits: 256,
      pullRequests: 28,
      issues: 0,
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

