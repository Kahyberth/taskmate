import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTeams } from "@/context/TeamsContext";
import { useUpdateProject } from "@/api/queries";
import { AuthContext } from "@/context/AuthContext";
import { apiClient } from "@/api/client-gateway";

interface EditProjectDialogProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated?: () => void;
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  // Estado para el formulario de edición
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projectMembers, setProjectMembers] = useState<string[]>([]);
  const [loadingProjectMembers, setLoadingProjectMembers] = useState(false);
  
  const { user } = useContext(AuthContext);
  const { teams, loading: loadingTeams } = useTeams();
  const updateProjectMutation = useUpdateProject();

  // Obtener el equipo seleccionado de la lista de equipos
  const currentTeam = selectedTeam ? teams?.find(team => team.id === selectedTeam) : null;
  
  // Load project members data
  useEffect(() => {
    if (open && project && project.id) {
      const fetchProjectMembers = async () => {
        setLoadingProjectMembers(true);
        try {
          const response = await apiClient.get(`/projects/members/${project.id}`);
          if (response.data && Array.isArray(response.data)) {
            const memberIds = response.data.map((member: any) => member.userId || member.user_id);
            setProjectMembers(memberIds);
            setSelectedMembers(memberIds);
            console.log("Loaded project members:", memberIds);
          }
        } catch (error) {
          console.error("Error loading project members:", error);
        } finally {
          setLoadingProjectMembers(false);
        }
      };

      fetchProjectMembers();
    }
  }, [open, project]);

  // Load team members data
  useEffect(() => {
    if (open && selectedTeam) {
      const fetchTeamMembers = async () => {
        try {
          const response = await apiClient.get(`/teams/get-members-by-team/${selectedTeam}`);
          if (response.data && Array.isArray(response.data)) {
            setTeamMembers(response.data);
            console.log("Loaded team members:", response.data);
          }
        } catch (error) {
          console.error("Error loading team members:", error);
        }
      };

      fetchTeamMembers();
    }
  }, [open, selectedTeam]);
  
  // Cargar datos del proyecto al abrir el modal de edición
  useEffect(() => {
    if (open && project) {
      setProjectName(project.name || "");
      setDescription(project.description || "");
      setType(project.type || "SCRUM");
      
      // Process tags and handle different formats
      let tagsString = "";
      if (project.tags) {
        if (Array.isArray(project.tags)) {
          // Convert any formatting to clean strings
          const cleanTags = project.tags.map((tag: any) => {
            if (typeof tag === 'string') {
              // Remove any JSON-like formatting: {""} or {""}
              return tag.replace(/[{"}]/g, '');
            }
            return tag;
          });
          tagsString = cleanTags.join(", ");
        } else if (typeof project.tags === 'string') {
          // If it's a single string, just remove any JSON formatting
          tagsString = project.tags.replace(/[{"}]/g, '');
        }
      }
      setTags(tagsString);
      
      setSelectedTeam(project.teamId || project.team_id || null);
    }
  }, [open, project]);
  
  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const handleUpdateProject = async () => {
    if (isUpdating) return;
    
    if (!projectName.trim()) {
      notifications.show({
        title: "Error",
        message: "Project name is required",
        color: "red",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const notificationId = notifications.show({
        loading: true,
        title: "Updating Project...",
        message: "Please wait while we update your project.",
        color: "blue",
        autoClose: false,
        withCloseButton: false,
      });

      // Convertir las tags a array si no lo es
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const projectData = {
        id: project.id,
        name: projectName,
        description,
        created_by: project.createdBy || project.created_by,
        team_id: selectedTeam,
        tags: tagsArray,
        type,
        members: selectedMembers,
      };

      await updateProjectMutation.mutateAsync(projectData, {
        onSuccess: () => {
          notifications.update({
            id: notificationId,
            title: "Project Updated Successfully",
            message: "Your project has been updated successfully.",
            color: "green",
            autoClose: 2000,
            withCloseButton: true,
          });
          // Cerrar el diálogo y notificar al padre que debe actualizar
          onOpenChange(false);
          if (onProjectUpdated) {
            onProjectUpdated();
          }
        },
        onError: (error) => {
          console.error("Error updating project:", error);
          notifications.update({
            id: notificationId,
            title: "Error",
            message: "Failed to update project. Please try again.",
            color: "red",
            autoClose: 2000,
            withCloseButton: true,
          });
        }
      });
    } catch (error) {
      console.error("Error updating project:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update project. Please try again.",
        color: "red",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!isUpdating) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del proyecto. Haz click en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre del Proyecto</Label>
            <Input
              id="edit-name"
              placeholder="Ingresa el nombre del proyecto"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              placeholder="Ingresa la descripción del proyecto"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-type">Tipo de Proyecto</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="edit-type">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCRUM">SCRUM</SelectItem>
                <SelectItem value="KANBAN">KANBAN</SelectItem>
                <SelectItem value="WATERFALL">WATERFALL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Etiquetas</Label>
            <Input
              id="edit-tags"
              placeholder="Ingresa etiquetas separadas por comas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Team information display - removed selection ability */}
          <div className="space-y-2">
            <Label>Equipo</Label>
            <div className="p-2 border rounded-md bg-muted/20">
              {loadingTeams ? (
                <div className="flex justify-center p-2">
                  <Loader size="sm" />
                </div>
              ) : (
                <div className="text-sm">{currentTeam?.name || "Sin equipo asignado"}</div>
              )}
            </div>
          </div>

          {selectedTeam && (
            <div className="space-y-4">
              <div className="border p-4 rounded-md">
                <div className="mb-3">
                  <Label className="mb-2 block font-bold">Miembros del Proyecto</Label>
                  <p className="text-xs text-muted-foreground mb-2">Estos son los miembros actualmente asignados al proyecto.</p>
                </div>
                
                {loadingProjectMembers ? (
                  <div className="flex justify-center p-4">
                    <Loader size="sm" />
                  </div>
                ) : (
                  <div>
                    {teamMembers
                      .filter(member => projectMembers.includes(member.member?.id))
                      .map(member => (
                        <div 
                          key={member.member?.id} 
                          className="flex items-center justify-between border-b py-2 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {member.member?.name?.charAt(0)}{member.member?.lastName?.charAt(0)}
                            </div>
                            <span className="text-sm">
                              {member.member?.name} {member.member?.lastName}
                            </span>
                          </div>
                          <button 
                            onClick={() => toggleMember(member.member?.id)}
                            className="text-destructive hover:text-destructive/70 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    {teamMembers.filter(member => projectMembers.includes(member.member?.id)).length === 0 && (
                      <p className="text-center text-muted-foreground py-2 text-sm">
                        Este proyecto no tiene miembros asignados
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="border p-4 rounded-md">
                <div className="mb-3">
                  <Label className="mb-2 block font-bold">Añadir Miembros del Equipo</Label>
                  <p className="text-xs text-muted-foreground mb-2">Selecciona miembros del equipo para añadir al proyecto.</p>
                </div>
                
                {loadingTeams || loadingProjectMembers ? (
                  <div className="flex justify-center p-4">
                    <Loader size="sm" />
                  </div>
                ) : (
                  <div>
                    {teamMembers
                      .filter(member => !projectMembers.includes(member.member?.id))
                      .map(member => (
                        <div 
                          key={member.member?.id} 
                          className="flex items-center gap-3 py-2 border-b last:border-0"
                        >
                          <input
                            type="checkbox"
                            id={`add-member-${member.member?.id}`}
                            checked={selectedMembers.includes(member.member?.id)}
                            onChange={() => toggleMember(member.member?.id)}
                            className="rounded"
                          />
                          <label htmlFor={`add-member-${member.member?.id}`} className="text-sm flex-1 cursor-pointer">
                            {member.member?.name || 'Unknown'} {member.member?.lastName || ''}
                            <span className="text-xs text-muted-foreground ml-1">({member.role})</span>
                          </label>
                        </div>
                      ))}
                    {teamMembers.filter(member => !projectMembers.includes(member.member?.id)).length === 0 && (
                      <p className="text-center text-muted-foreground py-2 text-sm">
                        No hay más miembros disponibles para añadir al proyecto
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateProject}
            disabled={!projectName.trim() || !selectedTeam || isUpdating}
          >
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 