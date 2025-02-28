import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog"

export function TeamsHeader() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Equipos</h1>
          <p className="text-muted-foreground">
            Gestiona tus equipos y colabora con otros miembros
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Equipo
        </Button>
      </div>

      <CreateTeamDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        
      />
    </div>
  )
}
