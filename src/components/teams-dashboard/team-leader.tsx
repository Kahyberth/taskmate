import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MailIcon,
  CalendarIcon,
  Github,
  Linkedin,
  MapPin,
  Building,
} from "lucide-react";

export default function TeamLeader({
  leaderData,
}:{
  leaderData: any;
  teamInfo: any[];
}) {

  if (!leaderData) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Loading team leader...</p>
      </Card>
    );
  }

  // Parse experience if available
  let experiences = [];
  console.log("experienceeeeeeeee", leaderData.expirience);
  if (leaderData.expirience) {
    try {
      // Parse experience JSON string
      experiences = JSON.parse(leaderData.expirience);
    } catch (error) {
      console.log('Error parsing experience:', error);
      experiences = [];
    }
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden border bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/10 relative">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={leaderData.avatar} alt={leaderData.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {(leaderData.name || leaderData.email)?.charAt(0)?.toUpperCase() || "L"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <CardHeader className="pt-12 text-center pb-4">
        <CardTitle className="text-xl">
          {leaderData.name || "Unknown Leader"}
          {leaderData.lastName && ` ${leaderData.lastName}`}
        </CardTitle>
        <div className="flex justify-center mt-2">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
            {leaderData.role || "Team Leader"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4">
        {/* Contact Information */}
        <div className="space-y-2">
          {leaderData.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MailIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{leaderData.email}</span>
            </div>
          )}
          
          {leaderData.company && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{leaderData.company}</span>
            </div>
          )}
          
          {leaderData.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{leaderData.location}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {leaderData.skills && leaderData.skills.trim() ? (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {leaderData.skills.split(',').slice(0, 6).map((skill: string, index: number) => (
                <Badge 
                  key={index} 
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white text-xs"
                >
                  {skill.trim()}
                </Badge>
              ))}
              {leaderData.skills.split(',').length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{leaderData.skills.split(',').length - 6} more
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-3">Skills</h4>
            <p className="text-xs text-muted-foreground">No skills available</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 ? (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-3">Experience</h4>
            <ScrollArea className="h-[120px] pr-2">
              <div className="space-y-3">
                {experiences.slice(0, 2).map((exp: any, index: number) => (
                  <div
                    key={exp.id || index}
                    className="relative pl-4 pb-3 border-l-2 border-primary/20"
                  >
                    <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background"></div>
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm">{exp.title}</h5>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building className="h-3 w-3" />
                        {exp.company}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </div>
                      {exp.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {experiences.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    +{experiences.length - 2} more experiences
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-3">Experience</h4>
            <p className="text-xs text-muted-foreground">No experience available</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3 border-t bg-card/50 p-4">
        {/* Social Links */}
        {(leaderData.github && leaderData.github.trim()) || (leaderData.linkedin && leaderData.linkedin.trim()) ? (
          <div className="flex items-center justify-center space-x-3">
            {leaderData.github && leaderData.github.trim() && (
              <a
                href={leaderData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4 mr-1" />
                <span>GitHub</span>
              </a>
            )}
            {leaderData.linkedin && leaderData.linkedin.trim() && (
              <a
                href={leaderData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No social links available</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
