import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowUp, Circle, CheckCircle } from 'lucide-react'

const priorityConfig = {
  high: {
    label: "Alta",
    icon: AlertTriangle,
    variant: "destructive" as const,
  },
  medium: {
    label: "Media",
    icon: ArrowUp,
    variant: "default" as const,
  },
  low: {
    label: "Baja",
    icon: Circle,
    variant: "secondary" as const,
  },
  completed: {
    label: "Completado",
    icon: CheckCircle,
    variant: "outline" as const,
  },
}

export function ProjectPriority({ priority }: { priority: keyof typeof priorityConfig }) {
  const config = priorityConfig[priority]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

