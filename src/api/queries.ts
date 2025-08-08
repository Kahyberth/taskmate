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
  dashboardStats: (userId: string) => ["dashboardStats", userId],
  taskCompletionStats: (userId: string) => ["taskCompletionStats", userId],
  projectProgressStats: (userId: string) => ["projectProgressStats", userId],
  aiInsights: (userId: string) => ["aiInsights", userId],
  epics: (projectId: string) => ["epics", projectId],
  epicIssues: (epicId: string) => ["epicIssues", epicId],
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

export const useLeaveTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({teamId, userId}: {teamId: string; userId: string}) => {
      const response = await apiClient.post(`/teams/leave-team/${teamId}`, { teamId, userId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.teams] });
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
      
      try {
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
      } catch (error) {
        console.error("Error fetching user projects:", error);
        return { projects: [], totalPages: 0, total: 0 };
      }
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
        
        // Use the new endpoint to get all issues for a project
        const response = await apiClient.get(`/issues/by-project/${projectId}`);
        
        console.log("Project issues API response:", response.data);
        
        if (Array.isArray(response.data)) {
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

const calculateProgress = (project: any) => {
  return project.members?.length > 0 ? 0 : 0;
};

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


export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiClient.delete(`/projects/delete/${projectId}`);
      return response.data;
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.projects] });
      
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll();
      
      queries.forEach(query => {
        const queryKey = query.queryKey;
        if (Array.isArray(queryKey) && queryKey[0] === queryKeys.userProjects("")[0]) {
          queryClient.invalidateQueries({ queryKey });
        }
      });
    },
  });
};

// ====================== ISSUES API ======================

// Crear un issue
export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (issueData: any) => {
      const { productBacklogId, ...issueDataWithoutProductBacklogId } = issueData;
      console.log(issueDataWithoutProductBacklogId);
      const response = await apiClient.post(`/backlog/add-issue/${productBacklogId}`, issueDataWithoutProductBacklogId);
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
    onError: (_, newIssue, context) => {
      // Si hay un error, revertir al caché anterior
      if (context?.previousIssues) {
        queryClient.setQueryData(
          queryKeys.backlogIssues(newIssue.productBacklogId),
          context.previousIssues
        );
      }
    },
    onSettled: (_, __, variables) => {
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
      console.log("updateData", updateData);
      const response = await apiClient.patch(`/issues/update?id=${updateData.id}`, apiUpdateData);
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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
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

// ====================== DASHBOARD STATS API ======================

export const useTaskCompletionStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.taskCompletionStats(userId || ""),
    queryFn: async () => {
      if (!userId) return [];
      try {
        console.log("Fetching task completion stats for user:", userId);
        const issuesResponse = await apiClient.get(`/issues/user/${userId}`);
        const issues = issuesResponse.data || [];
        console.log(`Processing ${issues.length} issues for task completion stats`);
        
        return calculateTaskStatsByDay(issues);
      } catch (error) {
        console.error("Error fetching task completion stats:", error);
        return [];
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
};

const calculateTaskStatsByDay = (issues: any[]) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const lastSevenDays = Array.from({length: 7}, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return {
      date: startDate,
      endDate: endDate,
      name: dayNames[date.getDay()]
    };
  });
  
  const statsByDay = lastSevenDays.map(day => {
    const completedThatDay = issues.filter(issue => {
      if (issue.updatedAt && (issue.status === 'done' || issue.status === 'closed')) {
        const updatedDate = new Date(issue.updatedAt);
        return updatedDate >= day.date && updatedDate <= day.endDate;
      }
      return false;
    }).length;
    
    const pendingThatDay = issues.filter(issue => {
      const createdDate = new Date(issue.createdAt);
      if (createdDate <= day.endDate) {
        if (issue.status === 'done' || issue.status === 'closed') {
          const updatedDate = new Date(issue.updatedAt || new Date());
          return updatedDate > day.endDate;
        }
        return true;
      }
      return false;
    }).length;
    
    return {
      name: day.name,
      completed: completedThatDay,
      pending: pendingThatDay,
      total: completedThatDay + pendingThatDay
    };
  });
  
  // Always return the data structure, even if empty
  return statsByDay;
};

// Obtener estadísticas de progreso de proyectos para el dashboard
export const useProjectProgressStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.projectProgressStats(userId || ""),
    queryFn: async () => {
      if (!userId) return [];
      try {
        console.log("Fetching project progress stats for user:", userId);
        
        // Primero obtenemos los proyectos del usuario
        const projectsResponse = await apiClient.get(`/projects/findAllByUser?userId=${userId}`);
        let projects = [];
        
        if (projectsResponse.data && projectsResponse.data.data) {
          projects = projectsResponse.data.data;
        } else if (Array.isArray(projectsResponse.data)) {
          projects = projectsResponse.data;
        }
        
        // Limitamos a los 5 proyectos más recientes o activos
        const recentProjects = projects.slice(0, 5);
        
        // Para cada proyecto, obtenemos estadísticas consolidadas de todas sus issues
        const projectsWithStats = await Promise.all(
          recentProjects.map(async (project: any) => {
            try {
              // 1. Intentamos el endpoint de estadísticas existente primero
              let progress = 0;
              let hasFetchedStats = false;
              
              try {
                const statsResponse = await apiClient.get(`/backlog/project-stats/${project.id}`);
                if (statsResponse.data && typeof statsResponse.data.progress === 'number') {
                  progress = statsResponse.data.progress;
                  hasFetchedStats = true;
                  console.log(`Using existing stats for project ${project.id}:`, progress);
                }
              } catch (error) {
                console.log(`Stats endpoint failed for project ${project.id}, calculating manually`);
              }
              
              // 2. Si el endpoint falló o no devolvió datos válidos, calculamos manualmente
              if (!hasFetchedStats) {
                // Obtenemos issues de todas las fuentes
                const allIssues = await getAllProjectIssues(project.id);
                
                if (allIssues.length > 0) {
                  const completedIssues = allIssues.filter(
                    issue => issue.status === 'done' || issue.status === 'closed'
                  ).length;
                  
                  progress = Math.round((completedIssues / allIssues.length) * 100);
                  console.log(`Calculated progress for project ${project.id}:`, progress, `(${completedIssues}/${allIssues.length})`);
                }
              }
              
              return {
                name: project.name,
                progress: progress,
                total: 100,
                id: project.id
              };
            } catch (error) {
              console.error(`Error processing stats for project ${project.id}:`, error);
              return {
                name: project.name,
                progress: 0,
                total: 100,
                id: project.id
              };
            }
          })
        );
        
        // Ordenamos los proyectos por progreso (de menor a mayor)
        return projectsWithStats.sort((a, b) => a.progress - b.progress);
      } catch (error) {
        console.error("Error fetching project progress stats:", error);
        return [];
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Función auxiliar para obtener todas las issues de un proyecto
const getAllProjectIssues = async (projectId: string): Promise<any[]> => {
  try {
    let allIssues: any[] = [];
    
    // 1. Intentamos obtener issues del backlog
    try {
      const backlogResponse = await apiClient.get(`/backlog/get-backlog-by-project/${projectId}`);
      if (backlogResponse.data && backlogResponse.data.id) {
        const backlogId = backlogResponse.data.id;
        const backlogIssuesResponse = await apiClient.get(`/backlog/get-all-issues/${backlogId}`);
        
        if (backlogIssuesResponse.data && Array.isArray(backlogIssuesResponse.data)) {
          allIssues = [...allIssues, ...backlogIssuesResponse.data];
          console.log(`Found ${backlogIssuesResponse.data.length} issues in backlog for project ${projectId}`);
        }
      }
    } catch (error) {
      console.log(`No backlog found or error fetching backlog issues for project ${projectId}`);
    }
    
    // 2. Intentamos obtener issues de los sprints
    try {
      const sprintsResponse = await apiClient.get(`/sprints/get-sprints-by-project/${projectId}`);
      
      if (sprintsResponse.data && Array.isArray(sprintsResponse.data)) {
        const sprints = sprintsResponse.data;
        
        // Para cada sprint, obtenemos sus issues
        for (const sprint of sprints) {
          try {
            const sprintIssuesResponse = await apiClient.get(
              `/sprints/get-sprint-backlog-issues?sprintId=${sprint.id}`
            );
            
            if (sprintIssuesResponse.data && Array.isArray(sprintIssuesResponse.data)) {
              allIssues = [...allIssues, ...sprintIssuesResponse.data];
              console.log(`Found ${sprintIssuesResponse.data.length} issues in sprint ${sprint.id} for project ${projectId}`);
            }
          } catch (sprintError) {
            console.log(`Error fetching issues for sprint ${sprint.id}`);
          }
        }
      }
    } catch (error) {
      console.log(`No sprints found or error fetching sprints for project ${projectId}`);
    }
    
    // 3. Como alternativa, intentamos obtener todas las issues del proyecto directamente
    if (allIssues.length === 0) {
      try {
        const projectIssuesResponse = await apiClient.get(`/projects/issues/${projectId}`);
        
        if (projectIssuesResponse.data) {
          // El endpoint puede devolver diferentes formatos
          if (Array.isArray(projectIssuesResponse.data)) {
            allIssues = projectIssuesResponse.data;
          } else if (projectIssuesResponse.data.issues && Array.isArray(projectIssuesResponse.data.issues)) {
            allIssues = projectIssuesResponse.data.issues;
          }
          console.log(`Found ${allIssues.length} issues directly for project ${projectId}`);
        }
      } catch (error) {
        console.log(`Error fetching issues directly for project ${projectId}`);
      }
    }
    
    // Eliminamos duplicados basados en ID
    const uniqueIssues = allIssues.filter((issue, index, self) => 
      index === self.findIndex(i => i.id === issue.id)
    );
    
    console.log(`Total unique issues for project ${projectId}: ${uniqueIssues.length}`);
    return uniqueIssues;
  } catch (error) {
    console.error(`Error in getAllProjectIssues for project ${projectId}:`, error);
    return [];
  }
};

// Obtener insights de IA para el dashboard
export const useAIInsights = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.aiInsights(userId || ""),
    queryFn: async () => {
      if (!userId) return [];
      try {
        console.log("Fetching AI insights for user:", userId);
        
        // Intentamos obtener los insights del backend si existe el endpoint
        try {
          const response = await apiClient.get(`/ai/insights/${userId}`);
          if (response.data && Array.isArray(response.data)) {
            return response.data;
          }
        } catch (error) {
          console.log("AI insights endpoint not available, generating locally");
        }
        
        // Si no hay endpoint o falla, generamos insights basados en los datos locales
        // Obtenemos las tareas del usuario
        const issuesResponse = await apiClient.get(`/issues/user/${userId}`);
        const issues = issuesResponse.data || [];
        
        // Obtenemos los proyectos del usuario
        const projectsResponse = await apiClient.get(`/projects/findAllByUser?userId=${userId}`);
        let projects = [];
        if (projectsResponse.data && projectsResponse.data.data) {
          projects = projectsResponse.data.data;
        } else if (Array.isArray(projectsResponse.data)) {
          projects = projectsResponse.data;
        }
        
        // Si no hay datos suficientes, retornamos insights básicos
        if (issues.length === 0 && projects.length === 0) {
          return [
            {
              id: 1,
              insight: "¡Bienvenido a TaskMate! Comienza creando tu primer proyecto para recibir insights personalizados.",
              type: "productivity"
            },
            {
              id: 2,
              insight: "No tienes tareas asignadas aún. Crea algunas tareas para empezar a trabajar.",
              type: "workflow"
            }
          ];
        }
        
        // Generamos insights basados en los datos
        const insights = [];
        
        // Insight 1: Productividad por día de la semana
        const issuesByDay = [0, 0, 0, 0, 0, 0, 0]; // Dom, Lun, Mar, Mié, Jue, Vie, Sáb
        issues.forEach((issue: any) => {
          if (issue.status === 'done' || issue.status === 'closed') {
            const updatedAt = new Date(issue.updatedAt);
            issuesByDay[updatedAt.getDay()]++;
          }
        });
        
        const mostProductiveDay = issuesByDay.indexOf(Math.max(...issuesByDay));
        const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        
        if (Math.max(...issuesByDay) > 0) {
          insights.push({
            id: 1,
            insight: `Eres más productivo los ${dayNames[mostProductiveDay]}. Considera programar tus tareas más importantes para ese día.`,
            type: "productivity"
          });
        }
        
        // Insight 2: Proyectos en riesgo
        const projectsAtRisk = projects.filter((project: any) => {
          // Verificamos si el proyecto tiene estadísticas
          if (project.stats && project.stats.progress < 50) {
            return true;
          }
          return false;
        });
        
        if (projectsAtRisk.length > 0) {
          insights.push({
            id: 2,
            insight: `${projectsAtRisk.length} ${projectsAtRisk.length === 1 ? 'proyecto está' : 'proyectos están'} en riesgo de retrasarse basado en el progreso actual.`,
            type: "risk"
          });
        }
        
        // Insight 3: Distribución de tipos de tareas
        const taskTypes: Record<string, number> = {};
        issues.forEach((issue: any) => {
          if (!taskTypes[issue.type]) {
            taskTypes[issue.type] = 0;
          }
          taskTypes[issue.type]++;
        });
        
        const mostCommonType = Object.entries(taskTypes).sort((a, b) => b[1] - a[1])[0];
        if (mostCommonType) {
          const [type, count] = mostCommonType;
          const percentage = Math.round((count / issues.length) * 100);
          
          insights.push({
            id: 3,
            insight: `El ${percentage}% de tus tareas son de tipo "${type}". Considera diversificar tus habilidades trabajando en diferentes tipos de tareas.`,
            type: "workflow"
          });
        }
        
        // Insight 4: Tiempo promedio para completar tareas
        const completedIssues = issues.filter((issue: any) => 
          issue.status === 'done' || issue.status === 'closed'
        );
        
        if (completedIssues.length > 0) {
          const completionTimes = completedIssues.map((issue: any) => {
            const createdAt = new Date(issue.createdAt).getTime();
            const updatedAt = new Date(issue.updatedAt).getTime();
            return (updatedAt - createdAt) / (1000 * 60 * 60 * 24); // días
          });
          
          const avgCompletionTime = completionTimes.reduce((a: number, b: number) => a + b, 0) / completionTimes.length;
          
          insights.push({
            id: 4,
            insight: `En promedio, completas tus tareas en ${avgCompletionTime.toFixed(1)} días. Establecer plazos más cortos podría mejorar tu productividad.`,
            type: "time"
          });
        }
        
        return insights;
      } catch (error) {
        console.error("Error fetching AI insights:", error);
        return [];
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 30, // 30 minutos
  });
};

// Obtener issues por épica
export const useIssuesByEpic = (epicId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.epicIssues(epicId || ""),
    queryFn: async () => {
      if (!epicId) return [];
      try {
        console.log("Fetching issues for epic:", epicId);
        const response = await apiClient.get(`/issues/by-epic/${epicId}`);
        return response.data || [];
      } catch (error) {
        console.error("Error fetching epic issues:", error);
        return [];
      }
    },
    enabled: Boolean(epicId),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Obtener épicas por product backlog
export const useEpicsByProductBacklog = (productBacklogId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.epics(productBacklogId || ""),
    queryFn: async () => {
      if (!productBacklogId) {
        console.log("useEpicsByProductBacklog: No productBacklogId provided");
        return [];
      }
      try {
        console.log("Fetching epics for product backlog:", productBacklogId);
        const response = await apiClient.get(`/epics/get-by-backlog/${productBacklogId}`);
        const epics = response.data || [];
        console.log(`Found ${epics.length} epics for backlog ${productBacklogId}:`, epics.map((epic: any) => ({
          id: epic.id,
          name: epic.name || epic.title,
          status: epic.status
        })));
        return epics;
      } catch (error: any) {
        console.error("Error fetching epics for backlog", productBacklogId, ":", error);
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        throw error; // Re-throw to let React Query handle the error
      }
    },
    enabled: Boolean(productBacklogId),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 