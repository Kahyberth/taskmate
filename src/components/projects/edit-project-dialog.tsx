import { useEffect, useState } from "react";
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
import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTeams } from "@/context/TeamsContext";
import { useUpdateProject } from "@/api/queries";

interface EditProjectDialogProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated?: (updatedProject?: any) => void;
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { teams, loading: loadingTeams } = useTeams();
  const updateProjectMutation = useUpdateProject();

  const currentTeam = selectedTeam ? teams?.find(team => team.id === selectedTeam) : null;

  
  useEffect(() => {
    if (open && project) {
      setProjectName(project.name || "");
      setDescription(project.description || "");
      setType(project.type || "SCRUM");
      
      let tagsString = "";
      if (project.tags) {
        if (Array.isArray(project.tags)) {  
          const cleanTags = project.tags.map((tag: any) => {
            if (typeof tag === 'string') {
              return tag.replace(/[{"}]/g, '');
            }
            return tag;
          });
          tagsString = cleanTags.join(", ");
        } else if (typeof project.tags === 'string') {
          tagsString = project.tags.replace(/[{"}]/g, '');
        }
      }
      setTags(tagsString);

      setSelectedTeam(project.teamId || project.team_id || null);
    }
  }, [open, project]);


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
      };

      await updateProjectMutation.mutateAsync(projectData, {
        onSuccess: (data) => {
          notifications.update({
            id: notificationId,
            title: "Project Updated Successfully",
            message: "Your project has been updated successfully.",
            color: "green",
            autoClose: 2000,
            withCloseButton: true,
          });
          onOpenChange(false);
          if (onProjectUpdated) {
            onProjectUpdated(data);
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
        },
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
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Project Name</Label>
            <Input
              id="edit-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Enter project description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="edit-type">Project Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="edit-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCRUM">SCRUM</SelectItem>
                <SelectItem value="KANBAN">KANBAN</SelectItem>
                <SelectItem value="WATERFALL">WATERFALL</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Team</Label>
            <div className="p-2 border rounded-md bg-muted/20">
              {loadingTeams ? (
                <div className="flex justify-center p-2">
                  <Loader size="sm" />
                </div>
              ) : (
                <div className="text-sm">{currentTeam?.name || "No team assigned"}</div>
              )}
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProject}
            disabled={!projectName.trim() || !selectedTeam || isUpdating}
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}