import { useState, useRef, useEffect } from "react"
import { Plus, Search, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  MeasuringStrategy,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient } from "@/api/client-gateway"
import { notifications } from "@mantine/notifications"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useProjectById, useUpdateIssue } from "@/api/queries"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Task } from "@/interfaces/task.interface"
import { Sprint } from "@/interfaces/sprint.interface"
import { AssignedUser } from "@/interfaces/assigned-user.interface"
import { TaskCard } from "./components"
import { MobileKanbanView, DesktopKanbanView } from "./views"

// Función para obtener el color de la etiqueta según el tipo de tarea
const getTagColor = (type: Task["type"]) => {
  switch (type) {
    case "bug":
      return "bg-red-100 text-red-800"
    case "feature":
      return "bg-green-100 text-green-800"
    case "task":
      return "bg-blue-100 text-blue-800"
    case "refactor":
      return "bg-purple-100 text-purple-800"
    case "user_story":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Función para obtener el texto de la etiqueta según el tipo de tarea
const getTagText = (type: Task["type"]) => {
  switch (type) {
    case "bug":
      return "BUG"
    case "feature":
      return "FEATURE"
    case "task":
      return "TASK"
    case "refactor":
      return "REFACTOR"
    case "user_story":
      return "USER STORY"
    default:
      return "TASK"
  }
}

export default function KanbanBoard() {
  const { project_id } = useParams()
  const navigate = useNavigate()
  const { data: project, isLoading: isLoadingProject } = useProjectById(project_id)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [projectMembers, setProjectMembers] = useState<any[]>([])
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null)
  const [loadingSprints, setLoadingSprints] = useState(true)
  const [visibleColumns, setVisibleColumns] = useState({
    review: false,
    closed: false
  })
  const targetStatusRef = useRef<{ id: string; status: Task["status"] } | null>(null)
  const previousStateRef = useRef<Task[]>([])
  const [activeColumn, setActiveColumn] = useState<string | null>(null)
  const { mutate: updateIssue } = useUpdateIssue()

  const visibleColumnCount = 3 + 
    (visibleColumns.review ? 1 : 0) + 
    (visibleColumns.closed ? 1 : 0)

  // Configuración de sensores específica para móvil
  const mobileSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
        tolerance: 5,
      },
    })
  )

  // Configuración de sensores para desktop
  const desktopSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Función personalizada para detección de colisiones en móvil
  const mobileCollisionDetection: CollisionDetection = (args) => {
    return closestCorners(args)
  }

  // Función personalizada para detección de colisiones en desktop
  const desktopCollisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }
    
    const intersections = rectIntersection(args)
    if (intersections.length > 0) {
      return intersections
    }
    
    return closestCenter(args)
  }

  // Fetch sprints for the project
  const fetchSprints = async () => {
    if (!project_id) return
    
    try {
      setLoadingSprints(true)
      const response = await apiClient.get(`/sprints/get-sprints-by-project/${project_id}`)
      
      if (response.data && Array.isArray(response.data)) {
        setSprints(response.data)
        
        // Seleccionar el sprint activo o el primero de la lista
        const activeSprint = response.data.find((sprint: Sprint) => sprint.status === 'active')
        const sprintToSelect = activeSprint || response.data[0]
        
        if (sprintToSelect) {
          setSelectedSprintId(sprintToSelect.id)
          setTasks(sprintToSelect.issues)
        }
      }
    } catch (error) {
      console.error("Error fetching sprints:", error)
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar los sprints",
        color: "red"
      })
    } finally {
      setLoadingSprints(false)
      setIsLoading(false)
    }
  }

  // Update tasks when sprint selection changes
  useEffect(() => {
    if (selectedSprintId) {
      const selectedSprint = sprints.find(sprint => sprint.id === selectedSprintId)
      if (selectedSprint) {
        setTasks(selectedSprint.issues)
      }
    }
  }, [selectedSprintId, sprints])

  // Manejar inicio de arrastre
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeTaskItem = tasks.find((task) => task.id === active.id)
    if (activeTaskItem) {
      setActiveTask(activeTaskItem)
      previousStateRef.current = [...tasks]
      targetStatusRef.current = null
    }
  }

  // Actualizar el estado de una tarea en el backend
  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    console.log("Updating task status:", taskId, newStatus)
    try {
      const success = await new Promise((resolve) => {
        updateIssue(
          {
            id: taskId,
            status: newStatus,
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "Estado actualizado",
                message: "El estado de la tarea ha sido actualizado exitosamente",
                color: "green",
                autoClose: 2000,
              })
              resolve(true)
            },
            onError: (error) => {
              console.error("Error updating task status:", error);
              notifications.show({
                title: "Error",
                message: "No se pudo actualizar el estado de la tarea",
                color: "red",
                autoClose: 2000,
              });
              resolve(false);
            }
          }
        );
      });
      return success;
    } catch (error) {
      console.error("Error updating task status:", error);
      notifications.show({
        title: "Error",
        message: "No se pudo actualizar el estado de la tarea",
        color: "red",
        autoClose: 2000,
      });
      return false;
    }
  }

  // Manejar fin de arrastre
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      targetStatusRef.current = null
      setActiveColumn(null)
      return
    }

    const activeTaskItem = tasks.find(task => task.id === active.id);
    if (!activeTaskItem) {
      setActiveTask(null)
      targetStatusRef.current = null
      setActiveColumn(null)
      return
    }

    // Verificar si estamos moviendo a una nueva columna
    if (targetStatusRef.current && targetStatusRef.current.id === active.id) {
      const newStatus = targetStatusRef.current.status
      
      if (newStatus !== activeTaskItem.status) {
        const updatedTasks = tasks.map((task) => 
          task.id === active.id ? { ...task, status: newStatus } : task
        );
        
        setTasks(updatedTasks);
        
        const success = await updateTaskStatus(active.id as string, newStatus);
        
        if (!success) {
          setTasks(previousStateRef.current);
        }
      }
    }
    // Si estamos reordenando dentro de la misma columna
    else if (active.id !== over.id) {
      const activeIndex = tasks.findIndex((task) => task.id === active.id);
      const overIndex = tasks.findIndex((task) => task.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newTasks = arrayMove(tasks, activeIndex, overIndex);
        setTasks(newTasks);
      }
    }

    setActiveTask(null);
    setActiveColumn(null);
    targetStatusRef.current = null;
  }

  // Manejar soltar en una columna diferente
  const handleDragOver = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setActiveColumn(null);
      return;
    }

    const activeId = active.id;
    const activeTask = tasks.find(task => task.id === activeId);
    
    if (!activeTask) return;

    // Si estamos sobre un contenedor (columna)
    if (over.data?.current?.type === "container") {
      const newStatus = over.data.current.status;
      setActiveColumn(newStatus);
      
      if (newStatus !== activeTask.status) {
        targetStatusRef.current = { id: activeId, status: newStatus };
      } else {
        targetStatusRef.current = null;
      }
    }
    // Si estamos sobre un elemento dentro de una columna
    else if (over.id !== activeId) {
      const overTask = tasks.find((task) => task.id === over.id);

      if (overTask) {
        setActiveColumn(overTask.status);
        
        if (overTask.status !== activeTask.status) {
          targetStatusRef.current = { id: activeId, status: overTask.status };
        } else {
          targetStatusRef.current = null;
        }
      }
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

  // Función para cargar los miembros del proyecto
  const fetchProjectMembers = async () => {
    try {
      const response = await apiClient.get(`/projects/members/${project_id}`);
      setProjectMembers(response.data.users);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Error al cargar los miembros del proyecto",
        color: "red"
      });
    }
  };

  // Cargar miembros del proyecto cuando se carga el componente
  useEffect(() => {
    if (project_id) {
      fetchProjectMembers();
      fetchSprints();
    }
  }, [project_id]);

  if (isLoadingProject || isLoading || loadingSprints) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Proyecto no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400">El proyecto que estás buscando no existe o no tienes acceso a él.</p>
        </div>
      </div>
    )
  }

  if (sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay sprints activos</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Para visualizar el tablero Kanban, primero debes crear un sprint.</p>
        </div>
        <Button 
          onClick={() => navigate(`/projects/backlog/${project_id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Ir al Backlog
        </Button>
      </div>
    )
  }

  const toggleColumnVisibility = (column: 'review' | 'closed') => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold dark:text-white">Tablero Kanban</h1>
          <Select
            value={selectedSprintId || ""}
            onValueChange={setSelectedSprintId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Sprint" />
            </SelectTrigger>
            <SelectContent>
              {sprints.map((sprint) => (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {!visibleColumns.review && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleColumnVisibility('review')}
                    className="h-8 px-2 gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agregar columna de revisión</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {!visibleColumns.closed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleColumnVisibility('closed')}
                    className="h-8 px-2 gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    <BookmarkCheck className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agregar columna de cerrados</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Vista móvil con DnD específico */}
      <div className="lg:hidden">
        <DndContext
          sensors={mobileSensors}
          collisionDetection={mobileCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always
            }
          }}
        >
          <MobileKanbanView 
            tasks={tasks} 
            visibleColumns={visibleColumns} 
            getAssignedUser={getAssignedUser} 
            activeColumn={activeColumn}
            onToggleColumnVisibility={toggleColumnVisibility}
          />

          <DragOverlay 
            adjustScale={false} 
            zIndex={100} 
            dropAnimation={null}
            modifiers={[
              ({transform}) => ({
                ...transform,
                scaleX: 1,
                scaleY: 1
              })
            ]}
          >
            {activeTask ? (
              <div style={{width: '100%', maxWidth: '350px', transform: 'none'}} className="touch-none">
                <TaskCard
                  id={activeTask.id}
                  title={activeTask.title}
                  tag={getTagText(activeTask.type || "task")}
                  tagColor={getTagColor(activeTask.type || "task")}
                  taskId={activeTask.code || ""}
                  assignee={activeTask.assignedTo || ""}
                  completed={activeTask.status === "done" || activeTask.status === "closed"}
                  hideTag={false}
                  hideTaskId={!activeTask.code}
                  getAssignedUser={getAssignedUser}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Vista desktop con DnD específico */}
      <div className="hidden lg:block">
        <DndContext
          sensors={desktopSensors}
          collisionDetection={desktopCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always
            }
          }}
        >
          <DesktopKanbanView 
            tasks={tasks} 
            visibleColumns={visibleColumns} 
            getAssignedUser={getAssignedUser} 
            activeColumn={activeColumn}
            onToggleColumnVisibility={toggleColumnVisibility}
            visibleColumnCount={visibleColumnCount}
          />

          <DragOverlay 
            adjustScale={false} 
            zIndex={100}
            dropAnimation={null}
            modifiers={[
              ({transform}) => ({
                ...transform,
                scaleX: 1,
                scaleY: 1
              })
            ]}
          >
            {activeTask ? (
              <div style={{width: '100%', maxWidth: '350px', transform: 'none'}} className="touch-none">
                <TaskCard
                  id={activeTask.id}
                  title={activeTask.title}
                  tag={getTagText(activeTask.type || "task")}
                  tagColor={getTagColor(activeTask.type || "task")}
                  taskId={activeTask.code || ""}
                  assignee={activeTask.assignedTo || ""}
                  completed={activeTask.status === "done" || activeTask.status === "closed"}
                  hideTag={false}
                  hideTaskId={!activeTask.code}
                  getAssignedUser={getAssignedUser}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}