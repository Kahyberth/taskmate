import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MailIcon,
  PhoneIcon,
  LinkedinIcon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";

export default function TeamLeader({
  leaderData,
  teamInfo,
}:{
  leaderData: any;
  teamInfo: any[];
}) {


  if (!leaderData || !teamInfo) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Cargando líder del equipo...</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10 relative">
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" />
            <AvatarFallback className="bg-primary/20 text-lg font-semibold">
              AL
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardHeader className="pt-16 text-center">
        <CardTitle className="text-xl">{leaderData.name}</CardTitle>
        <div className="flex justify-center mt-1">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
            Senior Project Manager
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-muted-foreground">Online now</span>
        </div>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          {
            leaderData.experience || "Sin experiencia disponible"
          }
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
            <span className="text-2xl font-bold">24</span>
            <span className="text-xs text-muted-foreground">Projects</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
            <span className="text-2xl font-bold">{teamInfo.length}</span>
            <span className="text-xs text-muted-foreground">Team Members</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 border-t bg-card/50 p-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="outline" size="sm" className="w-full">
            <MailIcon className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
        <div className="flex items-center justify-between w-full pt-2 border-t border-border/40 mt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <PhoneIcon className="h-3 w-3 mr-1" />
            <span>{leaderData.phone || "No hay información"}</span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <LinkedinIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
