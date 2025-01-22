import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Archive, Lightbulb } from 'lucide-react'

const statusConfig = {
  planning: {
    label: "Planificación",
    icon: Lightbulb,
    variant: "secondary" as const,
  },
  in_progress: {
    label: "En Progreso",
    icon: Clock,
    variant: "default" as const,
  },
  completed: {
    label: "Completado",
    icon: CheckCircle2,
    variant: "success" as const,
  },
  archived: {
    label: "Archivado",
    icon: Archive,
    variant: "outline" as const,
  },
}

export function ProjectStatus({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

