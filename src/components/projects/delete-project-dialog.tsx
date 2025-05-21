import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/api/client-gateway";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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

      await apiClient.delete(`/projects/${project.id}`);
      
      // Close dialog first
      onOpenChange(false);
      
      notifications.update({
        id: notificationId,
        title: "Project Deleted Successfully",
        message: "Your project has been deleted.",
        color: "green",
        autoClose: 2000,
        withCloseButton: true,
      });
      
      // Invalidate projects cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // Call the callback if provided
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
          <DialogTitle>¿Estás seguro de que quieres eliminar este proyecto?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto
            y todos sus datos asociados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirmDeleteProject}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 