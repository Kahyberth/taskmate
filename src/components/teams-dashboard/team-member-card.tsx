import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, User } from "lucide-react"

interface TeamMemberCardProps {
  member: {
    id: string
    name: string
    role: string
    team: string
    teamId: string
    avatar: string
    email: string
    status: string
    skills: string[]
  }
  onClick: () => void
}

export default function TeamMemberCard({ member, onClick }: TeamMemberCardProps) {
  return (
    <div
      className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="bg-violet-500/20 text-violet-300">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-white font-medium">{member.name}</h3>
          <p className="text-white/60 text-sm">{member.role}</p>
          <div className="flex items-center mt-1">
            <div
              className={`h-2 w-2 rounded-full ${
                member.status === "online" ? "bg-green-500" : member.status === "away" ? "bg-yellow-500" : "bg-white/30"
              } mr-1`}
            ></div>
            <span className="text-white/40 text-xs capitalize">{member.status}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-white/60 text-xs mb-2">Equipo</p>
        <Badge className="bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 mb-3">{member.team}</Badge>

        {member.skills && member.skills.length > 0 && (
          <>
            <p className="text-white/60 text-xs mb-2">Habilidades</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {member.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="border-white/10 text-white/70">
                  {skill}
                </Badge>
              ))}
              {member.skills.length > 3 && (
                <Badge variant="outline" className="border-white/10 text-white/70">
                  +{member.skills.length - 3}
                </Badge>
              )}
            </div>
          </>
        )}

        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `mailto:${member.email}`
            }}
          >
            <Mail className="h-3 w-3 mr-1" />
            Mensaje
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
            <User className="h-3 w-3 mr-1" />
            Perfil
          </Button>
        </div>
      </div>
    </div>
  )
}
