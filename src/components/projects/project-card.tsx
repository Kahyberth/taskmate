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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiClient } from "@/api/client-gateway";
import { useUpdateProject, useProjectStats } from "@/api/queries";
import { toast } from "sonner";

import { Calendar, MoreHorizontal, Check } from "lucide-react";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { EditProjectDialog } from "./edit-project-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectCard = ({
  project,
  onProjectDeleted,
  onProjectUpdated,
}: {
  project: any;
  onProjectDeleted?: () => void;
  onProjectUpdated?: () => void;
}) => {
  const navigate = useNavigate();
  const [creator, setCreator] = useState<{
    name: string;
    lastName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(project.status);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Project update mutation
  const updateProjectMutation = useUpdateProject();

  // Obtener las estadísticas del proyecto (total, completados, progreso)
  const {
    data: projectStats = { total: 0, completed: 0, progress: 0 },
    isLoading: loadingStats,
  } = useProjectStats(project.id);

  // Solo cargar el creador del proyecto cuando el componente se monta
  useEffect(() => {
    const fetchCreator = async () => {
      if (project.createdBy) {
        try {
          setLoading(true);
          const response = await apiClient.get(
            `/auth/profile/${project.createdBy}`
          );
          if (response.data) {
            setCreator(response.data);
          }
        } catch (error) {
          console.error("Error fetching project creator:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [project.createdBy]);

  // Update local status when project prop changes
  useEffect(() => {
    setCurrentStatus(project.status);
  }, [project.status]);

  // Obtener las iniciales del nombre completo del creador
  const getInitials = () => {
    if (!creator) return loading ? "" : "?";

    const firstInitial = creator.name ? creator.name.charAt(0) : "";
    const lastInitial = creator.lastName ? creator.lastName.charAt(0) : "";

    return (firstInitial + lastInitial).toUpperCase();
  };

  // Obtener el nombre completo del creador
  const getCreatorName = () => {
    if (loading) return <Skeleton className="h-4 w-24" />;
    if (!creator) return "Unknown user";
    return `${creator.name} ${creator.lastName}`;
  };

  const goToBacklog = () => {
    navigate(`/projects/backlog/${project.id}`, { state: { project } });
  };

  const handleEditProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const handleDeleteProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleMarkAsCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isCompleted = currentStatus === "completed";
    const newStatus = isCompleted ? "in-progress" : "completed";

    // Update local state immediately
    setCurrentStatus(newStatus);

    updateProjectMutation.mutate(
      {
        id: project.id,
        status: newStatus,
        createdBy: project.createdBy,
      },
      {
        onSuccess: () => {
          toast.success(
            `Project marked as ${
              isCompleted ? "in progress" : "completed"
            } successfully`
          );
          if (onProjectUpdated) onProjectUpdated();
        },
        onError: (error) => {
          // Revert local state if mutation fails
          setCurrentStatus(currentStatus);
          console.error("Error updating project status:", error);
          toast.error(`Failed to update project status`);
        },
      }
    );
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
                <h3 className="text-lg font-semibold text-card-foreground">
                  {project.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
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
              <DropdownMenuContent
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem onClick={handleEditProject}>
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleMarkAsCompleted}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {currentStatus === "completed"
                    ? "Mark as In Progress"
                    : "Mark as Completed"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeleteProject}
                  className="text-red-600"
                >
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between items-center mb-3">
            <div></div>
            <StatusBadge status={currentStatus} />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-card-foreground">Progress</span>
                <span className="text-card-foreground">
                  {projectStats.progress}%
                </span>
              </div>
              <Progress value={projectStats.progress} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {loadingStats
                  ? "Loading stats..."
                  : projectStats.total === 0
                  ? "No issues found"
                  : `${projectStats.completed} of ${projectStats.total} issues completed`}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {format(new Date(project.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {loading ? (
                    <Skeleton className="h-4 w-4 rounded-full" />
                  ) : (
                    getInitials()
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                Created by: {getCreatorName()}
              </span>
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
