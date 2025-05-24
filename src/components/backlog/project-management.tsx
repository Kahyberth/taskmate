import { useContext, useEffect, useState, useMemo } from "react"
import { Tabs } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
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

// Define sprint interface
interface Sprint {
  id: string;
  name: string;
  isActive: boolean;
  tasks: Task[];
  startDate?: Date;
  endDate?: Date;
  goal?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AssignedUser {
  initials: string;
  name: string;
  lastName: string;
}

export default function ProjectManagement() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
  const [allBacklogTasks, setAllBacklogTasks] = useState<Task[]>([]);
  const [totalBacklogTasks, setTotalBacklogTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { project_id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState<Projects | null>(null);
  const [newUserStoryTitle, setNewUserStoryTitle] = useState("")
  const [newUserStoryType, setNewUserStoryType] = useState<'bug' | 'feature' | 'task' | 'refactor' | 'user_story'>('user_story');
  const [newUserStoryPriority, setNewUserStoryPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [loading, setIsLoading] = useState<boolean> (false)
  const [error, setError] = useState<any> (null)
  const [backlogId, setBacklogId] = useState<string | null>(null);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  // Epic state
  const [epics, setEpics] = useState<Epic[]>([]);
  const [isEpicDialogOpen, setIsEpicDialogOpen] = useState(false);
  const [newUserStoryEpicId, setNewUserStoryEpicId] = useState<string | undefined>(undefined);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [isEpicIssuesDialogOpen, setIsEpicIssuesDialogOpen] = useState(false);
  const [epicIssues, setEpicIssues] = useState<Task[]>([]);

  const { user } = useContext(AuthContext);
  // Use the teams hook to access teams data
  const { teams, loading: loadingTeams } = useTeams();
  
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    "sprint-1": true,
    backlog: true,
  })

  // Create sprint state
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false)
  const [nextSprintNumber, setNextSprintNumber] = useState(2)

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
    startDate?: Date;
    endDate?: Date;
    goal: string;
  }) => {
    try {
      // Create a new sprint
      const newSprintData = {
        name: sprintData.name,
        projectId: project_id,
        startDate: sprintData.startDate ? sprintData.startDate.toISOString() : undefined,
        endDate: sprintData.endDate ? sprintData.endDate.toISOString() : undefined,
        goal: sprintData.goal || ""
      };

      // Llamar a la API para crear el sprint
      const response = await apiClient.post(`/backlog/create-sprint`, newSprintData);
      
      if (response.data) {
        const newSprint: Sprint = {
          id: response.data.id,
          name: response.data.name,
          isActive: false,
          tasks: [],
          startDate: sprintData.startDate,
          endDate: sprintData.endDate,
          goal: sprintData.goal
        };
        
        setSprints([...sprints, newSprint]);
        setNextSprintNumber(nextSprintNumber + 1);
        setExpandedSections((prev) => ({
          ...prev,
          [newSprint.id]: true,
        }));

        toast({
          title: "Sprint creado",
          description: `Se ha creado el sprint "${newSprint.name}" exitosamente.`,
        });
      }
    } catch (error) {
      console.error("Error creating sprint:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el sprint",
        variant: "destructive",
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
        toast({
          title: "Error",
          description: "No se pudo obtener el ID del backlog",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Error fetching backlog ID:", error);
      toast({
        title: "Error",
        description: "No se pudo obtener el ID del backlog",
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchBacklogTasks = async () => {
    console.log("Fetching backlog tasks with backlogId:", backlogId);
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get(`/projects/issues/${project_id}`);
      console.log("Backlog tasks response:", response.data);
      
      if (response.data) {
        const tasks = Array.isArray(response.data.issues) ? response.data.issues : [];
        console.log("Processing tasks:", tasks.length, "tasks found");
        
        const mappedTasks = tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          type: task.type || "user_story",
          status: task.status || "to-do",
          code: task.code || "",
          priority: task.priority || "medium",
          createdBy: task.createdBy || user?.id,
          acceptanceCriteria: task.acceptanceCriteria || "",
          productBacklogId: task.productBacklogId || backlogId,
          storyPoints: task.story_points || 0,
          assignedTo: task.assignedTo,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          doneAt: task.doneAt,
          finishedAt: task.finishedAt
        }));
        
        console.log("Tasks mapped successfully");
        setBacklogTasks(mappedTasks);
        setAllBacklogTasks(mappedTasks);
      }
    } catch (error) {
      console.error("Error fetching backlog tasks:", error);
      setError("Failed to fetch backlog tasks");
      toast({
        title: "Error",
        description: "No se pudieron cargar las tareas del backlog",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSprints = async () => {
    console.log("Fetching sprints for project:", project_id);
    try {
      const response = await apiClient.get(`/backlog/sprints/${project_id}`);
      console.log("Sprints response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const mappedSprints = response.data.map((sprint: any) => ({
          id: sprint.id,
          name: sprint.name,
          isActive: sprint.status === 'active',
          tasks: sprint.tasks ? sprint.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description || "",
            type: task.type || "user_story",
            status: task.status || "to-do",
            priority: task.priority || "medium",
            createdBy: task.createdBy || user?.id,
            acceptanceCriteria: task.acceptanceCriteria || "",
            productBacklogId: task.productBacklogId || backlogId,
            storyPoints: task.story_points || 0,
            assignedTo: task.assignedTo,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            doneAt: task.doneAt,
            finishedAt: task.finishedAt
          })) : [],
          startDate: sprint.startDate ? new Date(sprint.startDate) : undefined,
          endDate: sprint.endDate ? new Date(sprint.endDate) : undefined,
          goal: sprint.goal || "",
          createdAt: sprint.createdAt ? new Date(sprint.createdAt) : undefined,
          updatedAt: sprint.updatedAt ? new Date(sprint.updatedAt) : undefined
        }));
        
        console.log("Sprints mapped successfully:", mappedSprints.length, "sprints found");
        setSprints(mappedSprints);
        
        // Actualizar el número del próximo sprint
        if (mappedSprints.length > 0) {
          const sprintNumbers = mappedSprints
            .map((s: Sprint) => {
              const match = s.name.match(/Sprint\s+(\d+)/i);
              return match ? parseInt(match[1]) : 0;
            })
            .filter((n: number) => !isNaN(n));
            
          if (sprintNumbers.length > 0) {
            const maxNumber = Math.max(...sprintNumbers);
            setNextSprintNumber(maxNumber + 1);
            console.log("Next sprint number set to:", maxNumber + 1);
          }
        }
      } else {
        console.log("No sprints found");
        setSprints([]);
      }
    } catch (error) {
      console.error("Error fetching sprints:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los sprints",
        variant: "destructive",
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
      toast({
        title: "Error",
        description: "No se pudieron cargar las épicas",
        variant: "destructive",
      });
      setEpics([]);
    }
  };

  const fetchProjectMembers = async () => {
    console.log("Fetching project members for project:", project_id);
    try {
      setLoadingMembers(true);
      const response = await apiClient.get(`/projects/members/${project_id}`);
      console.log("Project members response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log("Project members fetched successfully:", response.data.length, "members found");
        setProjectMembers(response.data);
      } else {
        console.log("No project members found");
        setProjectMembers([]);
      }
    } catch (error) {
      console.error("Error fetching project members:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los miembros del proyecto",
        variant: "destructive",
      });
      setProjectMembers([]);
    } finally {
      setLoadingMembers(false);
    }
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
    setSprints(sprints.map((sprint) => (sprint.id === sprintId ? { ...sprint, isActive: true } : sprint)))

    toast({
      title: "Sprint iniciado",
      description: "El sprint ha sido iniciado exitosamente.",
    })
  }

  const handleCompleteSprint = (sprintId: string) => {
    // Find the current sprint
    const currentSprint = sprints.find((sprint) => sprint.id === sprintId);
    if (!currentSprint) return;

    // Filter tasks based on status
    const incompleteTasks = currentSprint.tasks.filter((task: Task) => 
      task.status !== "done" && task.status !== "closed"
    );

    if (incompleteTasks.length > 0) {
      const newSprintId = `sprint-${nextSprintNumber}`;
      const newSprint: Sprint = {
        id: newSprintId,
        name: `Tablero Sprint ${nextSprintNumber}`,
        isActive: false,
        tasks: incompleteTasks,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setSprints([...sprints.filter((s) => s.id !== sprintId), newSprint]);
      setNextSprintNumber(nextSprintNumber + 1);
      setExpandedSections((prev) => ({
        ...prev,
        [newSprintId]: true,
      }));

      toast({
        title: "Sprint completado",
        description: `Se han movido ${incompleteTasks.length} tareas incompletas a "${newSprint.name}".`,
      });
    } else {
      // If no incomplete tasks, just remove the current sprint
      setSprints(sprints.filter((s) => s.id !== sprintId));

      toast({
        title: "Sprint completado",
        description: "Todas las tareas fueron completadas exitosamente.",
      });
    }
  };

  const handleDeleteSprint = (sprintId: string) => {
    // Find the sprint to be deleted
    const sprintToDelete = sprints.find((sprint) => sprint.id === sprintId)
    if (!sprintToDelete) return

    // Remove the sprint
    setSprints(sprints.filter((s) => s.id !== sprintId))

    toast({
      title: "Sprint eliminado",
      description: `El sprint "${sprintToDelete.name}" ha sido eliminado exitosamente.`,
    })
  }

  const openEditTaskModal = (task: Task, sprintId: string | null = null) => {
    setEditingTask(task)
    setEditingSprintId(sprintId)
    setIsEditTaskOpen(true)
  }

  const handleSaveTaskEdit = async (updatedTask: Partial<Task>) => {
    console.log("Saving task edit:", updatedTask);
    if (!editingTask) return;

    try {
      // Preparar los datos de actualización según lo requerido por la API
      const taskData = {
        id: editingTask.id,
        userId: user?.id,
        title: updatedTask.title || editingTask.title,
        description: updatedTask.description || editingTask.description,
        priority: updatedTask.priority || editingTask.priority,
        status: updatedTask.status || editingTask.status,
        assignedTo: updatedTask.assignedTo,
        type: updatedTask.type || editingTask.type,
        acceptanceCriteria: editingTask.acceptanceCriteria || "",
        storyPoints: null as number | null, // Por defecto, sin estimar
        epicId: updatedTask.epicId,
      };

      // Solo incluir storyPoints si es mayor que 0
      if (updatedTask.storyPoints && updatedTask.storyPoints > 0) {
        taskData.storyPoints = updatedTask.storyPoints;
      }

      // Actualización optimista
      const optimisticTask: Task = {
        ...editingTask,
        ...taskData,
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority,
        status: taskData.status,
        type: taskData.type,
        epicId: updatedTask.epicId,
      };

      if (editingSprintId) {
        setSprints(sprints.map(sprint =>
          sprint.id === editingSprintId
            ? {
                ...sprint,
                tasks: sprint.tasks.map((task: Task) =>
                  task.id === editingTask.id ? optimisticTask : task
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

      // Usar el mutation hook para actualizar la tarea
      console.log("Sending task update to API:", taskData);
      updateIssue(taskData, {
        onSuccess: (data) => {
          console.log("API response data:", data);
          notifications.show({
            title: "Cambios guardados",
            message: "Los cambios han sido guardados exitosamente.",
            color: "green"
          });

          // Actualizar el estado con la respuesta del servidor
          const taskModified: Task = {
            ...data,
            storyPoints: taskData.storyPoints,
            epicId: updatedTask.epicId,
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
                    tasks: sprint.tasks.map((task: Task) =>
                      task.id === editingTask.id ? taskModified : task
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
          
          // Revertir cambios en caso de error
          if (editingSprintId) {
            setSprints(sprints.map(sprint =>
              sprint.id === editingSprintId
                ? {
                    ...sprint,
                    tasks: sprint.tasks.map((task: Task) =>
                      task.id === editingTask.id ? editingTask : task
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

  const openEditSprintModal = (sprint: Sprint) => {
    if (!sprint) return

    setEditingSprint(sprint)
    setIsEditSprintOpen(true)
  }

  const handleSaveSprintEdit = (updatedSprint: Sprint) => {
    setSprints(sprints.map((s) => (s.id === updatedSprint.id ? updatedSprint : s)))

    toast({
      title: "Sprint actualizado",
      description: `El sprint "${updatedSprint.name}" ha sido actualizado exitosamente.`,
    })
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
      toast({
        title: "Tarea de Backlog actualizada",
        description: `El estado de "${taskDetails.title}" ha sido actualizado.`,
      });
    }
  };

  const toggleTaskCompletion = (sprintId: string, taskId: string) => {
    setSprints(
      sprints.map((sprint) =>
        sprint.id === sprintId
          ? {
              ...sprint,
              tasks: sprint.tasks.map((task: Task) =>
                task.id === taskId
                  ? {
                      ...task,
                      status: task.status === "to-do" || task.status === "in-progress" ? "done" : "to-do",
                    } as Task
                  : task
              ),
            }
          : sprint
      )
    );
    const currentSprint = sprints.find(s => s.id === sprintId);
    const taskDetails = currentSprint?.tasks.find((t: Task) => t.id === taskId);
    if (taskDetails) {
      toast({
        title: "Tarea actualizada",
        description: `El estado de "${taskDetails.title}" ha sido actualizado.`,
      });
    }
  };

  const moveTaskToSprint = async (taskId: string, targetSprintId: string) => {
    // Find the task in the backlog
    const taskToMove = backlogTasks.find((task) => task.id === taskId);
    if (!taskToMove) return;

    const taskCopy = { ...taskToMove };
    
    try {
      // Optimistic update - remove from backlog immediately
      setBacklogTasks(prev => prev.filter(task => task.id !== taskId));
      
      try {
        const response = await apiClient.post(`/backlog/move-issue-to-sprint`, {
          taskId,
          sprintId: targetSprintId,
        });

        if (response.data) {
          // Asegurarse de que la tarea tenga todos los campos necesarios
         const movedTask = {
           ...taskToMove,
            ...response.data,
            // Asegurar que estos campos estén presentes
            productBacklogId: response.data.productBacklogId || backlogId,
            storyPoints: response.data.story_points || taskToMove.storyPoints || 0
         };

         // Update sprint tasks
         setSprints(sprints.map(sprint => 
           sprint.id === targetSprintId 
             ? { ...sprint, tasks: [...sprint.tasks, movedTask] } 
             : sprint
         ));
        
      toast({
        title: "Tarea movida",
        description: `La historia "${taskToMove.title}" ha sido movida al sprint.`,
        });
        }
      } catch (error: any) {
        console.error("Error moving task to sprint:", error);
        
        // Revert changes on error
        setBacklogTasks(prev => [...prev, taskCopy]);
        
        // Mostrar mensaje específico según el error
        if (error.response?.status === 404) {
          toast({
            title: "Error al mover tarea",
            description: "No se encontró el sprint o la tarea. Verifica que ambos existan.",
            variant: "destructive",
          });
        } else {
       toast({
         title: "Error",
         description: "No se pudo mover la tarea al sprint. Inténtalo de nuevo más tarde.",
         variant: "destructive",
       });
        }
      }
    } catch (error) {
      console.error("Unexpected error in moveTaskToSprint:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    }
  };

  const moveTaskToBacklog = async (sprintId: string, taskId: string) => {
    try {
      // Encontrar el sprint y la tarea antes de llamar a la API
      const sprint = sprints.find(s => s.id === sprintId);
      const taskToMove = sprint?.tasks.find((task: Task) => task.id === taskId);
      
      if (!sprint || !taskToMove) {
        console.error("Sprint or task not found:", sprintId, taskId);
        return;
      }
      
      const taskCopy = { ...taskToMove };
      
      // Optimistic update - remove from sprint immediately
      setSprints(sprints.map(sprint =>
        sprint.id === sprintId
          ? { ...sprint, tasks: sprint.tasks.filter((task: Task) => task.id !== taskId) }
          : sprint
      ));
      
      try {
        const response = await apiClient.post(`/backlog/move-issue-to-backlog`, {
          taskId,
          sprintId,
        });

        if (response.data) {
          // Asegurarse de que la tarea tenga todos los campos necesarios
         const movedTask = {
           ...taskToMove,
            ...response.data,
            // Asegurar que estos campos estén presentes
            productBacklogId: response.data.productBacklogId || backlogId,
            storyPoints: response.data.story_points || taskToMove.storyPoints || 0
         };

         // Add to backlog
         setBacklogTasks([...backlogTasks, movedTask]);
        
      toast({
        title: "Tarea movida",
        description: `La historia "${taskToMove.title}" ha sido movida al backlog.`,
        });
        }
      } catch (error: any) {
        console.error("Error moving task to backlog:", error);
        
        // Revert changes on error
        setSprints(sprints.map(s => 
          s.id === sprintId 
            ? { ...s, tasks: [...s.tasks.filter((t: Task) => t.id !== taskId), taskCopy] }
            : s
        ));
        
        // Mostrar mensaje específico según el error
        if (error.response?.status === 404) {
          toast({
            title: "Error al mover tarea",
            description: "No se encontró el sprint o la tarea en el servidor. Verifica que ambos existan.",
            variant: "destructive",
          });
        } else {
       toast({
         title: "Error",
         description: "No se pudo mover la tarea al backlog. Inténtalo de nuevo más tarde.",
         variant: "destructive",
       });
        }
      }
    } catch (error) {
      console.error("Unexpected error in moveTaskToBacklog:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'task':
        return 'bg-yellow-100 text-yellow-800';
      case 'refactor':
        return 'bg-purple-100 text-purple-800';
      case 'user_story':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
      case "closed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "to-do":
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case "to-do":
        return "POR HACER";
      case "in-progress":
        return "EN PROGRESO";
      case "done":
        return "COMPLETADO";
      case "closed":
        return "CERRADO";
      case "review":
        return "EN REVISIÓN";
      default:
        return "POR HACER";
    }
  }

  const getAssignedUser = (userId?: string): AssignedUser | null => {
    if (!userId) return null;
    
    // Buscar en los miembros del proyecto
    const projectMember = projectMembers.find((member: any) => member.user_id === userId);
    if (projectMember && projectMember.user) {
      return { 
        initials: projectMember.initials || 'U',
        name: projectMember.user.name,
        lastName: projectMember.user.lastName || ''
      };
    }
    
    return { initials: 'U', name: 'Usuario', lastName: '' };
  }

  // Funciones para actualizar el estado de tareas

  /**
   * Actualiza el estado de una tarea en un sprint
   * @param sprintId ID del sprint que contiene la tarea
   * @param taskId ID de la tarea a actualizar
   * @param status Nuevo estado
   */
  const handleSprintTaskStatusChange = async (sprintId: string, taskId: string, status: Task["status"]) => {
    try {
      // Encontrar el sprint y la tarea
      const sprint = sprints.find((s) => s.id === sprintId);
      if (!sprint) {
        console.error("Sprint not found:", sprintId);
        return;
      }
      
      const task = sprint.tasks.find((t) => t.id === taskId);
      if (!task) {
        console.error("Task not found in sprint:", taskId);
        return;
      }
      
      // Guardar el estado anterior para restaurarlo en caso de error
      const previousStatus = task.status;
      
      // Actualización optimista
      const updatedTask = { ...task, status } as Task;
      setSprints(
        sprints.map((s) =>
          s.id === sprintId
            ? {
                ...s,
                tasks: s.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
              }
            : s
        )
      );
      
      try {
        // Use the mutation hook instead of direct API call
        updateIssue({
          id: taskId,
          status,
          userId: user?.id,
          projectId: project_id // Needed for client-side cache invalidation, will be removed before API call
        }, {
          onSuccess: () => {
            toast({
              title: "Estado actualizado",
              description: `El estado de "${task.title}" ha sido actualizado a ${getStatusDisplayText(status).toLowerCase()}.`,
            });
            
            // Force refresh of project issues data with queryClient
            if (project_id) {
              invalidateProjectIssues(queryClient, project_id as string);
            }
          },
          onError: (error) => {
            console.error("Error updating task status:", error);
            
            // Restaurar el estado anterior
            setSprints(
              sprints.map((s) =>
                s.id === sprintId
                  ? {
                      ...s,
                      tasks: s.tasks.map((t) =>
                        t.id === taskId ? { ...t, status: previousStatus } as Task : t
                      ),
                    }
                  : s
              )
            );
            
            toast({
              title: "Error",
              description: "No se pudo actualizar el estado de la tarea",
              variant: "destructive",
            });
          }
        });
      } catch (error) {
        // Handle any unexpected errors in the mutation call itself
        console.error("Error in mutation call:", error);
        
        // Restaurar el estado anterior
        setSprints(
          sprints.map((s) =>
            s.id === sprintId
              ? {
                  ...s,
                  tasks: s.tasks.map((t) =>
                    t.id === taskId ? { ...t, status: previousStatus } as Task : t
                  ),
                }
              : s
          )
        );
        
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de la tarea",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error updating task status:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al actualizar el estado",
        variant: "destructive",
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
      // Encontrar la tarea en el backlog
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
      
      // Guardar el estado anterior para restaurarlo en caso de error
      const previousStatus = task.status;
      console.log("Previous status:", previousStatus);
      
      // Actualización optimista - actualizar UI inmediatamente
      const updatedTask = { ...task, status } as Task;
      setBacklogTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      setAllBacklogTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      console.log("Attempting to update task status via mutation...");
      
        // Use the mutation hook instead of direct API call
      updateIssue(
        {
          id: taskId,
          status,
          userId: user?.id,
          projectId: project_id
        },
        {
          onSuccess: (data) => {
            console.log("Status update successful:", data);
            notifications.show({
              title: "Estado actualizado",
              message: `El estado de "${task.title}" ha sido actualizado a ${getStatusDisplayText(status).toLowerCase()}.`,
              color: "green"
            });
          },
          onError: (error: any) => {
            console.error("Error in mutation onError callback:", error);
            
            // Restaurar el estado anterior
            console.log("Rolling back to previous status:", previousStatus);
            setBacklogTasks(prev => prev.map(t => 
              t.id === taskId ? { ...t, status: previousStatus } as Task : t
            ));
            setAllBacklogTasks(prev => prev.map(t => 
              t.id === taskId ? { ...t, status: previousStatus } as Task : t
            ));
            
            // Mostrar mensaje de error específico según el tipo de error
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
      
      // Intentar restaurar el estado anterior si es posible
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

  const handleDeleteTask = async (taskId: string) => {
    console.log("taskId", taskId);
    console.log("handleDeleteTask", taskId);
    console.log("backlogTasks", backlogTasks);
    try {
      // Find the task to show its title in the toast
      const taskToDelete = backlogTasks.find(task => task.id === taskId);
      
      if (!taskToDelete) {
        console.error("Task not found:", taskId);
        return;
      }
      
      // Optimistic update - remove from UI immediately
      setBacklogTasks(prev => prev.filter(task => task.id !== taskId));
      
      try {
        // Call API to delete the task
        await apiClient.delete(`/issues/delete/${taskId}`);
        
        toast({
          title: "Tarea eliminada",
          description: `La tarea "${taskToDelete.title}" ha sido eliminada exitosamente.`,
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        
        // Revert the UI change on error
        setBacklogTasks(prev => [...prev, taskToDelete]);
        
        toast({
          title: "Error",
          description: "No se pudo eliminar la tarea. Inténtalo de nuevo más tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error in handleDeleteTask:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    }
  };

  // Helper function to get epic by ID
  const getEpicById = (epicId?: string) => {
    if (!epicId) return null;
    return epics.find(epic => epic.id === epicId) || null;
  };

  // Function to refetch project members
  const refetchProjectMembers = async () => {
    await fetchProjectMembers();
  };

  // Restore the project-related useEffect that was accidentally removed
  // Find the team associated with the current project
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
      if (response.data) {
        setEpicIssues(response.data);
      }
    } catch (error) {
      console.error("Error fetching epic issues:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las tareas de la épica",
        variant: "destructive",
      });
    }
  };

  const itemsPerPage = 15;

  // Calcular las tareas filtradas y paginadas
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

  // Calcular el total de páginas
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
    setCurrentPage(1); // Reset a la primera página cuando cambia la búsqueda
  };

  const handlePageChange = (page: number) => {
    console.log('Setting page to:', page);
    setCurrentPage(page);
  };

  const handleCreateUserStory = async () => {
    if (!newUserStoryTitle.trim()) {
      toast({
        title: "Error",
        description: "El título de la historia de usuario no puede estar vacío.",
        variant: "destructive",
      });
      return;
    }

    if (!backlogId) {
      toast({
        title: "Error",
        description: "No se ha cargado el ID del backlog",
        variant: "destructive",
      });
      return;
    }

    try {
      const newTask = {
        title: newUserStoryTitle,
        description: "descripcion de la historia de usuario",
        type: newUserStoryType,
        status: "to-do" as const,
        priority: newUserStoryPriority,
        createdBy: user?.id,
        acceptanceCriteria: "",
        productBacklogId: backlogId,
        epicId: newUserStoryEpicId,
      };

      const response = await createIssue.mutateAsync(newTask);
      
      // Actualizar el estado local con el nuevo issue
      if (response) {
        const newIssue = {
          ...response,
          storyPoints: response.story_points || 0, // Asegurarnos de que storyPoints esté presente
        };
        setBacklogTasks(prev => [...prev, newIssue]);
        setAllBacklogTasks(prev => [...prev, newIssue]);
      }
      
      setNewUserStoryTitle("");
      setNewUserStoryEpicId(undefined);
      toast({
        title: "Historia de usuario creada",
        description: `Se ha añadido "${newTask.title}" al backlog.`,
      });
    } catch (error) {
      console.error("Error creating user story:", error);
      toast({
        title: "Error",
        description: "Failed to create user story",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen dark:bg-black/20">
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
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
            getStatusColor={getStatusColor}
            getStatusDisplayText={getStatusDisplayText}
            getAssignedUser={getAssignedUser}
            onDeleteTask={handleDeleteTask}
            getEpicById={getEpicById}
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
          newUserStoryEpicId={newUserStoryEpicId}
          onNewUserStoryEpicIdChange={setNewUserStoryEpicId}
          onCreateUserStory={handleCreateUserStory}
          getPriorityColor={getPriorityColor}
          getTypeColor={getTypeColor}
          getStatusColor={getStatusColor}
          getStatusDisplayText={getStatusDisplayText}
          getAssignedUser={getAssignedUser}
          onDeleteTask={handleDeleteTask}
          epics={epics}
          onOpenEpicDialog={() => setIsEpicDialogOpen(true)}
          getEpicById={getEpicById}
          searchTerm={searchTerm}
        />
      </div>

      {/* Modals */}
      <CreateSprintModal
        isOpen={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
        onCreateSprint={handleCreateSprint}
        nextSprintNumber={nextSprintNumber}
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
        onEditTask={(task) => openEditTaskModal(task)}
        onStatusChange={handleBacklogTaskStatusChange}
        getPriorityColor={getPriorityColor}
        getTypeColor={getTypeColor}
        getStatusColor={getStatusColor}
        getStatusDisplayText={getStatusDisplayText}
        getAssignedUser={getAssignedUser}
      />

      <InviteMembersDialog
        open={isMembersDialogOpen}
        onOpenChange={setIsMembersDialogOpen}
        project={project}
        projectMembers={projectMembers}
        refetchMembers={refetchProjectMembers}
        teams={teams}
        currentTeam={currentTeam}
      />
    </div>
  )
}

