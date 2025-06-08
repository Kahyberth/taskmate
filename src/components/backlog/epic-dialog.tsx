import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Edit, Trash } from "lucide-react";
import { apiClient } from "@/api/client-gateway";
import { Epic } from "@/interfaces/epic.interface";
import { notifications } from "@mantine/notifications";

interface EpicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  backlogId: string;
  onEpicCreated?: (epic: Epic) => void;
  onEpicSelected?: (epic: Epic | null) => void;
  selectedEpicId?: string | null;
}

export function EpicDialog({ 
  open, 
  onOpenChange, 
  backlogId,
  onEpicCreated,
  onEpicSelected,
  selectedEpicId 
}: EpicDialogProps) {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [epicName, setEpicName] = useState("");
  const [epicDescription, setEpicDescription] = useState("");
  
  useEffect(() => {
    if (open) {
      fetchEpics();
    }
  }, [open, backlogId]);
  
  const fetchEpics = async () => {
    if (!backlogId) return;
    
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/epics/get-by-backlog/${backlogId}`);
      
      if (response.data) {
        setEpics(response.data);
      }
    } catch (error) {
      console.error("Error fetching epics:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load epics",
        color: "red"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateEpic = async () => {
    if (!epicName.trim()) {
      notifications.show({
        title: "Error",
        message: "Epic title cannot be empty",
        color: "red"
      });
      return;
    }
    
    try {
      setIsCreating(true);
      const newEpic = {
        name: epicName,
        description: epicDescription,
        productBacklogId: backlogId,
      };
      
      const response = await apiClient.post(`/epics/create`, newEpic);
      
      if (response.data) {
        const createdEpic = response.data;
        setEpics([...epics, createdEpic]);
        resetForm();
        setShowCreateForm(false);
        
        notifications.show({
          title: "Epic created",
          message: `Epic "${createdEpic.title}" has been created successfully.`,
          color: "green"
        });
        
        if (onEpicCreated) {
          onEpicCreated(createdEpic);
        }
      }
    } catch (error) {
      console.error("Error creating epic:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create epic",
        color: "red"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleUpdateEpic = async () => {
    if (!editingEpic || !epicName.trim()) {
      notifications.show({
        title: "Error",
        message: "Epic title cannot be empty",
        color: "red"
      });
      return;
    }
    
    try {
      setIsCreating(true);
      const updatedEpic = {
        id: editingEpic.id,
        title: epicName,
        description: epicDescription,
      };
      
      const response = await apiClient.patch(`/projects/epics/update`, updatedEpic);
      
      if (response.data) {
        const updated = response.data;
        setEpics(epics.map(epic => epic.id === updated.id ? updated : epic));
        resetForm();
        setEditingEpic(null);
        
        notifications.show({
          title: "Epic updated",
          message: `Epic "${updated.title}" has been updated successfully.`,
          color: "green"
        });
      }
    } catch (error) {
      console.error("Error updating epic:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update epic",
        color: "red"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteEpic = async (epicId: string) => {
    if (!confirm("Are you sure you want to delete this epic? This action cannot be undone.")) {
      return;
    }
    
    try {
      await apiClient.delete(`/projects/epics/delete/${epicId}`);
      
      setEpics(epics.filter(epic => epic.id !== epicId));
      
      notifications.show({
        title: "Epic deleted",
        message: "Epic has been deleted successfully.",
        color: "green"
      });
      
      if (selectedEpicId === epicId && onEpicSelected) {
        onEpicSelected(null);
      }
    } catch (error) {
      console.error("Error deleting epic:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete epic",
        color: "red"
      });
    }
  };
  
  const handleEditEpic = (epic: Epic) => {
    setEditingEpic(epic);
    setEpicName(epic.name);
    setEpicDescription(epic.description || "");
    setShowCreateForm(true);
  };
  
  const resetForm = () => {
    setEpicName("");
    setEpicDescription("");
  };
  
  const handleCancel = () => {
    resetForm();
    setShowCreateForm(false);
    setEditingEpic(null);
  };
  
  const handleSelectEpic = (epic: Epic) => {
    if (onEpicSelected) {
      onEpicSelected(epic);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Project Epics</DialogTitle>
          <DialogDescription>
            Epics are groups of related user stories that represent a larger feature.
          </DialogDescription>
        </DialogHeader>
        
        {!showCreateForm ? (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={16} className="mr-2" />
              Create new epic
            </Button>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : epics.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No epics created for this project.
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {epics.map(epic => (
                  <div 
                    key={epic.id} 
                    className={`p-3 border rounded-md flex items-center justify-between dark:hover:bg-white/5 hover:bg-gray-50 cursor-pointer ${
                      selectedEpicId === epic.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => handleSelectEpic(epic)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                      <div>
                        <h4 className="font-medium">{epic.name}</h4>
                        {epic.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">{epic.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEpic(epic);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEpic(epic.id);
                        }}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="epic-title" className="text-right">
                  Name
                </Label>
                <Input
                  id="epic-title"
                  value={epicName}
                  onChange={(e) => setEpicName(e.target.value)}
                  className="col-span-3"
                  placeholder="Epic name"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="epic-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="epic-description"
                  value={epicDescription}
                  onChange={(e) => setEpicDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Epic description"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {showCreateForm ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={editingEpic ? handleUpdateEpic : handleCreateEpic} 
                disabled={isCreating || !epicName.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {editingEpic ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingEpic ? "Update epic" : "Create epic"
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )} 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}