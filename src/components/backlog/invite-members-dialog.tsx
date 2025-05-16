import { useState, useEffect, useContext, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Users, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/api/client-gateway";
import { AuthContext } from "@/context/AuthContext";
import { Team } from "@/lib/store";

interface InviteMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  projectMembers: any[];
  refetchMembers: () => Promise<void>;
  teams?: Team[] | null;
  currentTeam?: Team | null;
}

export function InviteMembersDialog({
  open,
  onOpenChange,
  project,
  projectMembers,
  refetchMembers,
  teams,
  currentTeam
}: InviteMembersDialogProps) {
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  
  // Estado para el formulario
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');
  const [inviteMethod, setInviteMethod] = useState<'email' | 'team'>('email');
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Limpiar el formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (!open) {
      setNewMemberEmail('');
      setSelectedTeamMember('');
      setInviteMethod('email');
    }
  }, [open]);

  // Filtrar los miembros del equipo que no están ya en el proyecto
  const availableTeamMembers = useMemo(() => {
    if (!currentTeam || !currentTeam.members) {
      console.log("No hay miembros del equipo disponibles: equipo no definido o sin miembros");
      return [];
    }
    
    console.log("Miembros del equipo actual:", currentTeam.members);
    console.log("Miembros del proyecto:", projectMembers);
    
    // Obtener los IDs de los miembros actuales del proyecto
    const projectMemberIds = projectMembers.map(pm => pm.user_id);
    console.log("IDs de miembros del proyecto:", projectMemberIds);
    
    // Filtrar los miembros del equipo que no están en el proyecto
    const availableMembers = currentTeam.members.filter(teamMember => {
      const memberId = teamMember.member.id;
      const isAlreadyMember = projectMemberIds.includes(memberId);
      
      console.log(`Evaluando miembro de equipo: ${teamMember.member.name} (ID: ${memberId}) - ¿Ya es miembro?: ${isAlreadyMember}`);
      
      return !isAlreadyMember;
    });
    
    console.log(`Encontrados ${availableMembers.length} miembros disponibles para invitar:`, availableMembers);
    return availableMembers;
  }, [currentTeam, projectMembers]);

  // Función para invitar a un miembro por correo
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemberEmail.trim() || isAddingMember || !project?.id) return;
    
    setIsAddingMember(true);
    
    try {
      // Llamar al endpoint mejorado que maneja la invitación a proyectos
      // El backend comprobará si el usuario existe, si está en el equipo, etc.
      const response = await apiClient.post(`/projects/invite-member`, {
        projectId: project.id,
        email: newMemberEmail,
        userId: user?.id,
        teamId: project.team_id // Enviamos el ID del equipo para que el backend pueda añadir al usuario al equipo si es necesario
      });
      
      if (response.data) {
        await refetchMembers();
        setNewMemberEmail('');
        
        // Mensaje personalizado según la respuesta
        if (response.data.addedToTeam) {
          toast({
            title: "Usuario invitado al equipo y proyecto",
            description: `El usuario con correo ${newMemberEmail} ha sido añadido al equipo y al proyecto.`,
          });
        } else {
          toast({
            title: "Usuario añadido al proyecto",
            description: `${newMemberEmail} ha sido añadido al proyecto.`,
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "No se pudo enviar la invitación";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  // Función para añadir un miembro existente del equipo
  const handleAddTeamMember = async () => {
    if (!selectedTeamMember || isAddingMember || !project?.id) return;
    
    setIsAddingMember(true);
    
    try {
      // Buscar el miembro seleccionado del equipo
      const selectedMember = currentTeam?.members?.find(m => m.member.id === selectedTeamMember);
      
      if (!selectedMember) {
        throw new Error("Miembro seleccionado no encontrado");
      }
      
      console.log("Invitando miembro del equipo:", selectedMember);
      
      // Obtener el correo del miembro del equipo
      const email = selectedMember.member.email;
      
      if (!email) {
        throw new Error("No se pudo determinar el correo electrónico del miembro");
      }
      
      console.log("Usando email para invitación:", email);
      
      // Ya que sabemos que este usuario ya está en el equipo, solo lo añadimos al proyecto
      const response = await apiClient.post(`/projects/invite-member`, {
        projectId: project.id,
        email: email,
        userId: user?.id,
        teamId: project.team_id
      });
      
      if (response.data) {
        await refetchMembers();
        setSelectedTeamMember('');
        
        const displayName = `${selectedMember.member.name || ''} ${selectedMember.member.lastName || ''}`.trim();
        
        toast({
          title: "Miembro añadido",
          description: `${displayName || email} ha sido añadido al proyecto.`,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "No se pudo añadir al miembro";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">Miembros del Proyecto</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {`${projectMembers.length} miembro(s) en este proyecto`}
            {currentTeam && (
              <span className="ml-1">
                - Equipo: {currentTeam.name}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {/* Tabs para métodos de invitación */}
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 pb-3">
            <Button
              variant={inviteMethod === 'email' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInviteMethod('email')}
              className="flex-1 dark:text-gray-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              Invitar por correo
            </Button>
            <Button
              variant={inviteMethod === 'team' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInviteMethod('team')}
              className="flex-1 dark:text-gray-200"
              disabled={!currentTeam || !currentTeam.members || currentTeam.members.length === 0}
            >
              <Users className="h-4 w-4 mr-2" />
              Miembros del equipo
            </Button>
          </div>
        </div>
        
        {/* Formulario para invitar por correo */}
        {inviteMethod === 'email' && (
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <form onSubmit={handleAddMember} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="member-email" className="text-sm font-medium dark:text-gray-200">
                  Añadir nuevo miembro por correo
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                    disabled={isAddingMember}
                  />
                  <Button 
                    type="submit" 
                    disabled={isAddingMember || !newMemberEmail.trim()}
                    className="dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
                  >
                    {isAddingMember ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Añadiendo...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        <span>Invitar</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Si el usuario no existe o no está en el equipo, se le enviará una invitación por correo electrónico.
                </p>
              </div>
            </form>
          </div>
        )}
        
        {/* Selector de miembros del equipo */}
        {inviteMethod === 'team' && (
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="team-member-select" className="text-sm font-medium dark:text-gray-200">
                  Seleccionar miembro del equipo
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedTeamMember}
                    onValueChange={setSelectedTeamMember}
                    disabled={isAddingMember}
                  >
                    <SelectTrigger id="team-member-select" className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                      <SelectValue placeholder="Seleccionar miembro" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {availableTeamMembers.length > 0 ? (
                        availableTeamMembers.map((teamMember) => (
                          <SelectItem 
                            key={teamMember.member.id} 
                            value={teamMember.member.id}
                            className="dark:text-gray-200"
                          >
                            {`${teamMember.member.name || ''} ${teamMember.member.lastName || ''}`.trim() || 'Usuario'} 
                            <span className="ml-1 text-gray-500">({teamMember.role})</span>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled className="dark:text-gray-400">
                          No hay miembros disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAddTeamMember} 
                    disabled={isAddingMember || !selectedTeamMember || selectedTeamMember === 'none'}
                    className="dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
                  >
                    {isAddingMember ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Añadiendo...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        <span>Añadir</span>
                      </>
                    )}
                  </Button>
                </div>
                {availableTeamMembers.length === 0 && (
                  <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No hay miembros del equipo disponibles para añadir al proyecto.
                  </p>
                  </div>
                )}
                {availableTeamMembers.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {`${availableTeamMembers.length} miembro(s) disponible(s) para añadir`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Lista de miembros actuales */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loadingMembers ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center p-2 rounded-md">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
                  <div className="ml-3 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projectMembers.length > 0 ? (
            <div className="grid gap-2">
              {projectMembers.map((member) => (
                <div 
                  key={member.user_id} 
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {member.user ? member.user.name.charAt(0) + (member.user.lastName ? member.user.lastName.charAt(0) : '') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium dark:text-gray-200">
                      {member.user ? `${member.user.name} ${member.user.lastName || ''}` : 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.user?.email || member.user_id}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {member.role || 'Miembro'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Users className="mx-auto h-12 w-12 opacity-30 mb-2" />
              <p>No hay miembros en este proyecto.</p>
              <p className="text-sm">Los miembros del proyecto aparecerán aquí cuando sean añadidos.</p>
            </div>
          )}
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