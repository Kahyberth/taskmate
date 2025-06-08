import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProject } from "@/api/queries";

interface DeleteProjectDialogProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectDeleted?: () => void;
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectDeleted,
}: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const deleteProjectMutation = useDeleteProject();

  const confirmDeleteProject = async () => {
    if (isDeleting || !project) return;
  
    setIsDeleting(true);
  
    try {
      const notificationId = notifications.show({
        loading: true,
        title: "Deleting Project...",
        message: "Please wait while we delete your project.",
        color: "red",
        autoClose: false,
        withCloseButton: false,
      });
  
      await deleteProjectMutation.mutateAsync(project.id);

      if (project.createdBy) {
        queryClient.invalidateQueries({ 
          queryKey: ["projects", project.createdBy] 
        });
      }
    
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll();
      
      queries.forEach(query => {
        const queryKey = query.queryKey;
        if (Array.isArray(queryKey) && queryKey[0] === "projects") {
          queryClient.invalidateQueries({ queryKey });
        }
      });
  
      notifications.update({
        id: notificationId,
        loading: false,
        title: "Project Deleted Successfully",
        message: "Your project has been deleted.",
        color: "green",
        autoClose: 2000,
        withCloseButton: true,
      });
  
      onOpenChange(false);
  
      if (onProjectDeleted) {
        onProjectDeleted();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete project. Please try again.",
        color: "red",
      });
    } finally {
      setIsDeleting(false);
    }
  };  

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!isDeleting) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the project
            and all its associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirmDeleteProject}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}