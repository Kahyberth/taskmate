import { useContext, useEffect, useState } from "react";
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
import { apiClient } from "@/api/client-gateway";
import { AuthContext } from "@/context/AuthContext";
import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export const CreateProjectForm = ({ onClose }: { onClose: () => void }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("SCRUM");
  const [tags, setTags] = useState("");

  const [teams, setTeams] = useState<any[]>([]);
  const [teamsPage, setTeamsPage] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [membersPage, setMembersPage] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchTeams = async (page: number) => {
    try {
      const response = await apiClient.get(
        `/teams/get-team-by-user/${user?.id}?page=${page}`
      );
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchMembers = async (teamId: string, page: number) => {
    setIsLoadingMembers(true);
    try {
      const response = await apiClient.get(
        `/teams/get-members-by-team/${teamId}?page=${page}`
      );
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchTeams(teamsPage);
  }, [teamsPage]);

  useEffect(() => {
    if (selectedTeam) {
      fetchMembers(selectedTeam, membersPage);
    }
  }, [selectedTeam, membersPage]);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {

        const newProject = notifications.show({
            loading: true,
            title: "Creating Project...",
            message: "Please wait while we create your project.",
            color: "green",
            autoClose: false,
            withCloseButton: false,
        })


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

      await apiClient.post("/projects/create", projectData).finally(()=> {
        notifications.update({
            id: newProject,
            title: "Project Created Successfully",
            message: "Your project has been created successfully.",
            color: "green",
            autoClose: 2000,
            withCloseButton: true,
        })
      })
      
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
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
            setMembersPage(1);
            setSelectedMembers([]);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team: any) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {teams.length === 0 && !isLoadingMembers && (
          <p className="text-center text-gray-500 py-4">
            No teams found for this user
          </p>
        )}

        {teams.length > 4 && (
          <div className="flex justify-between mt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={teamsPage <= 1}
              onClick={() => setTeamsPage((prev) => prev - 1)}
            >
              Prev Teams
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTeamsPage((prev) => prev + 1)}
            >
              Next Teams
            </Button>
          </div>
        )}
      </div>

      {selectedTeam && (
        <div className="space-y-2">
          <Label>Team Members</Label>
          <ScrollArea className="h-[120px] border rounded-md p-2">
            {isLoadingMembers ? (
              <div className="flex justify-center items-center h-full w-full">
                <Loader color="blue" size={24} />
              </div>
            ) : (
              <>
                {teamMembers.map((member) => (
                  <div
                    key={member.user.id}
                    className="flex items-center space-x-2 p-1"
                  >
                    <input
                      type="checkbox"
                      id={`member-${member.user.id}`}
                      checked={selectedMembers.includes(member.user.id)}
                      onChange={() => toggleMember(member.user.id)}
                    />
                    <label htmlFor={`member-${member.user.id}`}>
                      {member.user.name} {member.user.lastName}
                    </label>
                  </div>
                ))}
                {teamMembers.length === 0 && !isLoadingMembers && (
                  <p className="text-center text-gray-500 py-4">
                    No members found in this team
                  </p>
                )}
              </>
            )}
          </ScrollArea>

          {teamMembers.length === 0 && !isLoadingMembers && (
            <p className="text-center text-gray-500 py-4">
              No members found in this team
            </p>
          )}

          {teamMembers.length > 4 && (
            <div className="flex justify-between mt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={membersPage <= 1}
                onClick={() => setMembersPage((prev) => prev - 1)}
              >
                Prev Members
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMembersPage((prev) => prev + 1)}
              >
                Next Members
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create Project</Button>
      </div>
    </div>
  );
};
