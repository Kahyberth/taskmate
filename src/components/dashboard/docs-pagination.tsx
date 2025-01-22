import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function DocsPagination() {
  return (
    <div className="flex items-center justify-between border-t pt-6 mt-8">
      <Button
        variant="ghost"
        className="gap-2"
        asChild
      >
        <Link to="/docs/installation">
          <ChevronLeft className="h-4 w-4" />
          Instalación
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="gap-2 ml-auto"
        asChild
      >
        <Link to="/docs/projects">
          Proyectos
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

