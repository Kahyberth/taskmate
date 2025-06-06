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
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/api/client-gateway";
import { Epic } from "@/interfaces/epic.interface";


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
  const { toast } = useToast();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  
  // Form state
  const [epicName, setEpicName] = useState("");
  const [epicDescription, setEpicDescription] = useState("");
  
  useEffect(() => {
    if (open) {
      fetchEpics();
    }
  }, [open, backlogId]);
  
  const fetchEpics = async () => {
    if (!backlogId) {
      console.log("No backlogId available for fetching epics");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Fetching epics with backlogId:", backlogId);
      const response = await apiClient.get(`/epics/get-by-backlog/${backlogId}`);
      console.log("Epics response:", response.data);
      
      if (response.data) {
        setEpics(response.data);
      }
    } catch (error) {
      console.error("Error fetching epics:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las épicas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateEpic = async () => {
    if (!epicName.trim()) {
      toast({
        title: "Error",
        description: "El título de la épica no puede estar vacío",
        variant: "destructive",
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
        
        toast({
          title: "Épica creada",
          description: `La épica "${createdEpic.title}" ha sido creada exitosamente.`,
        });
        
        if (onEpicCreated) {
          onEpicCreated(createdEpic);
        }
      }
    } catch (error) {
      console.error("Error creating epic:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la épica",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleUpdateEpic = async () => {
    if (!editingEpic || !epicName.trim()) {
      toast({
        title: "Error",
        description: "El título de la épica no puede estar vacío",
        variant: "destructive",
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
        
        toast({
          title: "Épica actualizada",
          description: `La épica "${updated.title}" ha sido actualizada exitosamente.`,
        });
      }
    } catch (error) {
      console.error("Error updating epic:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la épica",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteEpic = async (epicId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta épica? Esta acción no se puede deshacer.")) {
      return;
    }
    
    try {
      await apiClient.delete(`/projects/epics/delete/${epicId}`);
      
      setEpics(epics.filter(epic => epic.id !== epicId));
      
      toast({
        title: "Épica eliminada",
        description: "La épica ha sido eliminada exitosamente.",
      });
      
      if (selectedEpicId === epicId && onEpicSelected) {
        onEpicSelected(null);
      }
    } catch (error) {
      console.error("Error deleting epic:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la épica",
        variant: "destructive",
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
          <DialogTitle>Épicas del proyecto</DialogTitle>
          <DialogDescription>
            Las épicas son grupos de historias de usuario relacionadas que representan una funcionalidad mayor.
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
              Crear nueva épica
            </Button>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : epics.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay épicas creadas para este proyecto.
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
                    <div className="flex items-center space-x-3 ">
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
                  Nombre
                </Label>
                <Input
                  id="epic-title"
                  value={epicName}
                  onChange={(e) => setEpicName(e.target.value)}
                  className="col-span-3"
                  placeholder="Nombre de la épica"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="epic-description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="epic-description"
                  value={epicDescription}
                  onChange={(e) => setEpicDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Descripción de la épica"
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
                Cancelar
              </Button>
              <Button 
                onClick={editingEpic ? handleUpdateEpic : handleCreateEpic} 
                disabled={isCreating || !epicName.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {editingEpic ? "Actualizando..." : "Creando..."}
                  </>
                ) : (
                  editingEpic ? "Actualizar épica" : "Crear épica"
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          )} 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 