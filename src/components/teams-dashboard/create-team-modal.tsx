import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Plus, Upload, X } from "lucide-react"

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teamImage, setTeamImage] = useState<string | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  // Datos simulados para selección de miembros
  const availableMembers = [
    { id: "user-1", name: "Alex Johnson", role: "Lead Developer", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "user-2", name: "Sarah Williams", role: "Backend Architect", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "user-3", name: "Michael Brown", role: "Design Lead", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "user-4", name: "Emily Davis", role: "QA Manager", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "user-5", name: "David Wilson", role: "DevOps Engineer", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTeamImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddMember = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers([...selectedMembers, memberId])
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== memberId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular creación de equipo
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-[#170f3e] to-[#0e0a29] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Crear Nuevo Equipo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-image" className="text-white/80">
              Imagen del Equipo
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
                {teamImage ? (
                  <>
                    <img
                      src={teamImage || "/placeholder.svg"}
                      alt="Team preview"
                      className="h-full w-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-5 w-5 bg-black/50 hover:bg-black/70 text-white rounded-full"
                      onClick={() => setTeamImage(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <label htmlFor="team-image-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-6 w-6 text-white/40" />
                    <span className="text-xs text-white/40 mt-1">Subir</span>
                  </label>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/70 mb-1">Sube una imagen para tu equipo</p>
                <p className="text-xs text-white/50">Recomendado: 800x400px, máximo 2MB</p>
              </div>
              <input
                id="team-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team-name" className="text-white/80">
                Nombre del Equipo
              </Label>
              <Input
                id="team-name"
                placeholder="Ej: Desarrollo Frontend"
                required
                className="bg-white/5 border-white/10 text-white focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-leader" className="text-white/80">
                Líder del Equipo
              </Label>
              <Select>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Seleccionar líder" />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-violet-500/20 text-violet-300 text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-description" className="text-white/80">
              Descripción
            </Label>
            <Textarea
              id="team-description"
              placeholder="Describe el propósito y objetivos del equipo"
              required
              className="bg-white/5 border-white/10 text-white focus:border-violet-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Miembros del Equipo</Label>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMembers.length > 0 ? (
                  selectedMembers.map((memberId) => {
                    const member = availableMembers.find((m) => m.id === memberId)
                    return (
                      <div key={memberId} className="flex items-center gap-2 bg-white/10 rounded-full pl-1 pr-2 py-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member?.avatar} alt={member?.name} />
                          <AvatarFallback className="bg-violet-500/20 text-violet-300 text-xs">
                            {member?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-white">{member?.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10 rounded-full ml-1"
                          onClick={() => handleRemoveMember(memberId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-white/50 text-sm">No hay miembros seleccionados</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Select onValueChange={handleAddMember}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Añadir miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers
                      .filter((member) => !selectedMembers.includes(member.id))
                      .map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-violet-500/20 text-violet-300 text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Equipo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
