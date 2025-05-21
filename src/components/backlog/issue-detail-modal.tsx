import { useState, useEffect, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/interfaces/task.interface";
import { apiClient } from "@/api/client-gateway";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Save, Edit, FileEdit } from "lucide-react";

interface Comment {
  id: string;
  comment: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    lastName?: string;
    email: string;
  };
}

interface IssueDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onTaskUpdate: (updatedTask: Partial<Task>) => Promise<void>;
  getAssignedUser: (userId?: string) => { initials: string; name?: string; lastName?: string } | null;
  onOpenEditModal: (task: Task) => void;
}

export function IssueDetailModal({
  isOpen,
  onOpenChange,
  task,
  onTaskUpdate,
  getAssignedUser,
  onOpenEditModal,
}: IssueDetailModalProps) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  
  // States for the form
  const [description, setDescription] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState<{id: string, text: string} | null>(null);
  
  const [editing, setEditing] = useState(false);
  
  // Loading states
  const [loadingComments, setLoadingComments] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingComment, setEditingComment] = useState(false);

  // Fetch comments when the modal opens or task changes
  useEffect(() => {
    if (isOpen && task) {
      setDescription(task.description || "");
      setAcceptanceCriteria(task.acceptanceCriteria || "");
      fetchComments();
      setEditing(false);
    }
  }, [isOpen, task]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNewComment("");
      setEditComment(null);
      setEditing(false);
    }
  }, [isOpen]);

  // Reset form after successful edit
  useEffect(() => {
    if (!editingComment && !editComment) {
      // Si terminamos de editar y no hay comentario en edición, recargamos comentarios
      if (isOpen && task) {
        fetchComments();
      }
    }
  }, [editingComment, editComment, isOpen, task]);

  // Fetch comments for the current issue
  const fetchComments = async () => {
    if (!task) return;
    
    setLoadingComments(true);
    try {
      const response = await apiClient.get(`/issues/get-comments/${task.id}`);
      setComments(response.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los comentarios",
        variant: "destructive",
      });
    } finally {
      setLoadingComments(false);
    }
  };

  // Format acceptance criteria as a bulleted list
  const formatAcceptanceCriteria = (criteria: string) => {
    if (!criteria) return <p className="text-gray-500 dark:text-gray-400 italic">No se han definido criterios de aceptación</p>;
    
    return (
      <ul className="list-inside space-y-1 text-sm dark:text-gray-300">
        {criteria.split('\n').filter(line => line.trim()).map((line, index) => (
          <li key={index} className="flex">
            <span className="mr-2">-</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Handle edit button click - closes this modal and opens edit modal
  const handleEdit = () => {
    if (task) {
      onOpenChange(false);
      onOpenEditModal(task);
    }
  };

  // Cancel editing and restore original values
  const handleCancelEdit = () => {
    setEditing(false);
    setDescription(task?.description || "");
    setAcceptanceCriteria(task?.acceptanceCriteria || "");
  };

  // Save both description and acceptance criteria in a single request
  const handleSave = async () => {
    if (!task) return;
    
    setSaving(true);
    try {
      // Solo incluir los campos que hayan cambiado
      const updatedFields: Partial<Task> = {
        id: task.id
      };
      
      // Comparar con los valores originales
      if (description !== task.description) {
        updatedFields.description = description;
      }
      
      if (acceptanceCriteria !== task.acceptanceCriteria) {
        updatedFields.acceptanceCriteria = acceptanceCriteria;
      }
      
      // Solo realizar la petición si hay cambios
      if (Object.keys(updatedFields).length > 1) {
        await onTaskUpdate(updatedFields);
        
        toast({
          title: "Éxito",
          description: "Cambios guardados correctamente",
        });
      }
      
      setEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Submit a new comment
  const handleSubmitComment = async () => {
    if (!task || !user || !newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      await apiClient.post("/issues/create-comment", {
        comment: newComment.trim(),
        issue_id: task.id,
        user_id: user.id
      });
      
      // Clear input and refresh comments
      setNewComment("");
      await fetchComments();
      
      toast({
        title: "Éxito",
        description: "Comentario añadido correctamente",
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir el comentario",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  // Update an existing comment
  const handleUpdateComment = async () => {
    if (!editComment || !user) return;
    
    setEditingComment(true);
    try {
      // Enviar la actualización al backend
      const response = await apiClient.put("/issues/update-comment", {
        id: editComment.id,
        comment: editComment.text,
        user_id: user.id
      });
      
      // Verificar si la respuesta fue exitosa
      if (response.data) {
        // Actualizar el comentario en la lista local
        setComments(comments.map(comment => 
          comment.id === editComment.id 
            ? { ...comment, comment: editComment.text, updatedAt: new Date() }
            : comment
        ));
        
        // Limpiar estado de edición
        setEditComment(null);
        
        // Mostrar mensaje de éxito
        toast({
          title: "Éxito",
          description: "Comentario actualizado correctamente",
        });
      } else {
        throw new Error("No se recibió confirmación del servidor");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el comentario",
        variant: "destructive",
      });
    } finally {
      setEditingComment(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    if (!commentId) return;
    
    try {
      await apiClient.delete(`/issues/delete-comment/${commentId}`);
      
      // Refresh comments
      await fetchComments();
      
      toast({
        title: "Éxito",
        description: "Comentario eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario",
        variant: "destructive",
      });
    }
  };

  // Format date to a readable string
  const formatDate = (dateString: Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">
            {task?.title} <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">{task?.code}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Edit Button */}
          <div className="flex justify-end">
            <Button
              variant="outline" 
              size="sm"
              onClick={handleEdit}
              className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>

          {/* Description and Acceptance Criteria sections */}
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-md font-medium dark:text-gray-200">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Añade una descripción detallada de la tarea..."
                  className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="acceptance-criteria" className="text-md font-medium dark:text-gray-200">
                  Criterios de aceptación
                </Label>
                <Textarea
                  id="acceptance-criteria"
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  placeholder="Define los criterios para considerar esta tarea como completada (un criterio por línea)..."
                  className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      <span>Guardar</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Description section (read-only) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-md font-medium dark:text-gray-200">
                    Descripción
                  </Label>
                </div>
                
                <div className="p-3 border dark:border-gray-700 rounded-md">
                  {description ? (
                    <p className="text-sm dark:text-gray-300 whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No hay descripción</p>
                  )}
                </div>
              </div>

              {/* Acceptance criteria section (read-only) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="acceptance-criteria" className="text-md font-medium dark:text-gray-200">
                    Criterios de aceptación
                  </Label>
                </div>
                
                <div className="p-3 border dark:border-gray-700 rounded-md">
                  {formatAcceptanceCriteria(acceptanceCriteria)}
                </div>
              </div>
            </>
          )}

          <Separator className="my-4 dark:bg-gray-700" />

          {/* Comments section */}
          <div className="space-y-3">
            <Label className="text-md font-medium dark:text-gray-200">
              Comentarios
            </Label>
            
            {/* Comments list */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {loadingComments ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="p-3 border dark:border-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {getAssignedUser(comment.user_id)?.initials || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium dark:text-gray-200">
                          {getAssignedUser(comment.user_id)?.name || 'Usuario'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatDate(comment.updatedAt)}
                        </span>
                      </div>

                      {/* Comment actions if user is the author */}
                      {user && user.id === comment.user_id && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditComment({ id: comment.id, text: comment.comment })}
                            className="h-7 text-xs dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="h-7 text-xs text-red-500 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-gray-800"
                          >
                            Eliminar
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Comment text or edit form */}
                    {editComment?.id === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editComment.text}
                          onChange={(e) => setEditComment({ ...editComment, text: e.target.value })}
                          className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                          placeholder="Escribe tu comentario..."
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditComment(null)}
                            className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            disabled={editingComment}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleUpdateComment}
                            disabled={editingComment || !editComment.text.trim()}
                            className="dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
                          >
                            {editingComment ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                <span>Guardando...</span>
                              </>
                            ) : (
                              <>
                                <Save className="h-3.5 w-3.5 mr-1" />
                                <span>Guardar</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm dark:text-gray-300">{comment.comment}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p>No hay comentarios aún.</p>
                </div>
              )}
            </div>
            
            {/* New comment form */}
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Añadir un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submittingComment}
                  className="dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
                >
                  {submittingComment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      <span>Enviar</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 