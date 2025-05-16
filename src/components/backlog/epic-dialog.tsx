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
import { Loader2, Plus, Edit, Trash, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/api/client-gateway";
import { Epic } from "@/interfaces/epic.interface";

// Define available epic colors
const epicColors = [
  { name: "purple", value: "#9333ea", bg: "bg-purple-100", text: "text-purple-800" },
  { name: "blue", value: "#2563eb", bg: "bg-blue-100", text: "text-blue-800" },
  { name: "green", value: "#16a34a", bg: "bg-green-100", text: "text-green-800" },
  { name: "yellow", value: "#ca8a04", bg: "bg-yellow-100", text: "text-yellow-800" },
  { name: "red", value: "#dc2626", bg: "bg-red-100", text: "text-red-800" },
  { name: "pink", value: "#db2777", bg: "bg-pink-100", text: "text-pink-800" },
  { name: "indigo", value: "#4f46e5", bg: "bg-indigo-100", text: "text-indigo-800" },
  { name: "gray", value: "#4b5563", bg: "bg-gray-100", text: "text-gray-800" },
];

interface EpicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onEpicCreated?: (epic: Epic) => void;
  onEpicSelected?: (epic: Epic | null) => void;
  selectedEpicId?: string | null;
}

export function EpicDialog({ 
  open, 
  onOpenChange, 
  projectId,
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
  const [epicTitle, setEpicTitle] = useState("");
  const [epicDescription, setEpicDescription] = useState("");
  const [epicColor, setEpicColor] = useState(epicColors[0].value);
  
  useEffect(() => {
    if (open) {
      fetchEpics();
    }
  }, [open, projectId]);
  
  const fetchEpics = async () => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/projects/epics/${projectId}`);
      
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
    if (!epicTitle.trim()) {
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
        title: epicTitle,
        description: epicDescription,
        color: epicColor,
        projectId,
      };
      
      const response = await apiClient.post(`/projects/epics/create`, newEpic);
      
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
    if (!editingEpic || !epicTitle.trim()) {
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
        title: epicTitle,
        description: epicDescription,
        color: epicColor,
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
    setEpicTitle(epic.title);
    setEpicDescription(epic.description || "");
    setEpicColor(epic.color || epicColors[0].value);
    setShowCreateForm(true);
  };
  
  const resetForm = () => {
    setEpicTitle("");
    setEpicDescription("");
    setEpicColor(epicColors[0].value);
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
  
  const getEpicColorClasses = (color: string) => {
    const epicColor = epicColors.find(c => c.value === color);
    return epicColor ? `${epicColor.bg} ${epicColor.text}` : "bg-gray-100 text-gray-800";
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
                    className={`p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                      selectedEpicId === epic.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => handleSelectEpic(epic)}
                  >
                    <div className="flex items-center space-x-3">
                      <Circle 
                        size={14} 
                        className="fill-current" 
                        style={{ color: epic.color || epicColors[0].value }} 
                      />
                      <div>
                        <h4 className="font-medium">{epic.title}</h4>
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
                  Título
                </Label>
                <Input
                  id="epic-title"
                  value={epicTitle}
                  onChange={(e) => setEpicTitle(e.target.value)}
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
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Color
                </Label>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {epicColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-6 h-6 rounded-full ${
                        epicColor === color.value ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setEpicColor(color.value)}
                      aria-label={`Color ${color.name}`}
                    />
                  ))}
                </div>
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
                disabled={isCreating || !epicTitle.trim()}
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