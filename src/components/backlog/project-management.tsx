import { useEffect, useState } from "react"
import { Search, ChevronDown, MoreHorizontal, Maximize2, Star, CheckSquare, Edit, Copy, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLocation } from "react-router-dom"
import { Projects } from "@/interfaces/projects.interface"

// Define types for our tasks and sprints
interface Task {
  id: string
  title: string
  code: string
  status: "todo" | "in-progress" | "done"
  isCompleted: boolean
  priority?: "low" | "medium" | "high"
  description?: string
  storyPoints?: number
  assignedTo?: string
  type?: 'bug' | 'feature' | 'task' | 'refactor' | 'user_story';
}

interface Sprint {
  id: string
  name: string
  isActive: boolean
  tasks: Task[]
  startDate?: Date
  endDate?: Date
  goal?: string
}

// Mock team members for assignment
const teamMembers = [
  { id: "user-1", name: "Alex Johnson", initials: "AJ" },
  { id: "user-2", name: "Sam Taylor", initials: "ST" },
  { id: "user-3", name: "Jordan Lee", initials: "JL" },
  { id: "user-4", name: "Casey Morgan", initials: "CM" },
]

export default function ProjectManagement() {

  const initialTasks: Task[] = [
    {
      id: "task-1",
      code: "TEST-1",
      title: "Pruebas",
      status: "todo",
      isCompleted: false,
      priority: "medium",
      description: "Realizar pruebas de integración del sistema",
      storyPoints: 5,
    },
    {
      id: "task-2",
      code: "TEST-2",
      title: "Autenticacion",
      status: "todo",
      isCompleted: false,
      priority: "high",
      description: "Implementar sistema de autenticación con OAuth",
      storyPoints: 8,
      assignedTo: "user-1",
    },
  ]

  // Initial sprints
  const initialSprints: Sprint[] = [
    {
      id: "sprint-1",
      name: "Tablero Sprint 1",
      isActive: false,
      tasks: initialTasks,
    },
  ]

  const [sprints, setSprints] = useState<Sprint[]>(initialSprints)
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([
    {
      id: "task-3",
      code: "TEST-3",
      title: "Navbar",
      status: "todo",
      isCompleted: false,
      priority: "low",
      description: "Diseñar e implementar la barra de navegación",
      storyPoints: 3,
    },
    {
      id: "task-4",
      code: "TEST-4",
      title: "Footer",
      status: "todo",
      isCompleted: false,
      priority: "low",
      description: "Crear el pie de página con enlaces a redes sociales",
      storyPoints: 2,
      assignedTo: "user-2",
    },
  ])
  const [newUserStoryTitle, setNewUserStoryTitle] = useState("")
  const [newUserStoryType, setNewUserStoryType] = useState<'bug' | 'feature' | 'task' | 'refactor' | 'user_story'>('user_story');
  const [activeTab, setActiveTab] = useState("sprints")

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    "sprint-1": true,
    backlog: true,
  })

  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false)
  const [sprintName, setSprintName] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [sprintGoal, setSprintGoal] = useState("")
  const [nextSprintNumber, setNextSprintNumber] = useState(2)
  const [newTaskInput, setnewTaskInput] = useState("")

  // Edit task state
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingSprintId, setEditingSprintId] = useState<string | null>(null)
  const [editTaskTitle, setEditTaskTitle] = useState("")
  const [editTaskDescription, setEditTaskDescription] = useState("")
  const [editTaskPriority, setEditTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [editTaskStatus, setEditTaskStatus] = useState<"todo" | "in-progress" | "done">("todo")
  const [editTaskStoryPoints, setEditTaskStoryPoints] = useState<number>(0)
  const [editTaskAssignedTo, setEditTaskAssignedTo] = useState<string | undefined>("unassigned")
  const [editTaskType, setEditTaskType] = useState<'bug' | 'feature' | 'task' | 'refactor' | 'user_story'>('user_story');

  const [isEditSprintOpen, setIsEditSprintOpen] = useState(false)
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null)
  const [editSprintName, setEditSprintName] = useState("")
  const [editSprintStartDate, setEditSprintStartDate] = useState<Date>()
  const [editSprintEndDate, setEditSprintEndDate] = useState<Date>()
  const [editSprintGoal, setEditSprintGoal] = useState("")
  const [project, setProject] = useState<Projects | null>(null)
  const location = useLocation()
  const { toast } = useToast()

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCreateSprint = () => {
    // Create a new sprint
    const newSprint: Sprint = {
      id: `sprint-${nextSprintNumber}`,
      name: sprintName || `Tablero Sprint ${nextSprintNumber}`,
      isActive: false,
      tasks: [],
    }

    setSprints([...sprints, newSprint])
    setNextSprintNumber(nextSprintNumber + 1)
    setExpandedSections((prev) => ({
      ...prev,
      [newSprint.id]: true,
    }))

    // Reset form and close modal
    setSprintName("")
    setStartDate(undefined)
    setEndDate(undefined)
    setSprintGoal("")
    setIsCreateSprintOpen(false)

    toast({
      title: "Sprint creado",
      description: `Se ha creado el sprint "${newSprint.name}" exitosamente.`,
    })
  }

  const handleCreateUserStory = () => {
    if (!newUserStoryTitle.trim()) {
      toast({
        title: "Error",
        description: "El título de la historia de usuario no puede estar vacío.",
        variant: "destructive",
      })
      return
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      code: `${project?.project_key}-${Math.floor(Math.random() * 1000)}`,
      title: newUserStoryTitle,
      status: "todo",
      isCompleted: false,
      type: newUserStoryType,
    }

    setBacklogTasks([...backlogTasks, newTask])
    setNewUserStoryTitle("") // Clear the input
    toast({
      title: "Historia de usuario creada",
      description: `Se ha añadido "${newTask.title}" al backlog.`,
    })
  }

  useEffect(() => {
    const project = location.state?.project
    if (project) {
      setProject(project)
    }
  }, [location.state])

  const handleStartSprint = (sprintId: string) => {
    setSprints(sprints.map((sprint) => (sprint.id === sprintId ? { ...sprint, isActive: true } : sprint)))

    toast({
      title: "Sprint iniciado",
      description: "El sprint ha sido iniciado exitosamente.",
    })
  }

  const handleCompleteSprint = (sprintId: string) => {
    // Find the current sprint
    const currentSprint = sprints.find((sprint) => sprint.id === sprintId)
    if (!currentSprint) return

    // Filter tasks based on status
    const incompleteTasks = currentSprint.tasks.filter((task) => task.status !== "done" && !task.isCompleted)

    // Create a new sprint for incomplete tasks if there are any
    if (incompleteTasks.length > 0) {
      const newSprintId = `sprint-${nextSprintNumber}`
      const newSprint: Sprint = {
        id: newSprintId,
        name: `Tablero Sprint ${nextSprintNumber}`,
        isActive: false,
        tasks: incompleteTasks,
      }

      setSprints([...sprints.filter((s) => s.id !== sprintId), newSprint])
      setNextSprintNumber(nextSprintNumber + 1)
      setExpandedSections((prev) => ({
        ...prev,
        [newSprintId]: true,
      }))

      toast({
        title: "Sprint completado",
        description: `Se han movido ${incompleteTasks.length} tareas incompletas a "${newSprint.name}".`,
      })
    } else {
      // If no incomplete tasks, just remove the current sprint
      setSprints(sprints.filter((s) => s.id !== sprintId))

      toast({
        title: "Sprint completado",
        description: "Todas las tareas fueron completadas exitosamente.",
      })
    }
  }

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

  const openEditSprintModal = (sprint: Sprint) => {
    if (!sprint) return

    setEditingSprint(sprint)
    setEditSprintName(sprint.name)
    // Si el sprint tiene fechas almacenadas, úsalas; de lo contrario, undefined
    setEditSprintStartDate(sprint.startDate || undefined)
    setEditSprintEndDate(sprint.endDate || undefined)
    setEditSprintGoal(sprint.goal || "") // Si el sprint tiene una meta almacenada, úsala
    setIsEditSprintOpen(true)
  }

  const handleSaveSprintEdit = () => {
    if (!editingSprint) return

    const updatedSprint: Sprint = {
      ...editingSprint,
      name: editSprintName,
      startDate: editSprintStartDate,
      endDate: editSprintEndDate,
      goal: editSprintGoal,
    }

    setSprints(sprints.map((s) => (s.id === editingSprint.id ? updatedSprint : s)))
    setIsEditSprintOpen(false)

    toast({
      title: "Sprint actualizado",
      description: `El sprint "${updatedSprint.name}" ha sido actualizado exitosamente.`,
    })
  }

  const handleToggleBacklogTaskCompletion = (taskId: string) => {
    setBacklogTasks(
      backlogTasks.map((task) =>
        task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted, status: !task.isCompleted ? "done" : "todo" }
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
              tasks: sprint.tasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted, status: !task.isCompleted ? "done" : task.status === "done" ? "todo" : task.status } : task
              ),
            }
          : sprint
      )
    );
    const currentSprint = sprints.find(s => s.id === sprintId);
    const taskDetails = currentSprint?.tasks.find(t => t.id === taskId);
    if (taskDetails) {
      toast({
        title: "Tarea actualizada",
        description: `El estado de "${taskDetails.title}" ha sido actualizado.`,
      });
    }
  };

  const moveTaskToSprint = (taskId: string, targetSprintId: string) => {
    // Find the task in the backlog
    const taskToMove = backlogTasks.find((task) => task.id === taskId);
    if (!taskToMove) return;

    // If the task is completed, update its status to "todo"
    const updatedTask = taskToMove.isCompleted ? { ...taskToMove, isCompleted: false, status: "todo" as "todo" } : { ...taskToMove, status: taskToMove.status as "todo" | "in-progress" | "done" };

    // Add the task to the target sprint
    setSprints(
      sprints.map((sprint) =>
        sprint.id === targetSprintId ? { ...sprint, tasks: [...sprint.tasks, updatedTask] } : sprint,
      ),
    )

    // Remove the task from the backlog
    setBacklogTasks(backlogTasks.filter((task) => task.id !== taskId))

    toast({
      title: "Historia movida",
      description: `La historia "${taskToMove.title}" ha sido movida al sprint.`,
    })
  }

  const moveTaskToBacklog = (sprintId: string, taskId: string) => {
    // Find the sprint and task
    const sprint = sprints.find((s) => s.id === sprintId)
    if (!sprint) return

    const taskToMove = sprint.tasks.find((task) => task.id === taskId)
    if (!taskToMove) return

    // Add the task to the backlog
    setBacklogTasks([...backlogTasks, taskToMove])

    // Remove the task from the sprint
    setSprints(
      sprints.map((sprint) =>
        sprint.id === sprintId ? { ...sprint, tasks: sprint.tasks.filter((task) => task.id !== taskId) } : sprint,
      ),
    )

    toast({
      title: "Historia movida",
      description: `La historia "${taskToMove.title}" ha sido movida al backlog.`,
    })
  }

  const openEditTaskModal = (task: Task, sprintId: string | null = null) => {
    setEditingTask(task)
    setEditingSprintId(sprintId)
    setEditTaskTitle(task.title)
    setEditTaskDescription(task.description || "")
    setEditTaskPriority(task.priority || "medium")
    setEditTaskStatus(task.status)
    setEditTaskStoryPoints(task.storyPoints || 0)
    setEditTaskAssignedTo(task.assignedTo || "unassigned")
    setEditTaskType(task.type || 'user_story');
    setIsEditTaskOpen(true)
  }

  const handleSaveTaskEdit = () => {
    if (!editingTask) return

    const updatedTask: Task = {
      ...editingTask,
      title: editTaskTitle,
      description: editTaskDescription,
      priority: editTaskPriority,
      status: editTaskStatus,
      storyPoints: editTaskStoryPoints,
      assignedTo: editTaskAssignedTo === "unassigned" ? undefined : editTaskAssignedTo,
      type: editTaskType,
    }

    if (editingSprintId) {
      // Update task in a sprint
      setSprints(
        sprints.map((sprint) =>
          sprint.id === editingSprintId
            ? {
                ...sprint,
                tasks: sprint.tasks.map((task) => (task.id === editingTask.id ? updatedTask : task)),
              }
            : sprint,
        ),
      )
    } else {
      // Update task in backlog
      setBacklogTasks(backlogTasks.map((task) => (task.id === editingTask.id ? updatedTask : task)))
    }

    setIsEditTaskOpen(false)
    toast({
      title: "Historia actualizada",
      description: "Los cambios han sido guardados exitosamente.",
    })
  }

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
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "todo":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAssignedUser = (userId?: string) => {
    if (!userId) return null
    return teamMembers.find((member) => member.id === userId)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex items-center p-3 px-4">
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded">T</div>
            <h1 className="font-medium">{project?.name}</h1>
            <button className="text-gray-400">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="backlog" className="w-full"></Tabs>
      </header>

      {/* Search Bar */}
      <div className="flex items-center gap-2 p-2 border-b bg-white">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input placeholder="Buscar en el backlog..." className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center w-6 h-6 bg-green-500 text-white text-xs rounded-full">
            KP
          </div>
          <Button variant="outline" size="sm" className="h-8 text-sm flex items-center gap-1">
            Epic <ChevronDown size={14} />
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 size={16} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  // No podemos editar un sprint aquí porque no tenemos referencia a ningún sprint específico
                  toast({
                    title: "Selecciona un sprint",
                    description: "Por favor, selecciona un sprint específico para editarlo.",
                  })
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar sprint</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // Aquí puedes implementar la duplicación del sprint
                  toast({
                    title: "Duplicar sprint",
                    description: "Esta funcionalidad será implementada próximamente.",
                  })
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicar sprint</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  //The sprint variable is undeclared. Please fix the import or declare the variable before using it.
                  //Fixed: Accessing sprint id from the parent component
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Eliminar sprint</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Sprint Sections */}
        {sprints.map((sprint) => (
          <div className="mb-6 border border-gray-200 rounded-md p-3 shadow-sm bg-white" key={sprint.id}>
            <div className="flex items-center mb-2 cursor-pointer" onClick={() => toggleSection(sprint.id)}>
              <Checkbox className="mr-2" />
              <ChevronDown
                size={16}
                className={`mr-2 transition-transform ${expandedSections[sprint.id] ? "transform rotate-0" : "transform rotate-270"}`}
              />
              <span className="font-medium">{sprint.name}</span>
              <span className="ml-2 text-gray-500 text-sm">
                <button className="text-xs text-gray-500 underline">Añadir fechas</button> ({sprint.tasks.length}{" "}
                actividades)
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-500">0</span>
                <div className="w-6 h-4 bg-blue-100 rounded-sm flex items-center justify-center text-xs text-blue-800">
                  0
                </div>
                <span className="text-xs text-gray-500">0</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    sprint.isActive ? handleCompleteSprint(sprint.id) : handleStartSprint(sprint.id)
                  }}
                >
                  {sprint.isActive ? "Completar sprint" : "Iniciar sprint"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation() // Detener la propagación para evitar que se active toggleSection
                        openEditSprintModal(sprint) // Pasar el sprint actual al modal
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar sprint</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        // Aquí puedes implementar la duplicación del sprint
                        toast({
                          title: "Duplicar sprint",
                          description: "Esta funcionalidad será implementada próximamente.",
                        })
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Duplicar sprint</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSprint(sprint.id)
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Eliminar sprint</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {expandedSections[sprint.id] && (
              <div className="pl-8">
                {sprint.tasks.map((task) => (
                  <div className="border rounded-md mb-1" key={task.id}>
                    <div className="flex items-center p-3 hover:bg-gray-50">
                      <Checkbox
                        className="mr-2"
                        id={task.id}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion(sprint.id, task.id)}
                      />
                      <label htmlFor={task.id} className="flex items-center gap-2 flex-1 cursor-pointer">
                        <span className="text-gray-500 text-sm">{task.code}</span>
                        <span className={task.isCompleted ? "line-through text-gray-400" : ""}>{task.title}</span>

                        {task.priority && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                        )}
                        {task.type && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(task.type)}`}
                          >
                            {task.type}
                          </span>
                        )}

                        {task.storyPoints && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            {task.storyPoints} pts
                          </span>
                        )}

                        {task.assignedTo && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                              {getAssignedUser(task.assignedTo)?.initials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </label>
                      <div className="ml-auto flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditTaskModal(task, sprint.id)
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              <span className={`px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                                {task.status === "todo"
                                  ? "POR HACER"
                                  : task.status === "in-progress"
                                    ? "EN PROGRESO"
                                    : "COMPLETADO"}
                              </span>
                              <ChevronDown size={14} className="ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                const updatedTask = { ...task, status: "todo" as const }
                                setSprints(
                                  sprints.map((s) =>
                                    s.id === sprint.id
                                      ? { ...s, tasks: s.tasks.map((t) => (t.id === task.id ? updatedTask : t)) }
                                      : s,
                                  ),
                                )
                              }}
                            >
                              Por hacer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const updatedTask = { ...task, status: "in-progress" as const }
                                setSprints(
                                  sprints.map((s) =>
                                    s.id === sprint.id
                                      ? { ...s, tasks: s.tasks.map((t) => (t.id === task.id ? updatedTask : t)) }
                                      : s,
                                  ),
                                )
                              }}
                            >
                              En progreso
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const updatedTask = { ...task, status: "done" as const }
                                setSprints(
                                  sprints.map((s) =>
                                    s.id === sprint.id
                                      ? { ...s, tasks: s.tasks.map((t) => (t.id === task.id ? updatedTask : t)) }
                                      : s,
                                  ),
                                )
                              }}
                            >
                              Completado
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => moveTaskToBacklog(sprint.id, task.id)}
                        >
                          Mover al backlog
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Star size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center py-4 text-gray-400">
              <CheckSquare size={16} className="mr-2" />
              <span className="text-sm">
                {sprint.tasks.length} actividades | Estimación:{" "}
                {sprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)}
              </span>
            </div>
          </div>
        ))}

        {/* Backlog Section */}
        <div className="border border-gray-200 rounded-md p-3 shadow-sm bg-white mb-6">
          <div className="flex items-center mb-2 cursor-pointer" onClick={() => toggleSection("backlog")}>
            <Checkbox className="mr-2" />
            <ChevronDown
              size={16}
              className={`mr-2 transition-transform ${expandedSections["backlog"] ? "transform rotate-0" : "transform rotate-270"}`}
            />
            <span className="font-medium">Backlog</span>
            <span className="ml-2 text-gray-500 text-sm">({backlogTasks.length} actividades)</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-500">0</span>
              <div className="w-6 h-4 bg-blue-100 rounded-sm flex items-center justify-center text-xs text-blue-800">
                0
              </div>
              <span className="text-xs text-gray-500">0</span>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsCreateSprintOpen(true)}>
                Crear sprint
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal size={14} />
              </Button>
            </div>
          </div>

          {expandedSections["backlog"] && (
            <div className="pl-8">
              {/* Input for new user story */}
              <div className="flex items-center gap-2 my-4">
                <Input
                  type="text"
                  placeholder="Escribe el título de la nueva historia de usuario"
                  value={newUserStoryTitle}
                  onChange={(e) => setNewUserStoryTitle(e.target.value)}
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateUserStory();
                    }
                  }}
                />
                <Select value={newUserStoryType} onValueChange={(value: 'bug' | 'feature' | 'task' | 'refactor' | 'user_story') => setNewUserStoryType(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user_story">User Story</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="refactor">Refactor</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateUserStory} size="sm">Añadir</Button>
              </div>
              {/* End of input for new user story */}

              {backlogTasks.map((task) => (
                <div className="border rounded-md mb-1" key={task.id}>
                  <div className="flex items-center p-3 hover:bg-gray-50">
                    <Checkbox
                      className="mr-2"
                      id={task.id}
                      checked={task.isCompleted}
                      onCheckedChange={() => handleToggleBacklogTaskCompletion(task.id)}
                    />
                    <label htmlFor={task.id} className="flex items-center gap-2 flex-1 cursor-pointer">
                      <span className="text-gray-500 text-sm">{task.code}</span>
                      <span className={task.isCompleted ? "line-through text-gray-400" : ""}>{task.title}</span>

                      {task.priority && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                      {task.type && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(task.type)}`}>
                          {task.type}
                        </span>
                      )}

                      {task.storyPoints && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          {task.storyPoints} pts
                        </span>
                      )}

                      {task.assignedTo && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                            {getAssignedUser(task.assignedTo)?.initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </label>
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditTaskModal(task)
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <span className={`px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                              {task.status === "todo"
                                ? "POR HACER"
                                : task.status === "in-progress"
                                  ? "EN PROGRESO"
                                  : "COMPLETADO"}
                            </span>
                            <ChevronDown size={14} className="ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              const updatedTask = { ...task, status: "todo" as const }
                              setBacklogTasks(backlogTasks.map((t) => (t.id === task.id ? updatedTask : t)))
                            }}
                          >
                            Por hacer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const updatedTask = { ...task, status: "in-progress" as const }
                              setBacklogTasks(backlogTasks.map((t) => (t.id === task.id ? updatedTask : t)))
                            }}
                          >
                            En progreso
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const updatedTask = { ...task, status: "done" as const }
                              setBacklogTasks(backlogTasks.map((t) => (t.id === task.id ? updatedTask : t)))
                            }}
                          >
                            Completado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Mover a <ChevronDown size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {sprints.map((sprint) => (
                            <DropdownMenuItem key={sprint.id} onClick={() => moveTaskToSprint(task.id, sprint.id)}>
                              {sprint.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Star size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Sprint Modal */}
      <Dialog open={isCreateSprintOpen} onOpenChange={setIsCreateSprintOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo sprint</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sprint-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="sprint-name"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                className="col-span-3"
                placeholder={`Tablero Sprint ${nextSprintNumber}`}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fecha inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fecha fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sprint-goal" className="text-right">
                Meta
              </Label>
              <Textarea
                id="sprint-goal"
                value={sprintGoal}
                onChange={(e) => setSprintGoal(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateSprintOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleCreateSprint}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar historia de usuario</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">
                Título
              </Label>
              <Input
                id="task-title"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="task-description"
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Prioridad</Label>
              <RadioGroup
                value={editTaskPriority}
                onValueChange={(value) => setEditTaskPriority(value as "low" | "medium" | "high")}
                className="col-span-3 flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label htmlFor="priority-low" className="text-green-600">
                    Baja
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="priority-medium" />
                  <Label htmlFor="priority-medium" className="text-yellow-600">
                    Media
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label htmlFor="priority-high" className="text-red-600">
                    Alta
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Estado</Label>
              <Select
                value={editTaskStatus}
                onValueChange={(value) => setEditTaskStatus(value as "todo" | "in-progress" | "done")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Por hacer</SelectItem>
                  <SelectItem value="in-progress">En progreso</SelectItem>
                  <SelectItem value="done">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tipo</Label>
              <Select
                value={editTaskType}
                onValueChange={(value) => setEditTaskType(value as 'bug' | 'feature' | 'task' | 'refactor' | 'user_story')}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user_story">User Story</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="refactor">Refactor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="story-points" className="text-right">
                Puntos
              </Label>
              <Select
                value={editTaskStoryPoints.toString()}
                onValueChange={(value) => setEditTaskStoryPoints(Number.parseInt(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar puntos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 puntos</SelectItem>
                  <SelectItem value="1">1 punto</SelectItem>
                  <SelectItem value="2">2 puntos</SelectItem>
                  <SelectItem value="3">3 puntos</SelectItem>
                  <SelectItem value="5">5 puntos</SelectItem>
                  <SelectItem value="8">8 puntos</SelectItem>
                  <SelectItem value="13">13 puntos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Asignado a</Label>
              <Select
                value={editTaskAssignedTo || "unassigned"}
                onValueChange={(value) => setEditTaskAssignedTo(value === "unassigned" ? undefined : value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar miembro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTaskOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSaveTaskEdit}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sprint Modal */}
      <Dialog open={isEditSprintOpen} onOpenChange={setIsEditSprintOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar sprint</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-sprint-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="edit-sprint-name"
                value={editSprintName}
                onChange={(e) => setEditSprintName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fecha inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !editSprintStartDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editSprintStartDate ? format(editSprintStartDate, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editSprintStartDate}
                    onSelect={setEditSprintStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fecha fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !editSprintEndDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editSprintEndDate ? format(editSprintEndDate, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={editSprintEndDate} onSelect={setEditSprintEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-sprint-goal" className="text-right">
                Meta
              </Label>
              <Textarea
                id="edit-sprint-goal"
                value={editSprintGoal}
                onChange={(e) => setEditSprintGoal(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSprintOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSaveSprintEdit}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
