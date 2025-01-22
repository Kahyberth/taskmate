"use client"

import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { CreateRoomDialog } from "@/components/planning-poker/create-room-dialog"
import { useState } from "react"

export function PlanningPokerHeader() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planning Poker</h1>
          <p className="text-muted-foreground">
            Estima y planifica con tu equipo en tiempo real
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Sala
        </Button>
      </div>
      <CreateRoomDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  )
}

