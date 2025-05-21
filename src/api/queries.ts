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
  backlogIssues: (projectId: string) => ["backlogIssues", projectId],
  projectIssues: (projectId: string) => ["projectIssues", projectId],
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

// Obtener proyectos donde el usuario es miembro 
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

// Obtener issues de un proyecto para calcular progreso
export const useProjectIssues = (projectId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.projectIssues(projectId || ""),
    queryFn: async () => {
      if (!projectId) return [];
      try {
        const response = await apiClient.get(`/projects/issues/${projectId}`);
        return response.data || [];
      } catch (error) {
        console.error("Error fetching project issues:", error);
        return [];
      }
    },
    enabled: Boolean(projectId),
    // Setting a short staleTime to refresh data more frequently
    staleTime: 30000, // 30 seconds
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

// ====================== ISSUES API ======================

// Crear un issue
export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (issueData: any) => {
      const response = await apiClient.post("/issues/create", issueData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.projectId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.backlogIssues(variables.projectId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.project(variables.projectId) 
        });
        // Also invalidate projectIssues cache
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.projectIssues(variables.projectId) 
        });
      }
    },
  });
};

// Actualizar un issue
export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updateData: any) => {
      // Create a new object without the projectId property to send to the API
      const { projectId, ...apiUpdateData } = updateData;
      const response = await apiClient.patch(`/issues/update`, apiUpdateData);
      return response.data;
    },
    onSuccess: (_, variables: any) => {
      // Extract project ID from the update data or issue
      let projectId = variables.projectId;
      
      // If the issue data has the project ID information, use it
      if (!projectId && variables.id) {
        // We need to try to find the project ID in the cache
        const queryCache = queryClient.getQueryCache();
        const queries = queryCache.findAll();
        
        // Look through all query keys for backlogIssues
        for (const query of queries) {
          const queryKey = query.queryKey;
          if (Array.isArray(queryKey) && queryKey[0] === "backlogIssues") {
            const cachedData = queryClient.getQueryData(queryKey);
            if (Array.isArray(cachedData)) {
              const issue = cachedData.find((i: any) => i.id === variables.id);
              if (issue && issue.productBacklogId) {
                // Extract project ID from productBacklogId
                const response = queryClient.getQueryData(["project", issue.productBacklogId]);
                if (response && (response as any).id) {
                  projectId = (response as any).id;
                  break;
                }
              }
            }
          }
        }
      }
      
      if (projectId) {
        // Invalidate all relevant caches
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.backlogIssues(projectId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.project(projectId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.projectIssues(projectId) 
        });
      }
    },
  });
};

// Utility function to invalidate project issues cache
export const invalidateProjectIssues = (queryClient: any, projectId: string | undefined) => {
  if (projectId) {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.projectIssues(projectId) 
    });
  }
}; 