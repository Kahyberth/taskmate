import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

import { Calendar, MoreHorizontal, Star, StarOff } from "lucide-react";
export const ProjectCard = ({
  project,
  onToggleStar,
}: {
  project: any;
  onToggleStar: (id: string) => void;
}) => {
  const navigate = useNavigate();


  const handleViewDetails = () => {
    navigate(`/projects/backlog/${project.id}`, {state: { project }});
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onToggleStar(project.id);
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
      className="h-full cursor-pointer hover:bg-gray-50 transition-colors" 
      onClick={handleViewDetails}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <button 
                onClick={handleStarClick}
                className="text-yellow-400 hover:text-yellow-500 cursor-default" // cursor-default aquí
              >
                {project.isStarred ? (
                  <Star size={16} />
                ) : (
                  <StarOff size={16} className="text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 cursor-default" // cursor-default aquí
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="cursor-default"> {/* cursor-default aquí */}
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
              <span>Progress</span>
              <span>{project.progress || 0}%</span>
            </div>
            <Progress value={project.progress || 0} className="h-2" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-gray-500" />
              <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{project.createdBy?.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <span className="text-xs">Created by: {project.createdBy}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
