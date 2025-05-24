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
  projectStats: (projectId: string) => ["projectStats", projectId],
};

// ====================== TEAMS API ======================

// Obtener equipos por usuario
export const useTeamsByUser = (userId: string | undefined, page: number = 1) => {
  console.log("useTeamsByUser called with page:", page);
  
  return useQuery({
    queryKey: [queryKeys.teams, userId, page],
    queryFn: async () => {
      if (!userId) return { teams: [], totalPages: 0 };
      
      console.log('%c[API Request] Obteniendo equipos para el usuario:', 'color: #2196F3; font-weight: bold', userId, 'página:', page);
      // Ensure the page parameter is included in the URL - make sure leading slash is consistent
      const url = `/teams/get-team-by-user/${userId}?page=${page}`;
      console.log("Full API URL:", url);
      
      const response = await apiClient.get(url);
      
      console.log("API Response:", response.data);
      
      if (!response.data) {
        return { teams: [], totalPages: 0 };
      }
      
      // Extract data and pagination metadata from response
      let teamsData;
      let totalPages = 1;
      let total = 0;
      
      // Handle the new response format with data and meta properties
      if (response.data.data && response.data.meta) {
        teamsData = response.data.data;
        totalPages = response.data.meta.totalPages || 1;
        total = response.data.meta.total || 0;
      } else {
        // Handle the old format for backwards compatibility
        teamsData = response.data;
      }
      
      console.log('%c[API Response] Datos recibidos de equipos:', 'color: #4CAF50; font-weight: bold', 
        'teams:', teamsData.length, 
        'totalPages:', totalPages, 
        'total:', total);
      
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
      
      return { 
        teams: teamsWithMembers, 
        totalPages,
        total
      };
    },
    enabled: Boolean(userId),
    // Make sure React Query refetches when the page changes
    refetchOnWindowFocus: false,
    staleTime: 0, // Don't cache the data to ensure fresh data on page change
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
export const useProjectsByUser = (userId: string | undefined, page: number = 1, limit: number = 6) => {
  return useQuery({
    queryKey: [queryKeys.userProjects(userId || ""), page, limit],
    queryFn: async () => {
      if (!userId) return { projects: [], totalPages: 0, total: 0 };
      
      console.log('%c[API Request] Obteniendo proyectos para el usuario:', 'color: #2196F3; font-weight: bold', userId, 'página:', page, 'límite:', limit);
      
      const response = await apiClient.get(`/projects/findAllByUser?userId=${userId}&page=${page}&limit=${limit}`);
      
      if (!response.data) {
        return { projects: [], totalPages: 0, total: 0 };
      }
      
      let projectsData;
      let totalPages = 1;
      let total = 0;
      
      // Handle response format with data and meta properties
      if (response.data.data && response.data.meta) {
        projectsData = response.data.data;
        totalPages = response.data.meta.totalPages || 1;
        total = response.data.meta.total || 0;
      } else {
        projectsData = response.data;
        total = projectsData.length;
        totalPages = Math.ceil(total / limit);
      }
      
      const projectsWithProgress = projectsData.map((project: any) => ({
        ...project,
        progress: calculateProgress(project),
      }));
      
      return { 
        projects: projectsWithProgress, 
        totalPages,
        total
      };
    },
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
  });
};

// Obtener issues de un proyecto para calcular progreso
export const useProjectIssues = (projectId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.projectIssues(projectId || ""),
    queryFn: async () => {
      if (!projectId) return [];
      try {
        console.log("Fetching issues for project:", projectId);
        const response = await apiClient.get(`/projects/issues/${projectId}`, {
          params: {
            limit: 1000 // Asegurar que obtenemos todos los issues
          }
        });
        console.log("Project issues API response:", response.data);
        
        // Manejar diferentes formatos de respuesta del API
        if (response.data && response.data.issues) {
          // Nuevo formato: { issues: [...], total: number }
          console.log(`Received ${response.data.issues.length} issues of ${response.data.total} total`);
          return response.data.issues || [];
        } else if (Array.isArray(response.data)) {
          // Formato antiguo: array directo de issues
          console.log(`Received ${response.data.length} issues (array format)`);
          return response.data;
        } else {
          console.warn("Unexpected API response format:", response.data);
          return [];
        }
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
      const response = await apiClient.get(`/projects/find/${projectId}`);
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
    onMutate: async (newIssue) => {
      // Cancelar cualquier refetch pendiente
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.backlogIssues(newIssue.productBacklogId) 
      });

      // Obtener el caché actual
      const previousIssues = queryClient.getQueryData(
        queryKeys.backlogIssues(newIssue.productBacklogId)
      );

      // Actualizar el caché optimistamente
      queryClient.setQueryData(
        queryKeys.backlogIssues(newIssue.productBacklogId),
        (old: any) => {
          const optimisticIssue = {
            ...newIssue,
            id: 'temp-' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: newIssue.status || 'to-do',
            priority: newIssue.priority || 'medium',
            type: newIssue.type || 'user_story',
          };
          return old ? [...old, optimisticIssue] : [optimisticIssue];
        }
      );

      // Retornar el contexto con el caché anterior
      return { previousIssues };
    },
    onError: (err, newIssue, context) => {
      // Si hay un error, revertir al caché anterior
      if (context?.previousIssues) {
        queryClient.setQueryData(
          queryKeys.backlogIssues(newIssue.productBacklogId),
          context.previousIssues
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidar y refetch después de que la mutación se complete
      if (variables.productBacklogId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.backlogIssues(variables.productBacklogId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.project(variables.productBacklogId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.projectIssues(variables.productBacklogId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.projectStats(variables.productBacklogId) 
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
      const { projectId, ...apiUpdateData } = updateData;
      const response = await apiClient.patch(`/issues/update`, apiUpdateData);
      return response.data;
    },
    onSuccess: (_, variables: any) => {
      let projectId = variables.projectId;
      
      if (!projectId && variables.id) {
        const queryCache = queryClient.getQueryCache();
        const queries = queryCache.findAll();
        
        for (const query of queries) {
          const queryKey = query.queryKey;
          if (Array.isArray(queryKey) && queryKey[0] === "backlogIssues") {
            const cachedData = queryClient.getQueryData(queryKey);
            if (Array.isArray(cachedData)) {
              const issue = cachedData.find((i: any) => i.id === variables.id);
              if (issue && issue.productBacklogId) {
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
        // Actualizar el caché de las estadísticas del proyecto
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.projectStats(projectId) 
        });
        
        // Actualizar el caché de los issues del proyecto
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.projectIssues(projectId) 
        });
        
        // Actualizar el caché del proyecto
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.project(projectId) 
        });
        
        // Actualizar el caché de los issues del backlog
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.backlogIssues(projectId) 
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

// Obtener estadísticas de un proyecto (total, completados, progreso)
export const useProjectStats = (projectId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.projectStats(projectId || ""),
    queryFn: async () => {
      if (!projectId) return { total: 0, completed: 0, progress: 0 };
      try {
        console.log("Fetching project stats for project:", projectId);
        const response = await apiClient.get(`/backlog/project-stats/${projectId}`);
        return response.data || { total: 0, completed: 0, progress: 0 };
      } catch (error) {
        console.error("Error fetching project stats:", error);
        return { total: 0, completed: 0, progress: 0 };
      }
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
  });
};

// Utility function to invalidate project stats cache
export const invalidateProjectStats = (queryClient: any, projectId: string | undefined) => {
  if (projectId) {
    console.log("Invalidating project stats cache for project:", projectId);
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.projectStats(projectId) 
    });
  }
}; 