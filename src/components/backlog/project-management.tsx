import { useContext, useEffect, useState, useMemo } from "react"
import { Tabs } from "@/components/ui/tabs"
import { useLocation, useParams } from "react-router-dom"
import { Projects } from "@/interfaces/projects.interface"
import { apiClient } from "@/api/client-gateway"
import { Task } from "@/interfaces/task.interface"
import { Epic } from "@/interfaces/epic.interface"
import { SprintSection } from "./sprint-section"
import { BacklogSection } from "./backlog-section"
import { EpicDialog } from "./epic-dialog"
import { AuthContext } from "@/context/AuthContext"
import { InviteMembersDialog } from "./invite-members-dialog"
import { useTeams } from "@/context/TeamsContext"
import { EditTaskModal } from "./edit-task-modal"
import { EditSprintModal } from "./edit-sprint-modal"
import { CreateSprintModal } from "./create-sprint-modal"
import { ProjectHeader } from "./project-header"
import { SearchFilters } from "./search-filters"
import { useUpdateIssue, invalidateProjectIssues, useCreateIssue } from "@/api/queries"
import { useQueryClient } from "@tanstack/react-query"
import { EpicIssuesDialog } from "./epic-issues-dialog"
import { notifications } from "@mantine/notifications"
import { Sprint } from "@/interfaces/sprint.interface"
import { AssignedUser } from "@/interfaces/assigned-user.interface"



export default function ProjectManagement() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
  const [allBacklogTasks, setAllBacklogTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { project_id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState<Projects | null>(null);
  const [newUserStoryTitle, setNewUserStoryTitle] = useState("")
  const [newUserStoryType, setNewUserStoryType] = useState<'bug' | 'feature' | 'task' | 'refactor' | 'user_story'>('user_story');
  const [newUserStoryPriority, setNewUserStoryPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [backlogId, setBacklogId] = useState<string | null>(null);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  // Epic state
  const [epics, setEpics] = useState<Epic[]>([]);
  const [isEpicDialogOpen, setIsEpicDialogOpen] = useState(false);
  const [newUserStoryEpic, setNewUserStoryEpic] = useState<Epic | null>(null);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [isEpicIssuesDialogOpen, setIsEpicIssuesDialogOpen] = useState(false);
  const [epicIssues, setEpicIssues] = useState<Task[]>([]);

  const { user } = useContext(AuthContext);
  const { teams } = useTeams();
  
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    "sprint-1": true,
    backlog: true,
  })

  // Create sprint state
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false)

  // Edit task state
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingSprintId, setEditingSprintId] = useState<string | null>(null)

  // Edit sprint state
  const [isEditSprintOpen, setIsEditSprintOpen] = useState(false)
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null)

  // Add the queryClient hook
  const queryClient = useQueryClient();

  // Add the mutation hook
  const { mutate: updateIssue } = useUpdateIssue();
  const createIssue = useCreateIssue();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCreateSprint = async (sprintData: {
    name: string;
    goal: string;
  }) => {
    try {
      if (!project_id) {
        notifications.show({
          title: "Error",
          message: "No se encontró el ID del proyecto",
          color: "red"
        });
        return;
      }

      const newSprintData = {
        name: sprintData.name,
        goal: sprintData.goal || "",
        projectId: project_id
      };

      const response = await apiClient.post(`/sprints/create`, newSprintData);
      console.log("Sprint created:", response.data);
      
      if (response.data) {
        const newSprint: Sprint = {
          id: response.data.id,
          name: response.data.name,
          goal: response.data.goal || "",
          isFinished: response.data.isFinished,
          isStarted: response.data.isStarted,
          startedAt: response.data.startedAt ? new Date(response.data.startedAt) : null,
          fnishedAt: response.data.fnishedAt ? new Date(response.data.fnishedAt) : null,
          project: response.data.project,
          issues: [],
          status: response.data.status || 'inactive'
        };

        setSprints(prevSprints => [...prevSprints, newSprint]);
        setExpandedSections(prev => ({
          ...prev,
          [newSprint.id]: true,
        }));

        notifications.show({
          title: "Sprint creado",
          message: `Se ha creado el sprint "${newSprint.name}" exitosamente.`,
          color: "green"
        });
      }
    } catch (error: any) {
      console.error("Error creating sprint:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "No se pudo crear el sprint",
        color: "red"
      });
    }
  };

  const fetchBacklogId = async () => {
    console.log("Fetching backlog ID for project:", project_id);
    try {
      const response = await apiClient.get(`/backlog/get-backlog-by-project/${project_id}`);
      console.log("Backlog ID response:", response.data);
      if (response.data && response.data.id) {
        console.log("Backlog ID fetched successfully:", response.data.id);
        setBacklogId(response.data.id);
        return response.data.id;
      } else {
        console.error("No backlog ID found in response:", response.data);
        notifications.show({
          title: "Error",
          message: "No se pudo obtener el ID del backlog",
          color: "red"
        });
        return null;
      }
    } catch (error) {
      console.error("Error fetching backlog ID:", error);
      notifications.show({
        title: "Error",
        message: "No se pudo obtener el ID del backlog",
        color: "red"
      });
      return null;
    }
  };



  //TODO: Mover a queries
  const fetchBacklogTasks = async () => {
    console.log("Fetching backlog tasks with backlogId:", backlogId);
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/backlog/get-all-issues/${backlogId}`);
      console.log("Backlog tasks response:", response.data);
        
      console.log("Tasks mapped successfully");
      setBacklogTasks(response.data);
      setAllBacklogTasks(response.data);
    } catch (error) {
      console.error("Error fetching backlog tasks:", error);
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar las tareas del backlog",
        color: "red"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSprints = async () => {
    console.log("Fetching sprints for project:", project_id);
    try {
      if (!project_id) {
        console.error("No project ID available");
        return;
      }

      // Obtener los sprints del proyecto
      const response = await apiClient.get(`/sprints/get-sprints-by-project/${project_id}`);
      console.log("Sprints response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const mappedSprints = response.data.map((sprint: any) => ({
          ...sprint,
          startedAt: sprint.startedAt ? new Date(sprint.startedAt) : null,
          fnishedAt: sprint.fnishedAt ? new Date(sprint.fnishedAt) : null,
          issues: sprint.issues || []
        }));
        
        console.log("Sprints mapped successfully:", mappedSprints.length, "sprints found");
        setSprints(mappedSprints);
      } else {
        console.log("No sprints found");
        setSprints([]);
      }
    } catch (error) {
      console.error("Error fetching sprints:", error);
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar los sprints",
        color: "red"
      });
      setSprints([]);
    }
  };

  const fetchEpics = async () => {
    console.log("Fetching epics for project:", project_id);
    try {
      const response = await apiClient.get(`/epics/get-by-backlog/${backlogId}`);
      console.log("Epics response:", response.data);
      
      if (response.data) {
        console.log("Epics fetched successfully:", response.data.length, "epics found");
        setEpics(response.data);
      } else {
        console.log("No epics found");
        setEpics([]);
      }
    } catch (error) {
      console.error("Error fetching epics:", error);
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar las épicas",
        color: "red"
      });
      setEpics([]);
    }
  };

  const fetchProjectMembers = async () => {
      await apiClient.get(`/projects/members/${project_id}`)
      .then((response) => {
        setProjectMembers(response.data.users);
      })
      .catch((error) => {
        notifications.show({
          title: "Error",
          message: `Error fetching project members: ${error}`,
          color: "red"
        })
      })
      .finally(() => {
        setLoadingMembers(false);
      })
};

  useEffect(() => {
    fetchBacklogId();
    fetchProjectMembers();
  }, []);

  useEffect(() => {
    if (backlogId !== null) {
      fetchBacklogTasks();
      fetchEpics();
      fetchSprints();
    }
  }, [backlogId]);

  // Efecto para manejar el proyecto desde location.state
  useEffect(() => {
    const project = location.state?.project;
    if (project) {
      setProject(project);
    }
  }, [location.state]);

  // Efecto para actualizar miembros cuando se abre el diálogo
  useEffect(() => {
    if (isMembersDialogOpen) {
      fetchProjectMembers();
    }
  }, [isMembersDialogOpen]);

  const handleStartSprint = (sprintId: string) => {
    return apiClient.post(`/sprints/start-sprint?sprintId=${sprintId}`)
      .then((response) => {
        if (response.data) {
          // Ensure issues is an array
          const responseWithIssues = {
            ...response.data,
            issues: response.data.issues || []
          };
          
          setSprints(prevSprints => prevSprints.map(sprint => 
            sprint.id === sprintId ? responseWithIssues : sprint
          ));

          notifications.show({
            title: "Sprint iniciado",
            message: "El sprint ha sido iniciado exitosamente.",
            color: "green"
          });
        }
      })
      .catch((error) => {
        console.error("Error starting sprint:", error);
        notifications.show({
          title: "Error",
          message: error.response?.data?.message || "No se pudo iniciar el sprint",
          color: "red"
        });
        throw error;
      });
  };

  const handleCompleteSprint = (sprintId: string) => {
    return apiClient.post(`/sprints/complete-sprint?sprintId=${sprintId}`)
      .then((response) => {
        if (response.data) {
          const currentSprint = sprints.find(sprint => sprint.id === sprintId);
          if (!currentSprint) return;

          // Remove the completed sprint first
          setSprints(prevSprints => prevSprints.filter(s => s.id !== sprintId));
          
          // Then fetch the updated sprints list to get the new sprint with the moved tasks
          fetchSprints();
          
          notifications.show({
            title: "Sprint completado",
            message: "Se ha completado el sprint y las tareas pendientes se han movido al nuevo sprint.",
            color: "green"
          });
        }
      })
      .catch((error) => {
        console.error("Error completing sprint:", error);
        notifications.show({
          title: "Error",
          message: error.response?.data?.message || "No se pudo completar el sprint",
          color: "red"
        });
        throw error;
      });
  };

  const handleDeleteSprint = () => {
    notifications.show({
      title: "Funcionalidad no disponible",
      message: "Esta funcionalidad será implementada próximamente.",
      color: "blue"
    });
  };

  const openEditTaskModal = (task: Task, sprintId: string | null = null) => {
    setEditingTask(task);
    setEditingSprintId(sprintId);
    setIsEditTaskOpen(true);
  };

  const handleSaveTaskEdit = async (updatedTask: Partial<Task>) => {
    console.log("Saving task edit:", updatedTask);
    if (!editingTask) return;

    try {
      const taskData = {
        id: editingTask.id,
        title: updatedTask.title || editingTask.title,
        description: updatedTask.description || editingTask.description,
        priority: updatedTask.priority || editingTask.priority,
        status: updatedTask.status || editingTask.status,
        assignedTo: updatedTask.assignedTo || user?.id,
        type: updatedTask.type || editingTask.type,
        acceptanceCriteria: editingTask.acceptanceCriteria || "",
        story_points: null as number | null, 
        epicId: updatedTask.epic?.id,
      };

      if (updatedTask.storyPoints && updatedTask.storyPoints > 0) {
        taskData.story_points = updatedTask.storyPoints;
      }

      const optimisticTask: Task = {
        ...editingTask,
        ...taskData,
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority,
        status: taskData.status,
        type: taskData.type,
        epic: updatedTask.epic,
      };

      if (editingSprintId) {
        setSprints(sprints.map(sprint =>
          sprint.id === editingSprintId
            ? {
                ...sprint,
                issues: sprint.issues.map((issue) =>
                  issue.id === editingTask.id ? optimisticTask : issue
                ),
              }
            : sprint
        ));
      } else {
        setBacklogTasks(backlogTasks.map(task =>
          task.id === editingTask.id ? optimisticTask : task
        ));
        setAllBacklogTasks(prev => prev.map(task =>
          task.id === editingTask.id ? optimisticTask : task
        ));
      }

      console.log("Sending task update to API:", taskData);
      updateIssue(taskData, {
        onSuccess: (data) => {
          console.log("API response data:", data);
          notifications.show({
            title: "Cambios guardados",
            message: "Los cambios han sido guardados exitosamente.",
            color: "green"
          });

          const taskModified: Task = {
            ...data,
            storyPoints: taskData.story_points,
            epic: updatedTask.epic,
            title: data.title || editingTask.title,
            description: data.description || editingTask.description,
            priority: data.priority || editingTask.priority,
            status: data.status || editingTask.status,
            type: data.type || editingTask.type,
          };

          if (editingSprintId) {
            setSprints(sprints.map(sprint =>
              sprint.id === editingSprintId
                ? {
                    ...sprint,
                    issues: sprint.issues.map((issue) =>
                      issue.id === editingTask.id ? taskModified : issue
                    ),
                  }
                : sprint
            ));
          } else {
            setBacklogTasks(backlogTasks.map(task =>
              task.id === editingTask.id ? taskModified : task
            ));
          }
        },
        onError: (error) => {
          console.error("Error updating task:", error);
          
          if (editingSprintId) {
            setSprints(sprints.map(sprint =>
              sprint.id === editingSprintId
                ? {
                    ...sprint,
                    issues: sprint.issues.map((issue) =>
                      issue.id === editingTask.id ? editingTask : issue
                    ),
                  }
                : sprint
            ));
          } else {
            setBacklogTasks(backlogTasks.map(task =>
              task.id === editingTask.id ? editingTask : task
            ));
          }

          notifications.show({
            title: "Error",
            message: "No se pudo actualizar la tarea. Inténtalo de nuevo.",
            color: "red"
          });
        }
      });
    } catch (error) {
      console.error("Unexpected error in handleSaveTaskEdit:", error);
      notifications.show({
        title: "Error inesperado",
        message: "Ocurrió un error al procesar la solicitud",
        color: "red"
      });
    }
  };

  const handleSaveSprintEdit = (updatedSprint: Sprint) => {
    setSprints(sprints.map((s) => (s.id === updatedSprint.id ? updatedSprint : s)))

    notifications.show({
      title: "Sprint actualizado",
      message: `El sprint "${updatedSprint.name}" ha sido actualizado exitosamente.`,
      color: "green"
    });
  }

  const handleToggleBacklogTaskCompletion = (taskId: string) => {
    setBacklogTasks(
      backlogTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "to-do" || task.status === "in-progress" ? "done" : "to-do",
            } as Task
          : task
      )
    );
    const taskDetails = backlogTasks.find(t => t.id === taskId);
    if (taskDetails) {
      notifications.show({
        title: "Tarea de Backlog actualizada",
        message: `El estado de "${taskDetails.title}" ha sido actualizado.`,
        color: "green"
      });
    }
  };

  const toggleTaskCompletion = (sprintId: string, taskId: string) => {
    setSprints(
      sprints.map((sprint) =>
        sprint.id === sprintId
          ? {
              ...sprint,
              issues: Array.isArray(sprint.issues)
                ? sprint.issues.map((task: Task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          status: task.status === "to-do" || task.status === "in-progress" ? "done" : "to-do",
                        } as Task
                      : task
                  )
                : []
            }
          : sprint
      )
    );
    const currentSprint = sprints.find(s => s.id === sprintId);
    const sprintIssues = currentSprint && Array.isArray(currentSprint.issues) ? currentSprint.issues : [];
    const taskDetails = sprintIssues.find((t: Task) => t.id === taskId);
    if (taskDetails) {
      notifications.show({
        title: "Tarea actualizada",
        message: `El estado de "${taskDetails.title}" ha sido actualizado.`,
        color: "green"
      });
    }
  };

  const moveTaskToSprint = async (taskId: string, targetSprintId: string) => {
    const taskToMove = backlogTasks.find((task) => task.id === taskId);
    if (!taskToMove) return;

    const taskCopy = { ...taskToMove };
    
    try {
      setBacklogTasks(prev => prev.filter(task => task.id !== taskId));
      setAllBacklogTasks(prev => prev.filter(task => task.id !== taskId));
      
      try {
        const response = await apiClient.post(`/backlog/move-issue-to-sprint?issueId=${taskId}&sprintId=${targetSprintId}`);

        if (response.data) {
          const movedTask = {
            ...taskToMove,
            ...response.data,
            productBacklogId: response.data.productBacklogId || backlogId,
            storyPoints: response.data.story_points || taskToMove.storyPoints || 0,
            status: response.data.status || taskToMove.status,
            type: response.data.type || taskToMove.type,
            priority: response.data.priority || taskToMove.priority,
            assignedTo: response.data.assignedTo || taskToMove.assignedTo,
            createdBy: response.data.createdBy || taskToMove.createdBy,
            acceptanceCriteria: response.data.acceptanceCriteria || taskToMove.acceptanceCriteria || "",
            epic: response.data.epic || taskToMove.epic
          };

          setSprints(prevSprints => 
            prevSprints.map(sprint => 
              sprint.id === targetSprintId 
                ? { 
                    ...sprint, 
                    issues: Array.isArray(sprint.issues) ? [...sprint.issues, movedTask] : [movedTask]
                  } 
                : sprint
            )
          );
        
          notifications.show({
            title: "Tarea movida",
            message: `La historia "${taskToMove.title}" ha sido movida al sprint.`,
            color: "green"
          });
        }
      } catch (error: any) {
        console.error("Error moving task to sprint:", error);
        
        setBacklogTasks(prev => [...prev, taskCopy]);
        setAllBacklogTasks(prev => [...prev, taskCopy]);
        
        if (error.response?.status === 404) {
          notifications.show({
            title: "Error al mover tarea",
            message: "No se encontró el sprint o la tarea. Verifica que ambos existan.",
            color: "red"
          });
        } else {
          notifications.show({
            title: "Error",
            message: "No se pudo mover la tarea al sprint. Inténtalo de nuevo más tarde.",
            color: "red"
          });
        }
      }
    } catch (error) {
      console.error("Unexpected error in moveTaskToSprint:", error);
      notifications.show({
        title: "Error inesperado",
        message: "Ocurrió un error al procesar la solicitud",
        color: "red"
      });
    }
  };

  const moveTaskToBacklog = async (sprintId: string, taskId: string) => {
    try {
      const sprint = sprints.find(s => s.id === sprintId);
      if (!sprint) {
        console.error("Sprint not found:", sprintId);
        return;
      }
      
      // Ensure sprint.issues is an array
      const sprintIssues = Array.isArray(sprint.issues) ? sprint.issues : [];
      const taskToMove = sprintIssues.find((task: Task) => task.id === taskId);
      
      if (!taskToMove) {
        console.error("Task not found in sprint:", taskId);
        return;
      }
      
      const taskCopy = { ...taskToMove };
      
      setSprints(prevSprints => prevSprints.map(sprint =>
        sprint.id === sprintId
          ? { 
              ...sprint, 
              issues: Array.isArray(sprint.issues) 
                ? sprint.issues.filter((task: Task) => task.id !== taskId) 
                : [] 
            }
          : sprint
      ));
      
      try {
        const response = await apiClient.post(`/backlog/move-issue-to-backlog`, {
          taskId,
          sprintId,
        });

        if (response.data) {
          const movedTask = {
            ...taskToMove,
            ...response.data,
            productBacklogId: response.data.productBacklogId || backlogId,
            storyPoints: response.data.story_points || taskToMove.storyPoints || 0,
            status: response.data.status || taskToMove.status,
            type: response.data.type || taskToMove.type,
            priority: response.data.priority || taskToMove.priority,
            assignedTo: response.data.assignedTo || taskToMove.assignedTo,
            createdBy: response.data.createdBy || taskToMove.createdBy,
            acceptanceCriteria: response.data.acceptanceCriteria || taskToMove.acceptanceCriteria || "",
            epic: response.data.epic || taskToMove.epic
          };

          setBacklogTasks(prev => [...prev, movedTask]);
          setAllBacklogTasks(prev => [...prev, movedTask]);
        
          notifications.show({
            title: "Tarea movida",
            message: `La historia "${taskToMove.title}" ha sido movida al backlog.`,
            color: "green"
          });
        }
      } catch (error: any) {
        console.error("Error moving task to backlog:", error);
        
        setSprints(prevSprints => prevSprints.map(s => 
          s.id === sprintId 
            ? { 
                ...s, 
                issues: Array.isArray(s.issues)
                  ? [...s.issues.filter((t: Task) => t.id !== taskId), taskCopy]
                  : [taskCopy]
              }
            : s
        ));
        
        if (error.response?.status === 404) {
          notifications.show({
            title: "Error al mover tarea",
            message: "No se encontró el sprint o la tarea en el servidor. Verifica que ambos existan.",
            color: "red"
          });
        } else {
          notifications.show({
            title: "Error",
            message: "No se pudo mover la tarea al backlog. Inténtalo de nuevo más tarde.",
            color: "red"
          });
        }
      }
    } catch (error) {
      console.error("Unexpected error in moveTaskToBacklog:", error);
      notifications.show({
        title: "Error inesperado",
        message: "Ocurrió un error al procesar la solicitud",
        color: "red"
      });
    }
  };

  const getAssignedUser = (userId?: string): AssignedUser | null => {
    if (!userId) return null;
    
    const projectMember = projectMembers.find((member) => member.userId === userId);

    if (projectMember) {
      const initials = `${projectMember.name?.charAt(0) || ''}${projectMember.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
      return { 
        initials,
        name: projectMember.name || '',
        lastName: projectMember.lastName || ''
      };
    }
    
    return { initials: 'U', name: 'Usuario', lastName: '' };
  }

  const handleSprintTaskStatusChange = async (sprintId: string, taskId: string, status: Task["status"]) => {
    console.log("Starting status change for task:", taskId, "to status:", status);
    
    try {
      const sprint = sprints.find((s) => s.id === sprintId);
      if (!sprint) {
        console.error("Sprint not found:", sprintId);
        return;
      }
      
      // Ensure sprint.issues is an array
      const sprintIssues = Array.isArray(sprint.issues) ? sprint.issues : [];
      const task = sprintIssues.find((t) => t.id === taskId);
      if (!task) {
        console.error("Task not found in sprint:", taskId);
        return;
      }
      
      const previousStatus = task.status;
      
      setSprints(prevSprints => prevSprints.map(s => 
        s.id === sprintId 
          ? {
              ...s,
              issues: Array.isArray(s.issues) 
                ? s.issues.map(t => 
                    t.id === taskId 
                      ? { ...t, status } 
                      : t
                  )
                : []
            }
          : s
      ));
      
      updateIssue(
        {
          id: taskId,
          status,
          projectId: project_id
        },
        {
          onSuccess: (data) => {
            console.log("Status update successful:", data);
            notifications.show({
              title: "Estado actualizado",
              message: `El estado de "${task.title}" ha sido actualizado a ${status}.`,
              color: "green"
            });

            if (project_id) {
              invalidateProjectIssues(queryClient, project_id);
            }
          },
          onError: (error: any) => {
            console.error("Error in mutation onError callback:", error);
            
            setSprints(prevSprints => prevSprints.map(s => 
              s.id === sprintId 
                ? {
                    ...s,
                    issues: Array.isArray(s.issues)
                      ? s.issues.map(t => 
                          t.id === taskId 
                            ? { ...t, status: previousStatus } 
                            : t
                        )
                      : []
                  }
                : s
            ));
            
            if (!error.response || error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
              notifications.show({
                title: "Error de conexión",
                message: "No se pudo conectar con el servidor. El servicio de proyectos no está disponible.",
                color: "red"
              });
            } else if (error.response?.status === 404) {
              notifications.show({
                title: "Error",
                message: "No se encontró la tarea en el servidor",
                color: "red"
              });
            } else if (error.response?.status === 500) {
              notifications.show({
                title: "Error del servidor",
                message: "El servidor no pudo procesar la solicitud",
                color: "red"
              });
            } else {
              notifications.show({
                title: "Error",
                message: "No se pudo actualizar el estado de la tarea",
                color: "red"
              });
            }
          }
        }
      );
    } catch (error: any) {
      console.error("Unexpected error in handleSprintTaskStatusChange:", error);
      notifications.show({
        title: "Error inesperado",
        message: "Ocurrió un error al actualizar el estado. Por favor, intenta de nuevo.",
        color: "red"
      });
    }
  };

  /**
   * Actualiza el estado de una tarea en el backlog
   * @param taskId ID de la tarea a actualizar
   * @param status Nuevo estado
   */
  const handleBacklogTaskStatusChange = async (taskId: string, status: Task["status"]) => {
    console.log("Starting status change for task:", taskId, "to status:", status);
    
    try {
      const task = backlogTasks.find((t: Task) => t.id === taskId);
      if (!task) {
        console.error("Task not found in backlog:", taskId);
        notifications.show({
          title: "Error",
          message: "No se encontró la tarea en el backlog",
          color: "red"
        });
        return;
      }
      
      const previousStatus = task.status;
      console.log("Previous status:", previousStatus);
      
      const updatedTask = { ...task, status } as Task;
      setBacklogTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      setAllBacklogTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      console.log("Attempting to update task status via mutation...");
      
      updateIssue(
        {
          id: taskId,
          status,
          projectId: project_id
        },
        {
          onSuccess: (data) => {
            console.log("Status update successful:", data);
            notifications.show({
              title: "Estado actualizado",
              message: `El estado de "${task.title}" ha sido actualizado a ${status}.`,
              color: "green"
            });
          },
          onError: (error: any) => {
            console.error("Error in mutation onError callback:", error);
            
            console.log("Rolling back to previous status:", previousStatus);
            setBacklogTasks(prev => prev.map(t => 
              t.id === taskId ? { ...t, status: previousStatus } as Task : t
            ));
            setAllBacklogTasks(prev => prev.map(t => 
              t.id === taskId ? { ...t, status: previousStatus } as Task : t
            ));
            
            if (!error.response || error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
              console.error("Network error detected");
              notifications.show({
                title: "Error de conexión",
                message: "No se pudo conectar con el servidor. El servicio de proyectos no está disponible.",
                color: "red"
              });
            } else if (error.response?.status === 404) {
              console.error("404 error detected");
              notifications.show({
              title: "Error",
                message: "No se encontró la tarea en el servidor",
                color: "red"
              });
            } else if (error.response?.status === 500) {
              console.error("500 error detected");
              notifications.show({
                title: "Error del servidor",
                message: "El servidor no pudo procesar la solicitud",
                color: "red"
              });
            } else {
              console.error("Unknown error:", error);
              notifications.show({
          title: "Error",
                message: "No se pudo actualizar el estado de la tarea",
                color: "red"
              });
            }
          }
        }
      );
    } catch (error: any) {
      console.error("Unexpected error in handleBacklogTaskStatusChange:", error);
      
      const task = backlogTasks.find((t: Task) => t.id === taskId);
      if (task) {
        console.log("Attempting to restore previous state after error");
        setBacklogTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, status: task.status } as Task : t
        ));
        setAllBacklogTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, status: task.status } as Task : t
        ));
      }
      
      notifications.show({
        title: "Error inesperado",
        message: "Ocurrió un error al actualizar el estado. Por favor, intenta de nuevo.",
        color: "red"
      });
    }
  };

  const handleDeleteTaskSprint = async (taskId: string, sprintId: string) => {
    const sprint = sprints.find(sprint => sprint.id === sprintId);
    if (!sprint) {
      console.error("Sprint not found:", sprintId);
      return;
    }
    
    // Ensure sprint.issues is an array
    const sprintIssues = Array.isArray(sprint.issues) ? sprint.issues : [];
    const taskToDelete = sprintIssues.find(issue => issue.id === taskId);
    if (!taskToDelete) {
      console.error("Task not found:", taskId);
      return;
    }

    setSprints(prevSprints => prevSprints.map(s => 
      s.id === sprintId
        ? {
            ...s, 
            issues: Array.isArray(s.issues) ? s.issues.filter(issue => issue.id !== taskId) : []
          }
        : s
    ));

    await apiClient.delete(`/issues/delete/${taskId}`)
      .then(response => {
        notifications.show({
          title: "Tarea eliminada",
          message: response.data.message,
          color: "green"
        });
      })
      .catch(error => {
        console.error("Error deleting task:", error);
        notifications.show({
          title: "Error",
          message: "No se pudo eliminar la tarea. Inténtalo de nuevo más tarde.",
          color: "red"
        });
        
        setSprints(prevSprints => prevSprints.map(s => 
          s.id === sprintId
            ? {
                ...s, 
                issues: Array.isArray(s.issues) ? [...s.issues, taskToDelete] : [taskToDelete]
              }
            : s
        ));
      });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const taskToDelete = backlogTasks.find(task => task.id === taskId);
      
      if (!taskToDelete) {
        console.error("Task not found:", taskId);
        return;
      }
      
      setBacklogTasks(prev => prev.filter(task => task.id !== taskId));
      setAllBacklogTasks(prev => prev.filter(task => task.id !== taskId));
      
      try {
        await apiClient.delete(`/issues/delete/${taskId}`);
        
        notifications.show({
          title: "Tarea eliminada",
          message: `La tarea "${taskToDelete.title}" ha sido eliminada exitosamente.`,
          color: "green"
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        
        setBacklogTasks(prev => [...prev, taskToDelete]);
        setAllBacklogTasks(prev => [...prev, taskToDelete]);
        
        notifications.show({
          title: "Error",
          message: "No se pudo eliminar la tarea. Inténtalo de nuevo más tarde.",
          color: "red"
        });
      }
    } catch (error) {
      console.error("Unexpected error in handleDeleteTask:", error);
      notifications.show({
        title: "Error inesperado",
        message: "Ocurrió un error al procesar la solicitud",
        color: "red"
      });
    }
  };

  const refetchProjectMembers = async () => {
    await fetchProjectMembers();
  };

  const currentTeam = useMemo(() => {
    if (!project || !teams) return null;
    return teams.find(team => team.id === project.team_id);
  }, [project, teams]);
  
  const handleEpicSelect = async (epicId: string) => {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;

    setSelectedEpic(epic);
    setIsEpicIssuesDialogOpen(true);

    try {
      const response = await apiClient.get(`/issues/by-epic/${epicId}`);
      console.log("Epic issues:", response);
      if (response.data) {
        setEpicIssues(response.data);
      }
    } catch (error) {
      console.error("Error fetching epic issues:", error);
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar las tareas de la épica",
        color: "red"
      });
    }
  };

  const itemsPerPage = 15;

  const filteredAndPaginatedTasks = useMemo(() => {
    const filteredTasks = allBacklogTasks.filter(task => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.code?.toLowerCase().includes(searchLower)
      );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTasks.slice(startIndex, endIndex);
  }, [allBacklogTasks, searchTerm, currentPage]);

  const totalPages = useMemo(() => {
    const filteredTasks = allBacklogTasks.filter(task => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.code?.toLowerCase().includes(searchLower)
      );
    });
    return Math.ceil(filteredTasks.length / itemsPerPage);
  }, [allBacklogTasks, searchTerm]);

  const handleSearchChange = (term: string) => {
    console.log('Search term changed:', term);
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    console.log('Setting page to:', page);
    setCurrentPage(page);
  };

  const handleCreateUserStory = async () => {
    if (!newUserStoryTitle.trim()) {
      notifications.show({
        title: "Error",
        message: "El título de la historia de usuario no puede estar vacío.",
        color: "red"
      });
      return;
    }

    if (!backlogId) {
      notifications.show({
        title: "Error",
        message: "No se ha cargado el ID del backlog",
        color: "red"
      });
      return;
    }

    try {
      const newTask = {
        title: newUserStoryTitle,
        description: "descripcion de la historia de usuario",
        type: newUserStoryType,
        priority: newUserStoryPriority,
        createdBy: user?.id,
        acceptanceCriteria: "",
        productBacklogId: backlogId,
        assignedTo: user?.id,
        epicId: newUserStoryEpic?.id,
      };

      const response = await createIssue.mutateAsync(newTask);
      
      if (response) {
        const newIssue = {
          ...response,
          storyPoints: response.story_points || 0,
          epic: response.epic || newUserStoryEpic,
        };
        setBacklogTasks(prev => [...prev, newIssue]);
        setAllBacklogTasks(prev => [...prev, newIssue]);
      }
      
      setNewUserStoryTitle("");
      setNewUserStoryEpic(null);
      notifications.show({
        title: "Historia de usuario creada",
        message: `Se ha añadido "${newTask.title}" al backlog.`,
        color: "green"
      });
    } catch (error) {
      console.error("Error creating user story:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create user story",
        color: "red"
      });
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      {/* Header */}
      <ProjectHeader 
        project={project}
        projectMembers={projectMembers}
        loadingMembers={loadingMembers}
        onOpenMembersDialog={() => setIsMembersDialogOpen(true)}
      />

      {/* Navigation Tabs */}
      <Tabs defaultValue="backlog" className="w-full"></Tabs>

      {/* Search Bar */}
      <SearchFilters 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filteredResultsCount={backlogTasks.length}
        epics={epics}
        onOpenEpicDialog={() => setIsEpicDialogOpen(true)}
        onEpicSelect={handleEpicSelect}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Sprint Sections */}
        {sprints.map((sprint) => (
          <SprintSection
            key={sprint.id}
            sprint={sprint}
            isExpanded={expandedSections[sprint.id]}
            onToggleExpand={() => toggleSection(sprint.id)}
            onToggleTaskCompletion={(taskId) => toggleTaskCompletion(sprint.id, taskId)}
            onEditTask={(task) => openEditTaskModal(task, sprint.id)}
            onMoveTaskToBacklog={(taskId) => moveTaskToBacklog(sprint.id, taskId)}
            onStatusChange={handleSprintTaskStatusChange}
            onStartSprint={handleStartSprint}
            onCompleteSprint={handleCompleteSprint}
            onDeleteSprint={handleDeleteSprint}
            onEditSprint={(sprint: Sprint) => {
              setEditingSprint(sprint);
              setIsEditSprintOpen(true);
            }}
            getAssignedUser={getAssignedUser}
            onDeleteTask={handleDeleteTaskSprint}
          />
        ))}

        {/* Backlog Section */}
        <BacklogSection
          isExpanded={expandedSections["backlog"]}
          onToggleExpand={() => toggleSection("backlog")}
          tasks={filteredAndPaginatedTasks}
          totalTasks={allBacklogTasks.length}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onToggleTaskCompletion={handleToggleBacklogTaskCompletion}
          onEditTask={(task) => openEditTaskModal(task)}
          onMoveTaskToSprint={moveTaskToSprint}
          onStatusChange={handleBacklogTaskStatusChange}
          onCreateSprint={() => setIsCreateSprintOpen(true)}
          availableSprints={sprints.map(s => ({ id: s.id, name: s.name }))}
          newUserStoryTitle={newUserStoryTitle}
          onNewUserStoryTitleChange={setNewUserStoryTitle}
          newUserStoryType={newUserStoryType}
          onNewUserStoryTypeChange={setNewUserStoryType}
          newUserStoryPriority={newUserStoryPriority}
          onNewUserStoryPriorityChange={setNewUserStoryPriority}
          newUserStoryEpic={newUserStoryEpic}
          onNewUserStoryEpicChange={setNewUserStoryEpic}
          onCreateUserStory={handleCreateUserStory}
          getAssignedUser={getAssignedUser}
          onDeleteTask={handleDeleteTask}
          epics={epics}
          onOpenEpicDialog={() => setIsEpicDialogOpen(true)}
          searchTerm={searchTerm}
          isLoading={isLoading}
        />
      </div>

      {/* Modals */}
      <CreateSprintModal
        isOpen={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
        onCreateSprint={handleCreateSprint}
      />

      <EditTaskModal
        isOpen={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
        task={editingTask}
        onSave={handleSaveTaskEdit}
        projectMembers={projectMembers}
        loadingMembers={loadingMembers}
        epics={epics}
        onOpenEpicDialog={() => setIsEpicDialogOpen(true)}
      />

      <EditSprintModal
        isOpen={isEditSprintOpen}
        onOpenChange={setIsEditSprintOpen}
        sprint={editingSprint}
        onSave={handleSaveSprintEdit}
      />

      <EpicDialog
        open={isEpicDialogOpen}
        onOpenChange={setIsEpicDialogOpen}
        backlogId={backlogId || ""}
        onEpicCreated={(epic) => {
          setEpics([...epics, epic]);
        }}
        selectedEpicId={null}
      />

      <EpicIssuesDialog
        open={isEpicIssuesDialogOpen}
        onOpenChange={setIsEpicIssuesDialogOpen}
        epic={selectedEpic}
        issuesbyepic={epicIssues}
        onEditTask={(task) => openEditTaskModal(task)}
        onStatusChange={handleBacklogTaskStatusChange}
        getAssignedUser={getAssignedUser}
      />

      <InviteMembersDialog
        open={isMembersDialogOpen}
        onOpenChange={setIsMembersDialogOpen}
        project={project}
        projectMembers={projectMembers}
        refetchMembers={refetchProjectMembers}
        currentTeam={currentTeam}
      />
    </div>
  )
}

