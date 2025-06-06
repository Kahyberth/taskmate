import { useContext, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/AuthContext";
import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTeams } from "@/context/TeamsContext";
import { useCreateProject } from "@/api/queries";

export const CreateProjectForm = ({ onClose }: { onClose: () => void }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("SCRUM");
  const [tags, setTags] = useState("");

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const { user } = useContext(AuthContext);
  const { teams, loading } = useTeams();

  // Usar el hook de mutación de React Query para crear proyectos
  const createProjectMutation = useCreateProject();

  // Obtener el equipo seleccionado de la lista de equipos
  const currentTeam = selectedTeam ? teams?.find(team => team.id === selectedTeam) : null;
  
  // Los miembros ya están disponibles en el team desde el context
  // Filter out the current user from the team members list
  const teamMembers = currentTeam?.members?.filter(member => member.member.id !== user?.id) || [];

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      notifications.show({
        title: "Error",
        message: "Project name is required",
        color: "red",
      });
      return;
    }

    if (!selectedTeam) {
      notifications.show({
        title: "Error",
        message: "Please select a team for the project",
        color: "red",
      });
      return;
    }

    try {
      const notificationId = notifications.show({
        loading: true,
        title: "Creating Project...",
        message: "Please wait while we create your project.",
        color: "green",
        autoClose: false,
        withCloseButton: false,
      });

      const projectData = {
        name: projectName,
        description,
        created_by: user?.id,
        team_id: selectedTeam,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        type,
        members: selectedMembers,
      };

      // Usar la mutación de React Query para crear el proyecto
      await createProjectMutation.mutateAsync(projectData, {
        onSuccess: () => {
          notifications.update({
            id: notificationId,
            title: "Project Created Successfully",
            message: "Your project has been created successfully.",
            color: "green",
            autoClose: 2000,
            withCloseButton: true,
          });
          // Cerrar el diálogo y notificar al padre que debe actualizar
          onClose();
        },
        onError: (error) => {
          console.error("Error creating project:", error);
          notifications.update({
            id: notificationId,
            title: "Error",
            message: "Failed to create project. Please try again.",
            color: "red",
            autoClose: 2000,
            withCloseButton: true,
          });
        }
      });
    } catch (error) {
      console.error("Error creating project:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create project. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter project description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Project Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SCRUM">SCRUM</SelectItem>
            <SelectItem value="KANBAN">KANBAN</SelectItem>
            <SelectItem value="WATERFALL">WATERFALL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Enter tags separated by commas"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Select Team</Label>
        <Select
          onValueChange={(value) => {
            setSelectedTeam(value);
            setSelectedMembers([]);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <div className="flex justify-center p-2">
                <Loader size="sm" />
              </div>
            ) : (
              teams?.map((team: any) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {teams?.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">
            No teams found for this user
          </p>
        )}
      </div>

      {selectedTeam && (
        <div className="space-y-2">
          <Label>Team Members</Label>
          <ScrollArea className="h-[120px] border rounded-md p-2">
            {loading ? (
              <div className="flex justify-center items-center h-full w-full">
                <Loader color="blue" size={24} />
              </div>
            ) : (
              <>
                {teamMembers.length > 0 ? (
                  teamMembers.map((member: any) => (
                    <div
                      key={member.member.id}
                      className="flex items-center space-x-2 p-1"
                    >
                      <input
                        type="checkbox"
                        id={`member-${member.member.id}`}
                        checked={selectedMembers.includes(member.member.id)}
                        onChange={() => toggleMember(member.member.id)}
                        className="rounded"
                      />
                      <label htmlFor={`member-${member.member.id}`} className="text-sm">
                        {member.member.name || 'Unknown'} {member.member.lastName || ''} 
                        <span className="text-xs text-gray-500 ml-1">({member.role})</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    {currentTeam?.members?.length === 1 && currentTeam.members[0].member.id === user?.id
                      ? "You are the only member in this team"
                      : "No members found in this team"}
                  </p>
                )}
              </>
            )}
          </ScrollArea>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!projectName.trim() || !selectedTeam || loading || createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
};
