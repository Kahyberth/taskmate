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

// Mock team members for assignment
const teamMembers = [
  { id: "user-1", name: "Alex Johnson", initials: "AJ" },
  { id: "user-2", name: "Sam Taylor", initials: "ST" },
  { id: "user-3", name: "Jordan Lee", initials: "JL" },
  { id: "user-4", name: "Casey Morgan", initials: "CM" },
]

// Mock sprints for fallback
const mockSprints: Sprint[] = [
  {
    id: "sprint-1",
    name: "Tablero Sprint 1",
    isActive: true,
    tasks: [],
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    goal: "Completar las funcionalidades principales",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "sprint-2",
    name: "Tablero Sprint 2",
    isActive: false,
    tasks: [],
    startDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 28)),
    goal: "Mejorar la experiencia de usuario",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function ProjectManagement() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
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
    try {
      const response = await apiClient.get(`/backlog/get-backlog-by-project/${project_id}`);
      if (response.data && response.data.id) {
        console.log("Backlog ID fetched:", response.data.id);
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

  const fetchEpics = async () => {
    if (!project_id) return;
    
    try {
      const response = await apiClient.get(`/projects/epics/${project_id}`);
      
      if (response.data) {
        console.log("Epics fetched:", response.data);
        setEpics(response.data);
      }
    } catch (error) {
      console.error("Error fetching epics:", error);
      // Set empty array as fallback
      setEpics([]);
    }
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
        status: "to-do",
        priority: newUserStoryPriority,
        createdBy: user?.id,
        acceptanceCriteria: "",
        productBacklogId: backlogId,
        epicId: newUserStoryEpicId,
        // No incluimos storyPoints en la creación para evitar la validación @Min(1)
        // El valor por defecto será 0 (sin estimar)
      };

      const response = await apiClient.post(`/issues/create`, newTask);
      
      if (response.data) {
        // Cast to any to avoid TypeScript issues with the different model structures
        // between the API response and our Task interface
        setBacklogTasks([...backlogTasks, response.data as any]);
        setNewUserStoryTitle("");
        setNewUserStoryEpicId(undefined);
        toast({
          title: "Historia de usuario creada",
          description: `Se ha añadido "${newTask.title}" al backlog.`,
        });
      }
      
    } catch (error) {
      console.error("Error creating user story:", error);
      toast({
        title: "Error",
        description: "Failed to create user story",
        variant: "destructive",
      });
      throw error; // Re-throw error to be caught by the loading state handler
    }
  };

  const fetchBacklogTasks = async () => {
    console.log("fetching backlog tasks for project:", project_id);
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get(`/projects/issues/${project_id}`);
      console.log("Raw backend response:", response.data);
      
      if (response.data) {
        // The response.data is already an array of issues
        const tasks = Array.isArray(response.data) ? response.data : [];
        console.log("Processed tasks:", tasks);
        
        // Map the tasks to ensure they have all required fields
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
          resolvedAt: task.resolvedAt,
          finishedAt: task.finishedAt
        }));
        
        console.log("Mapped tasks:", mappedTasks);
        setBacklogTasks(mappedTasks);
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
    console.log("fetching sprints for project:", project_id);
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
            resolvedAt: task.resolvedAt,
            finishedAt: task.finishedAt
          })) : [],
          startDate: sprint.startDate ? new Date(sprint.startDate) : undefined,
          endDate: sprint.endDate ? new Date(sprint.endDate) : undefined,
          goal: sprint.goal || "",
          createdAt: sprint.createdAt ? new Date(sprint.createdAt) : undefined,
          updatedAt: sprint.updatedAt ? new Date(sprint.updatedAt) : undefined
        }));
        
        console.log("Mapped sprints:", mappedSprints);
        setSprints(mappedSprints);
        
        // Actualizar el número del próximo sprint
        if (mappedSprints.length > 0) {
          const sprintNumbers = mappedSprints
            .map((s: Sprint) => {
              const match = s.name.match(/Sprint\s+(\d+)/i);
              return match ? parseInt(match[1]) : 0;
            })
            .filter(n => !isNaN(n));
            
          if (sprintNumbers.length > 0) {
            const maxNumber = Math.max(...sprintNumbers);
            setNextSprintNumber(maxNumber + 1);
          }
        }
      } else {
        // Fallback to mock data if no sprints returned from API
        console.log("Using mock sprints as fallback");
        setSprints(mockSprints);
        
        // Set next sprint number based on mock data
        const maxSprintNumber = Math.max(...mockSprints.map((s: Sprint) => {
          const match = s.name.match(/Sprint\s+(\d+)/i);
          return match ? parseInt(match[1]) : 0;
        }));
        setNextSprintNumber(maxSprintNumber + 1);
      }
    } catch (error) {
      console.error("Error fetching sprints:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los sprints",
        variant: "destructive",
      });
      
      // Fallback to mock data on error
      console.log("Using mock sprints due to error");
      setSprints(mockSprints);
      
      // Set next sprint number based on mock data
      const maxSprintNumber = Math.max(...mockSprints.map((s: Sprint) => {
        const match = s.name.match(/Sprint\s+(\d+)/i);
        return match ? parseInt(match[1]) : 0;
      }));
      setNextSprintNumber(maxSprintNumber + 1);
    }
  };

  const fetchProjectMembers = async () => {
    if (!project_id) return;
    
    try {
      setLoadingMembers(true);
      const response = await apiClient.get(`/projects/members/${project_id}`);
      
      if (response.data && Array.isArray(response.data)) {
        console.log("Project members fetched:", response.data);
        setProjectMembers(response.data);
      } else {
        console.error("No members found in response:", response.data);
        // Fallback to empty array
        setProjectMembers([]);
      }
    } catch (error) {
      console.error("Error fetching project members:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los miembros del proyecto",
        variant: "destructive",
      });
      // Fallback to empty array  
      setProjectMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Find the team associated with the current project
  const currentTeam = useMemo(() => {
    if (!project || !teams) return null;
    return teams.find(team => team.id === project.team_id);
  }, [project, teams]);
  
  useEffect(() => {
    console.log("project_id from params:", project_id);
    if (project_id) {
      fetchBacklogId().then(id => {
        if (id) {
          fetchBacklogTasks();
          fetchSprints();
          fetchEpics();
        }
      });
      fetchProjectMembers();
    }
  }, [project_id]);

  useEffect(() => {
    const project = location.state?.project;
    if (project) {
      setProject(project);
    }
  }, [location.state]);

  // Add effect to update members when members dialog opens
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
      task.status !== "resolved" && task.status !== "closed"
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
    if (!editingTask) return;

    try {
      // Preparar los datos de actualización según lo requerido por la API
      const taskData = {
        id: editingTask.id,
        userId: user?.id,
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        status: updatedTask.status,
        assignedTo: updatedTask.assignedTo,
        type: updatedTask.type,
        acceptanceCriteria: editingTask.acceptanceCriteria || "",
        storyPoints: updatedTask.storyPoints,
        epicId: updatedTask.epicId,
      };

      // Solo incluir storyPoints en la solicitud si es mayor que 0
      // Esto evita la validación @Min(1) en el backend
      if (updatedTask.storyPoints && updatedTask.storyPoints > 0) {
        taskData.storyPoints = updatedTask.storyPoints;
      }

      const response = await apiClient.patch(`/issues/update`, taskData);

      if (response.data) {
        // Actualizar el estado local según dónde estaba la tarea (sprint o backlog)
        if (editingSprintId) {
          setSprints(sprints.map(sprint =>
            sprint.id === editingSprintId
              ? {
                  ...sprint,
                  tasks: sprint.tasks.map((task: Task) =>
                      task.id === editingTask.id ? { ...response.data, storyPoints: updatedTask.storyPoints, epicId: updatedTask.epicId } : task
                  ),
                }
              : sprint
          ));
        } else {
          setBacklogTasks(backlogTasks.map(task =>
              task.id === editingTask.id ? { ...response.data, storyPoints: updatedTask.storyPoints, epicId: updatedTask.epicId } : task
          ));
        }

        toast({
          title: "Cambios guardados",
          description: "Los cambios han sido guardados exitosamente.",
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la tarea. Inténtalo de nuevo.",
        variant: "destructive",
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
              status: task.status === "to-do" || task.status === "in-progress" ? "resolved" : "to-do",
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
                      status: task.status === "to-do" || task.status === "in-progress" ? "resolved" : "to-do",
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
      case "resolved":
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
      case "resolved":
        return "RESUELTO";
      case "closed":
        return "CERRADO";
      case "review":
        return "EN REVISIÓN";
      default:
        return "POR HACER";
    }
  }

  const getAssignedUser = (userId?: string) => {
    if (!userId) return null;
    
    // Buscar en los miembros reales del proyecto
    const projectMember = projectMembers.find(member => member.user_id === userId);
    if (projectMember && projectMember.user) {
      return { 
        initials: projectMember.initials || 'U',
        name: projectMember.user.name,
        lastName: projectMember.user.lastName || ''
      };
    }
    
    // Fallback a miembros de ejemplo si no se encuentra en los miembros del proyecto
    const mockMember = teamMembers.find((member) => member.id === userId);
    return mockMember 
      ? { initials: mockMember.initials, name: mockMember.name, lastName: '' } 
      : { initials: 'U', name: 'Usuario', lastName: '' };
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
      // Encontrar la tarea en el sprint
      const sprint = sprints.find(s => s.id === sprintId);
      const task = sprint?.tasks.find((t: Task) => t.id === taskId);
      
      if (!task || !sprint) {
        console.error("Task not found in sprint:", taskId);
        return;
      }
      
      // Guardar el estado anterior para restaurarlo en caso de error
      const previousStatus = task.status;
      
      // Actualización optimista
      const updatedTask = { ...task, status } as Task;
      setSprints(sprints.map(s =>
        s.id === sprintId
          ? { ...s, tasks: s.tasks.map((t: Task) => t.id === taskId ? updatedTask : t) }
          : s
      ));
      
      try {
        // Llamar a la API para actualizar el estado
        const response = await apiClient.patch(`/issues/update`, {
          id: taskId,
          status,
          userId: user?.id
        });
        
        if (response.data) {
          toast({
            title: "Estado actualizado",
            description: `El estado de "${task.title}" ha sido actualizado a ${getStatusDisplayText(status).toLowerCase()}.`,
          });
        }
      } catch (error) {
        console.error("Error updating task status:", error);
        
        // Restaurar el estado anterior
        setSprints(sprints.map(s =>
          s.id === sprintId
            ? { 
                ...s, 
                tasks: s.tasks.map((t: Task) => 
                  t.id === taskId ? { ...t, status: previousStatus } as Task : t
                ) 
              }
            : s
        ));
        
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
    try {
      // Encontrar la tarea en el backlog
      const task = backlogTasks.find((t: Task) => t.id === taskId);
      if (!task) {
        console.error("Task not found in backlog:", taskId);
        return;
      }
      
      // Guardar el estado anterior para restaurarlo en caso de error
      const previousStatus = task.status;
      
      // Actualización optimista
      const updatedTask = { ...task, status } as Task;
      setBacklogTasks(backlogTasks.map(t => t.id === taskId ? updatedTask : t));
      
      try {
        // Llamar a la API para actualizar el estado
        const response = await apiClient.patch(`/issues/update`, {
          id: taskId,
          status,
          userId: user?.id
        });
        
        if (response.data) {
          toast({
            title: "Estado actualizado",
            description: `El estado de "${task.title}" ha sido actualizado a ${getStatusDisplayText(status).toLowerCase()}.`,
          });
        }
      } catch (error) {
        console.error("Error updating task status:", error);
        
        // Restaurar el estado anterior
        setBacklogTasks(backlogTasks.map(t => 
          t.id === taskId ? { ...t, status: previousStatus } as Task : t
        ));
        
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

  // Función para filtrar tareas según el término de búsqueda
  const filteredBacklogTasks = useMemo(() => {
    if (!searchTerm.trim()) return backlogTasks;
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    return backlogTasks.filter(task => {
      // Función auxiliar que verifica si alguna palabra en un texto comienza con el término de búsqueda
      const hasWordStartingWith = (text: string | undefined): boolean => {
        if (!text) return false;
        
        // Dividir el texto en palabras y verificar cada una
        return text.toLowerCase()
          .split(/\s+/) // Dividir por espacios en blanco (incluye espacios, tabs, saltos de línea)
          .some(word => word.startsWith(searchLower));
      };
      
      // Comprobar si alguna palabra en el título comienza con el término de búsqueda
      const titleMatches = hasWordStartingWith(task.title);
      
      // Comprobar si alguna palabra en el código comienza con el término de búsqueda
      const codeMatches = hasWordStartingWith(task.code);
      
      // Comprobar si alguna palabra en la descripción comienza con el término de búsqueda
      const descriptionMatches = hasWordStartingWith(task.description);
      
      return titleMatches || codeMatches || descriptionMatches;
    });
  }, [backlogTasks, searchTerm]);

  // Function to refetch project members
  const refetchProjectMembers = async () => {
    await fetchProjectMembers();
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
        onSearchChange={setSearchTerm}
        filteredResultsCount={filteredBacklogTasks.length}
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
          tasks={filteredBacklogTasks}
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
        teamMembers={teamMembers}
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
        projectId={project_id || ""}
        onEpicCreated={(epic) => {
          setEpics([...epics, epic]);
        }}
        selectedEpicId={null}
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
