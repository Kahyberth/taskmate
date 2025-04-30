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
        <Button className="w-full bg-gradient-to-r from-indigo-400 to-purple-600 hover:from-indigo-500 hover:to-purple-700 dark:from-indigo-600 dark:to-purple-900 dark:hover:from-indigo-600 dark:hover:to-purple-600">
          <UserPlus className="mr-2 h-4 w-4" />
          Invitar miembros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white text-black border-gray-200 dark:bg-[#170f3e] dark:text-white dark:border-white/10">
        <DialogHeader>
          <DialogTitle>Invitar miembros</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-white/70">
            Invita a nuevos miembros a unirse a tu equipo {team?.name || ""}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-black dark:text-white">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-gray-300 text-black dark:bg-white/5 dark:border-white/10 dark:text-white"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border border-gray-300 bg-white text-black hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-400 to-purple-600 hover:from-indigo-500 hover:to-purple-700 text-white dark:from-indigo-600 dark:to-purple-900 dark:hover:from-indigo-600 dark:hover:to-purple-600"
            >
              Invitar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

}
