import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Github, Linkedin, Mail, User } from "lucide-react"

export default function TeamMembers({ teamMembers }: { teamMembers: any[] }) {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-muted-foreground">Members ({teamMembers.length})</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamMembers.map((member, index) => (
          <Card key={member.id || index} className="hover:shadow-lg transition-shadow duration-200 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <Avatar className="h-12 w-12 mx-auto mb-2">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {(member.name || member.email)?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-base">
                {member.name || "Unknown User"}
                {member.lastName && ` ${member.lastName}`}
              </CardTitle>
              <Badge variant="secondary" className="w-fit mx-auto text-xs">
                {member.role || "Member"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {member.email && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              )}
              {member.company && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{member.company}</span>
                </div>
              )}
              {member.position && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{member.position}</span>
                </div>
              )}
              {member.location && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{member.location}</span>
                </div>
              )}

              {/* Social Links */}
              {(member.github || member.linkedin) && (
                <div className="flex items-center space-x-2 pt-2 border-t border-border/20">
                  {member.github && member.github.trim() && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-3 w-3 mr-1" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {member.linkedin && member.linkedin.trim() && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-3 w-3 mr-1" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <Card className="text-center py-8 bg-card/50 backdrop-blur-sm">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold mb-2">No team members found</h3>
            <p className="text-sm text-muted-foreground">
              This team doesn't have any members yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
