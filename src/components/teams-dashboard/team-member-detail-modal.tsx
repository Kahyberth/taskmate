import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Calendar, Mail, MapPin, Phone } from "lucide-react"

interface TeamMemberDetailModalProps {
  member: {
    id: string
    name: string
    role: string
    team: string
    teamId: string
    avatar: string
    email: string
    phone: string
    location: string
    bio: string
    skills: string[]
    projects: string[]
    status: string
    joinDate: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function TeamMemberDetailModal({ member, isOpen, onClose }: TeamMemberDetailModalProps) {
  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-[#170f3e] to-[#0e0a29] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Detalles del Miembro</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="bg-violet-500/20 text-violet-300 text-xl">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold text-white text-center">{member.name}</h2>
          <p className="text-white/70 text-center mb-2">{member.role}</p>

          <Badge className="bg-violet-500/20 text-violet-300 mb-2">{member.team}</Badge>

          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full ${
                member.status === "online" ? "bg-green-500" : member.status === "away" ? "bg-yellow-500" : "bg-white/30"
              } mr-1`}
            ></div>
            <span className="text-white/60 text-sm capitalize">{member.status}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Información de Contacto</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center text-sm text-white/70">
                <Mail className="h-4 w-4 mr-2 text-white/40" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center text-sm text-white/70">
                <Phone className="h-4 w-4 mr-2 text-white/40" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center text-sm text-white/70">
                <MapPin className="h-4 w-4 mr-2 text-white/40" />
                <span>{member.location}</span>
              </div>
              <div className="flex items-center text-sm text-white/70">
                <Calendar className="h-4 w-4 mr-2 text-white/40" />
                <span>Se unió el {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Biografía</h3>
            <p className="text-white/70 text-sm">{member.bio}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="border-white/10 text-white/70">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Proyectos Actuales</h3>
            <div className="space-y-2">
              {member.projects.map((project, index) => (
                <div key={index} className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-violet-400" />
                  <span className="text-white/80">{project}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
            onClick={() => {
              window.location.href = `mailto:${member.email}`
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            Contactar
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10">
            Ver Perfil Completo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
