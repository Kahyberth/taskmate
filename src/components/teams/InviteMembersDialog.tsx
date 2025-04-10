"use client"

import type React from "react"

// This is an example of how you might want to update the InviteMembersDialog component
// to match the new styling if needed. You would need to replace your existing component
// with this updated version.

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Team } from "@/lib/store"
import { UserPlus } from "lucide-react"

interface InviteMembersDialogProps {
  open: boolean
  team: Team
  onOpenChange: (open: boolean) => void
}

export const InviteMembersDialog = ({ open, team, onOpenChange }: InviteMembersDialogProps) => {
  const [email, setEmail] = useState("")

  // Early return if team is undefined
  if (!team) {
    return null
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle invite logic here
    setEmail("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Invitar miembros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#170f3e] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Invitar miembros</DialogTitle>
          <DialogDescription className="text-white/70">
            Invita a nuevos miembros a unirse a tu equipo {team?.name || ""}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
            >
              Invitar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
