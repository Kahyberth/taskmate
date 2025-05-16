import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/backlog/status-badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/backlog/priority-badge";
import { useEffect, useState } from "react";
import { apiClient } from "@/api/client-gateway";

import { Calendar, MoreHorizontal } from "lucide-react";

export const ProjectCard = ({
  project,
}: {
  project: any;
}) => {
  const navigate = useNavigate();
  const [creator, setCreator] = useState<{name: string; lastName: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      if (project.createdBy) {
        try {
          setLoading(true);
          const response = await apiClient.get(`/auth/profile/${project.createdBy}`);
          if (response.data) {
            setCreator(response.data);
          }
        } catch (error) {
          console.error("Error fetching creator:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCreator();
  }, [project.createdBy]);

  // Obtener las iniciales del nombre completo del creador
  const getInitials = () => {
    if (!creator) return project.createdBy?.slice(0, 1) || "?";
    
    const firstInitial = creator.name ? creator.name.charAt(0) : "";
    const lastInitial = creator.lastName ? creator.lastName.charAt(0) : "";
    
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Obtener el nombre completo del creador
  const getCreatorName = () => {
    if (!creator) return project.createdBy;
    return `${creator.name} ${creator.lastName}`;
  };

  const handleViewDetails = () => {
    console.log("project", project.id)
    navigate(`/projects/backlog/${project.id}`, {state: { project }});
  };

  const handleEditProject = () => {
    navigate(`/projects/${project.id}/edit`);
  };

  const handleArchiveProject = () => {
    navigate(`/projects/${project.id}/archive`);
  };

  const handleDeleteProject = () => {
    navigate(`/projects/${project.id}/delete`);
  };

  return (
    <Card 
      className="h-full cursor-pointer hover:bg-slate-300/10 dark:hover:bg-white/5 transition-colors" 
      onClick={handleViewDetails}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-card-foreground">{project.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditProject}>Edit Project</DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchiveProject}>Archive Project</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteProject}>Delete Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-3">
          <StatusBadge status={project.status} />
          <PriorityBadge priority={project.priority || "medium"} />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-card-foreground">Progress</span>
              <span className="text-card-foreground">{project.progress || 0}%</span>
            </div>
            <Progress value={project.progress || 0} className="h-2" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">Created by: {getCreatorName()}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
