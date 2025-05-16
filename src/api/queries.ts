import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client-gateway";
import { Team, CreateTeamDTO, UpdateTeamDto } from "@/lib/store";

// Claves para las queries
export const queryKeys = {
  teams: "teams",
  team: (id: string) => ["team", id],
  teamMembers: (teamId: string) => ["teamMembers", teamId],
  projects: "projects",
  project: (id: string) => ["project", id],
  userProjects: (userId: string) => ["userProjects", userId],
};

// ====================== TEAMS API ======================

// Obtener equipos por usuario
export const useTeamsByUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: [queryKeys.teams, userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('%c[API Request] Obteniendo equipos para el usuario:', 'color: #2196F3; font-weight: bold', userId);
      const teamsResponse = await apiClient.get(`/teams/get-team-by-user/${userId}`);
      
      if (!teamsResponse.data) {
        return [];
      }
      
      const teamsData = teamsResponse.data;
      console.log('%c[API Response] Datos recibidos de equipos:', 'color: #4CAF50; font-weight: bold', teamsData.length);
      
      // Obtener miembros para cada equipo en paralelo
      const teamsWithMembers = await Promise.all(
        teamsData.map(async (team: Team) => {
          try {
            console.log('%c[API Request] Obteniendo miembros para equipo:', 'color: #2196F3; font-weight: bold', team.id);
            const membersResponse = await apiClient.get(`/teams/get-members-by-team/${team.id}`);
            const members = membersResponse.data;
            
            // Find the user's role in this team
            const userMembership = members.find((membership: any) => 
              membership.member?.id === userId
            );
            
            const userRole = userMembership?.role;

            return {
              ...team,
              role: userRole,
              members: members.map((member: any) => ({
                ...member,
                role: member.role
              }))
            };
          } catch (error: any) {
            console.error(`Error fetching members for team ${team.id}:`, error);
            return {
              ...team,
              role: null,
              members: [],
            };
          }
        })
      );
      
      return teamsWithMembers;
    },
    enabled: Boolean(userId),
  });
};

// Obtener miembros de un equipo
export const useTeamMembers = (teamId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.teamMembers(teamId || ""),
    queryFn: async () => {
      if (!teamId) return [];
      const response = await apiClient.get(`/teams/get-members-by-team/${teamId}`);
      return response.data;
    },
    enabled: Boolean(teamId),
  });
};

// Crear un equipo
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (team: CreateTeamDTO) => {
      const response = await apiClient.post("/teams/create-team", team);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.teams] });
    },
  });
};

// Actualizar un equipo
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (team: UpdateTeamDto) => {
      const response = await apiClient.patch(`/teams/update-team`, team);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.teams] });
      if ('id' in variables && typeof variables.id === 'string') {
        queryClient.invalidateQueries({ queryKey: queryKeys.team(variables.id) });
      }
    },
  });
};

// Eliminar un equipo
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ teamId, requesterId }: { teamId: string; requesterId: string }) => {
      const response = await apiClient.delete(`/teams/delete-team/${teamId}`, {
        data: { requesterId }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.teams] });
    },
  });
};

// ====================== PROJECTS API ======================

// Obtener proyectos por usuario
export const useProjectsByUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.userProjects(userId || ""),
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('%c[API Request] Obteniendo proyectos para el usuario:', 'color: #2196F3; font-weight: bold', userId);
      const projectsResponse = await apiClient.get(`/projects/findByUser/${userId}`);
      
      if (!projectsResponse.data) {
        return [];
      }
      
      console.log('%c[API Response] Datos recibidos de proyectos:', 'color: #4CAF50; font-weight: bold', 
        projectsResponse.data.length);
      
      // Añadir propiedad de progreso a los proyectos
      const projectsWithProgress = projectsResponse.data.map((project: any) => ({
        ...project,
        progress: calculateProgress(project),
      }));
      
      return projectsWithProgress;
    },
    enabled: Boolean(userId),
  });
};

// Función auxiliar para calcular el progreso del proyecto
const calculateProgress = (project: any) => {
  return project.members?.length > 0 ? 0 : 0;
};

// Obtener proyecto por ID
export const useProjectById = (projectId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.project(projectId || ""),
    queryFn: async () => {
      if (!projectId) return null;
      const response = await apiClient.get(`/projects/find-by-id/${projectId}`);
      return response.data;
    },
    enabled: Boolean(projectId),
  });
};

// Crear un proyecto
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiClient.post("/projects/create", projectData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.createdBy) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.userProjects(variables.createdBy) 
        });
      }
      queryClient.invalidateQueries({ queryKey: [queryKeys.projects] });
    },
  });
};

// Actualizar un proyecto
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiClient.patch(`/projects/update/${projectData.id}`, projectData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(variables.id) });
      if (variables.createdBy) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.userProjects(variables.createdBy) 
        });
      }
    },
  });
};

// Eliminar un proyecto
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiClient.delete(`/projects/delete/${projectId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.projects] });
    },
  });
}; 