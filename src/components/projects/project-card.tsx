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
import { useEffect, useState } from "react";
import { apiClient } from "@/api/client-gateway";
import { useProjectIssues, invalidateProjectIssues } from "@/api/queries";
import { useQueryClient } from "@tanstack/react-query";

import { Calendar, MoreHorizontal } from "lucide-react";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { EditProjectDialog } from "./edit-project-dialog";

export const ProjectCard = ({
  project,
  onProjectDeleted,
  onProjectUpdated
}: {
  project: any;
  onProjectDeleted?: () => void;
  onProjectUpdated?: () => void;
}) => {
  const navigate = useNavigate();
  const [creator, setCreator] = useState<{name: string; lastName: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch project issues to calculate progress
  const { data: issues = [], isLoading: loadingIssues, refetch } = useProjectIssues(project.id);

  // Force refetch when component is visible/mounted
  useEffect(() => {
    // Invalidate the cache and refetch when the component mounts
    if (project.id) {
      invalidateProjectIssues(queryClient, project.id);
      refetch();
    }
    
    // Setup visibility change listener to refresh data when user returns to this page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && project.id) {
        invalidateProjectIssues(queryClient, project.id);
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [project.id, refetch, queryClient]);

  // Calculate progress when issues are loaded
  useEffect(() => {
    if (issues.length > 0) {
      const completedIssues = issues.filter(
        (issue: any) => issue.status === "resolved" || issue.status === "closed"
      );
      const progressPercentage = Math.round((completedIssues.length / issues.length) * 100);
      setProgress(progressPercentage);
    } else {
      setProgress(0);
    }
  }, [issues]);

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
  
  const goToBacklog = () => {
    navigate(`/projects/backlog/${project.id}`, {state: { project }});
  };

  const handleEditProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const handleDeleteProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  if (!project) return null;

  return (
    <>
      <Card 
        className="h-full cursor-pointer hover:bg-slate-300/10 dark:hover:bg-white/5 transition-colors" 
        onClick={goToBacklog}
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
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleEditProject}>Edit Project</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteProject}>Delete Project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between items-center mb-3">
            <div></div>
            <StatusBadge status={project.status} />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-card-foreground">Progress</span>
                <span className="text-card-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
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

      {/* Componentes de diálogo separados */}
      <DeleteProjectDialog 
        project={project}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        onProjectDeleted={onProjectDeleted}
      />
      
      <EditProjectDialog
        project={project}
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onProjectUpdated={onProjectUpdated}
      />
    </>
  );
};
