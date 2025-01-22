"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QuickJoin() {
  const [roomCode, setRoomCode] = useState("")

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle room joining logic
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unirse a una sala</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-code">Código de la sala</Label>
            <Input
              id="room-code"
              placeholder="Ej: POKER-123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
          </div>
          <Button className="w-full" type="submit">
            Unirse a la sala
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              o únete usando un enlace
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="mb-2 font-medium">¿Nuevo en Planning Poker?</h4>
            <p className="text-sm text-muted-foreground">
              Aprende cómo usar Planning Poker efectivamente con nuestra guía rápida.
            </p>
            <Button variant="link" className="mt-2 h-auto p-0">
              Ver guía
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

