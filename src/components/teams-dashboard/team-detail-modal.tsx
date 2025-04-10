import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, Briefcase, Calendar, Clock, Mail, Phone, Users } from "lucide-react"

interface TeamDetailModalProps {
  team: {
    id: string
    name: string
    description: string
    members: number
    completionRate: number
    activeProjects: number
    image: string
    leader: {
      id: string
      name: string
      role: string
      avatar: string
      email: string
      phone: string
      bio: string
    }
  }
  isOpen: boolean
  onClose: () => void
  onViewDetails: () => void
}

export default function TeamDetailModal({ team, isOpen, onClose, onViewDetails }: TeamDetailModalProps) {
  if (!team) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-[#170f3e] to-[#0e0a29] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Detalles del Equipo</DialogTitle>
        </DialogHeader>

        <div className="relative h-48 -mt-2 -mx-6 mb-4">
          <img src={team.image || "/placeholder.svg"} alt={team.name} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#170f3e] via-[#170f3e]/70 to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6">
            <Badge className="mb-2 bg-violet-500/20 text-violet-300">Equipo Activo</Badge>
            <h2 className="text-2xl font-bold text-white">{team.name}</h2>
            <p className="text-white/70">{team.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <p className="text-xs text-white/60 mb-1">Miembros</p>
            <div className="flex items-center justify-center gap-1">
              <Users className="h-3 w-3 text-violet-400" />
              <p className="text-lg font-semibold text-white">{team.members}</p>
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <p className="text-xs text-white/60 mb-1">Proyectos</p>
            <div className="flex items-center justify-center gap-1">
              <Briefcase className="h-3 w-3 text-violet-400" />
              <p className="text-lg font-semibold text-white">{team.activeProjects}</p>
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <p className="text-xs text-white/60 mb-1">Completado</p>
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-violet-400" />
              <p className="text-lg font-semibold text-white">{team.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-white font-medium mb-2">Progreso del Equipo</h3>
          <div className="mb-1 flex justify-between items-center">
            <span className="text-sm text-white/70">Completado</span>
            <span className="text-sm font-medium text-white">{team.completionRate}%</span>
          </div>
          <Progress value={team.completionRate} className="h-2 bg-white/10" />
        </div>

        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <h3 className="text-white font-medium mb-3">Líder del Equipo</h3>
          <div className="flex items-start gap-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src={team.leader.avatar} alt={team.leader.name} />
              <AvatarFallback className="bg-violet-500/20 text-violet-300">
                {team.leader.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-white font-medium">{team.leader.name}</h4>
              <p className="text-white/60 text-sm">{team.leader.role}</p>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center text-sm text-white/70">
                  <Mail className="h-3 w-3 mr-1 text-white/40" />
                  <span className="truncate">{team.leader.email}</span>
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Phone className="h-3 w-3 mr-1 text-white/40" />
                  <span>{team.leader.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <h3 className="text-white font-medium mb-2">Próximos Eventos</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-violet-400" />
                <span className="text-white/80">Reunión Semanal</span>
              </div>
              <Badge variant="outline" className="border-white/10 text-white/70">
                Mañana, 10:00 AM
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-violet-400" />
                <span className="text-white/80">Sprint Planning</span>
              </div>
              <Badge variant="outline" className="border-white/10 text-white/70">
                Viernes, 2:00 PM
              </Badge>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white group relative overflow-hidden"
          onClick={onViewDetails}
        >
          <span className="relative z-10 flex items-center">
            Ver Dashboard Completo
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
          <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
