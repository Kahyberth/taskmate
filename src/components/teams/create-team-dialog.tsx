"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X } from 'lucide-react'

const users = [
  {
    id: "1",
    name: "María García",
    email: "maria@company.com",
    role: "Frontend Developer",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    email: "carlos@company.com",
    role: "Backend Developer",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@company.com",
    role: "UI Designer",
    image: "/placeholder.svg",
  },
  {
    id: "4",
    name: "David López",
    email: "david@company.com",
    role: "Product Manager",
    image: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Laura Torres",
    email: "laura@company.com",
    role: "QA Engineer",
    image: "/placeholder.svg",
  },
]

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("")
  const [description, setDescription] = useState("")
  const [search, setSearch] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<typeof users>([])
  const [isLoading, setIsLoading] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      !selectedUsers.find((selected) => selected.id === user.id) &&
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUsers.length === 0) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onOpenChange(false)

    // Reset form
    setTeamName("")
    setDescription("")
    setSelectedUsers([])
  }

  const toggleUser = (user: typeof users[0]) => {
    setSelectedUsers((current) =>
      current.find((selected) => selected.id === user.id)
        ? current.filter((selected) => selected.id !== user.id)
        : [...current, user]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo equipo</DialogTitle>
          <DialogDescription>
            Crea un nuevo equipo y añade miembros para empezar a colaborar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del equipo</Label>
              <Input
                id="name"
                placeholder="Ej: Equipo de Desarrollo"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el propósito del equipo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Miembros del equipo</Label>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => toggleUser(user)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar miembros..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleUser(user)}
                      className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm transition-colors hover:bg-accent"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.role}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedUsers.length === 0 || !teamName}
            >
              {isLoading ? "Creando..." : "Crear equipo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

