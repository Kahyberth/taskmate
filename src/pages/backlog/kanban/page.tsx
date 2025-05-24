import { useState, useRef, useEffect, useContext } from "react"
import { Check, FileText, MoreHorizontal, Plus, Minus, Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useParams } from "react-router-dom"
import { apiClient } from "@/api/client-gateway"
import { notifications } from "@mantine/notifications"
import { AuthContext } from "@/context/AuthContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useProjectById } from "@/api/queries"

// Definición del tipo Task basado en la estructura de los issues del backend
interface Task {
  id: string
  title: string
  description?: string
  type: 'bug' | 'feature' | 'task' | 'refactor' | 'user_story'
  status: 'to-do' | 'in-progress' | 'review' | 'done' | 'closed'
  code?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdBy: string
  acceptanceCriteria?: string
  productBacklogId?: string
  storyPoints?: number
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  finishedAt?: Date
}

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

// Mock team members for assignment
const teamMembers = [
  { id: "user-1", name: "Alex Johnson", initials: "AJ" },
  { id: "user-2", name: "Sam Taylor", initials: "ST" },
  { id: "user-3", name: "Jordan Lee", initials: "JL" },
  { id: "user-4", name: "Casey Morgan", initials: "CM" },
]

export default function KanbanBoard() {
  const { project_id } = useParams()
  const { user } = useContext(AuthContext)
  const { data: project, isLoading: isLoadingProject } = useProjectById(project_id)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [projectMembers, setProjectMembers] = useState<any[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  // Estado para controlar las columnas visibles
  const [visibleColumns, setVisibleColumns] = useState({
    review: false,
    closed: false
  })
  // Use a ref to track the target status during drag operations
  const targetStatusRef = useRef<{ id: string; status: Task["status"] } | null>(null)
  // Backup del estado anterior para rollback en caso de error
  const previousStateRef = useRef<Task[]>([])

  // Configurar sensores para detección de arrastre
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Distancia mínima requerida antes de activar
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Cargar tareas del backlog
  useEffect(() => {
    const fetchTasks = async () => {
      if (!project_id || !project) return
      
      setIsLoading(true)
      try {
        const response = await apiClient.get(`/projects/issues/${project_id}`)
        console.log('Response from API:', response.data);
        
        if (response.data && response.data.issues && Array.isArray(response.data.issues)) {
          const mappedTasks = response.data.issues.map((task: any) => {
            console.log('Processing task:', task);
            return {
              id: task.id,
              title: task.title,
              description: task.description || "",
              type: task.type || "user_story",
              status: task.status || "to-do",
              code: task.code || "",
              priority: task.priority || "medium",
              createdBy: task.createdBy || user?.id,
              acceptanceCriteria: task.acceptanceCriteria || "",
              productBacklogId: task.productBacklogId,
              storyPoints: task.story_points || 0,
              assignedTo: task.assignedTo,
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt),
              resolvedAt: task.resolvedAt ? new Date(task.resolvedAt) : undefined,
              finishedAt: task.finishedAt ? new Date(task.finishedAt) : undefined
            };
          });
          
          console.log('Mapped tasks:', mappedTasks);
          setTasks(mappedTasks);
        } else {
          console.warn('Response data is not in the expected format:', response.data);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
        notifications.show({
          title: "Error",
          message: "No se pudieron cargar las tareas del backlog",
          color: "red",
          autoClose: 2000,
        })
        setTasks([]);
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTasks()
  }, [project_id, project, user?.id])

  // Obtener tareas por estado
  const getTodoTasks = () => tasks.filter((task) => task.status === "to-do")
  const getInProgressTasks = () => tasks.filter((task) => task.status === "in-progress")
  const getDoneTasks = () => tasks.filter((task) => task.status === "done")
  const getReviewTasks = () => tasks.filter((task) => task.status === "review")
  const getClosedTasks = () => tasks.filter((task) => task.status === "closed")

  // Manejar inicio de arrastre
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeTaskItem = tasks.find((task) => task.id === active.id)
    if (activeTaskItem) {
      setActiveTask(activeTaskItem)
      // Guardar el estado actual para posible rollback
      previousStateRef.current = [...tasks]
      // Resetear el target status ref al inicio del arrastre
      targetStatusRef.current = null
    }
  }

  

  // Actualizar el estado de una tarea en el backend
  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    console.log("Updating task status:", taskId, newStatus)
    try {
      const response = await apiClient.patch(`/issues/update`, {
        id: taskId,
        status: newStatus,
        userId: user?.id,
      })
      
      if (response.data) {
        notifications.show({
          title: "Estado actualizado",
          message: "El estado de la tarea ha sido actualizado exitosamente",
          color: "green",
          autoClose: 2000,
        })
        return true
      }
      return false
    } catch (error) {
      console.error("Error updating task status:", error)
      notifications.show({
        title: "Error",
        message: "No se pudo actualizar el estado de la tarea",
        color: "red",
        autoClose: 2000,
      })
      return false
    }
  }

  // Manejar fin de arrastre
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      targetStatusRef.current = null
      return
    }

    // Si tenemos un target status de dragOver, aplicarlo ahora
    if (targetStatusRef.current && targetStatusRef.current.id === active.id) {
      const newStatus = targetStatusRef.current.status
      
      // Actualizar el estado localmente primero
      setTasks(
        tasks.map((task) => (task.id === active.id ? { ...task, status: newStatus } : task)),
      )
      
      // Intentar actualizar en el backend
      const success = await updateTaskStatus(active.id as string, newStatus)
      
      // Si falla, hacer rollback al estado anterior
      if (!success) {
        setTasks(previousStateRef.current)
      }
    }
    // Si el ítem se soltó en un contenedor diferente
    else if (active.id !== over.id) {
      const activeTaskIndex = tasks.findIndex((task) => task.id === active.id)
      const overTaskIndex = tasks.findIndex((task) => task.id === over.id)

      if (activeTaskIndex !== -1 && overTaskIndex !== -1) {
        // Crear un nuevo array con el orden actualizado
        const newTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex)
        setTasks(newTasks)
        
        // Aquí podríamos implementar la actualización del orden en el backend si es necesario
      }
    }

    setActiveTask(null)
    targetStatusRef.current = null
  }

  // Manejar soltar en una columna diferente - solo rastrear el objetivo, no actualizar el estado todavía
  const handleDragOver = (event: any) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id

    // Si estamos arrastrando sobre un contenedor (columna)
    if (over.data?.current?.type === "container") {
      const newStatus = over.data.current.status

      // Almacenar el estado objetivo en el ref en lugar de actualizar el estado
      targetStatusRef.current = { id: activeId, status: newStatus }
    }
    // Si estamos arrastrando sobre otra tarea
    else if (over.id !== activeId) {
      const overTask = tasks.find((task) => task.id === over.id)

      if (overTask) {
        // Almacenar el estado objetivo en el ref en lugar de actualizar el estado
        targetStatusRef.current = { id: activeId, status: overTask.status }
      }
    }
  }

  // Función para obtener el usuario asignado
  const getAssignedUser = (userId?: string) => {
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
    
    
    // Fallback a miembros de ejemplo si no se encuentra en los miembros del proyecto
    const mockMember = teamMembers.find((member) => member.id === userId);
    return mockMember 
      ? { initials: mockMember.initials, name: mockMember.name, lastName: '' } 
      : { initials: 'U', name: 'Usuario', lastName: '' };
  }

  // Función para cargar los miembros del proyecto
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
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar los miembros del proyecto",
        color: "red",
        autoClose: 2000,
      });
      // Fallback to empty array
      setProjectMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Cargar miembros del proyecto cuando se carga el componente
  useEffect(() => {
    if (project_id) {
      fetchProjectMembers();
    }
  }, [project_id]);

  // Calculamos la cantidad de columnas visibles para aplicar el estilo dinámicamente
  const visibleColumnCount = 3 + 
    (visibleColumns.review ? 1 : 0) + 
    (visibleColumns.closed ? 1 : 0);
  
  // Generamos un string para grid-template-columns basado en el número de columnas
  const gridTemplateColumns = `repeat(${visibleColumnCount}, minmax(0, 1fr))`;

  if (isLoadingProject || isLoading) {
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

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold dark:text-white">Tablero Kanban</h1>
          <div className="flex items-center gap-2">
            {!visibleColumns.review && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVisibleColumns(prev => ({ ...prev, review: true }))}
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
                      onClick={() => setVisibleColumns(prev => ({ ...prev, closed: true }))}
                      className="h-8 px-2 gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Agregar columna de bloqueados</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* En pantallas pequeñas usamos grid-cols-1, en pantallas medianas y grandes usamos grid dinámico */}
        <div className="grid grid-cols-1 md:hidden gap-4 h-full min-h-[600px] border border-black/10 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-black/20 shadow-sm mb-8">
          {/* TO DO Column */}
          <KanbanColumn 
            title="TO-DO" 
            count={getTodoTasks().length} 
            status="to-do" 
            tasks={getTodoTasks()} 
            getAssignedUser={getAssignedUser}
          />

          {/* IN PROGRESS Column */}
          <KanbanColumn
            title="IN-PROGRESS"
            count={getInProgressTasks().length}
            status="in-progress"
            tasks={getInProgressTasks()}
            getAssignedUser={getAssignedUser}
          />

          {/* REVIEW Column (Optional) */}
          {visibleColumns.review && (
            <KanbanColumn
              title="REVIEW"
              count={getReviewTasks().length}
              status="review"
              tasks={getReviewTasks()}
              getAssignedUser={getAssignedUser}
              isOptional={true}
              onToggleVisibility={() => setVisibleColumns(prev => ({ ...prev, review: false }))}
            />
          )}

          {/* closed Column (Optional) */}
          {visibleColumns.closed && (
            <KanbanColumn
              title="CLOSED"
              count={getClosedTasks().length}
              status="closed"
              tasks={getClosedTasks()}
              getAssignedUser={getAssignedUser}
              isOptional={true}
              onToggleVisibility={() => setVisibleColumns(prev => ({ ...prev, blocked: false }))}
            />
          )}

          {/* DONE Column */}
          <KanbanColumn
            title="DONE"
            count={getDoneTasks().length}
            status="done"
            tasks={getDoneTasks()}
            showCheckmark
            getAssignedUser={getAssignedUser}
          />
        </div>

        {/* Versión de pantallas medianas y grandes con grid dinámico */}
        <div className="hidden md:grid gap-4 h-full min-h-[600px] border border-black/10 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-black/20 shadow-sm mb-8" 
             style={{ gridTemplateColumns }}>
          {/* TO DO Column */}
          <KanbanColumn 
            title="TO-DO" 
            count={getTodoTasks().length} 
            status="to-do" 
            tasks={getTodoTasks()} 
            getAssignedUser={getAssignedUser}
          />

          {/* IN PROGRESS Column */}
          <KanbanColumn
            title="IN-PROGRESS"
            count={getInProgressTasks().length}
            status="in-progress"
            tasks={getInProgressTasks()}
            getAssignedUser={getAssignedUser}
          />

          {/* REVIEW Column (Optional) */}
          {visibleColumns.review && (
            <KanbanColumn
              title="REVIEW"
              count={getReviewTasks().length}
              status="review"
              tasks={getReviewTasks()}
              getAssignedUser={getAssignedUser}
              isOptional={true}
              onToggleVisibility={() => setVisibleColumns(prev => ({ ...prev, review: false }))}
            />
          )}

          {/* BLOCKED Column (Optional) */}
          {visibleColumns.closed && (
            <KanbanColumn
              title="CLOSED"
              count={getClosedTasks().length}
              status="closed"
              tasks={getClosedTasks()}
              getAssignedUser={getAssignedUser}
              isOptional={true}
              onToggleVisibility={() => setVisibleColumns(prev => ({ ...prev, blocked: false }))}
            />
          )}

          {/* DONE Column */}
          <KanbanColumn
            title="DONE"
            count={getDoneTasks().length}
            status="done"
            tasks={getDoneTasks()}
            showCheckmark
            getAssignedUser={getAssignedUser}
          />
        </div>

        {/* Drag Overlay - muestra una vista previa del elemento arrastrado */}
        <DragOverlay adjustScale={false} zIndex={100}>
          {activeTask ? (
            <div className="w-full max-w-[350px] opacity-90">
              <Card className="shadow-lg dark:border-white/10">
                <CardHeader className="p-3 pb-0">
                  <h3 className="text-sm font-medium dark:text-white line-clamp-2">{activeTask.title}</h3>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="flex items-center">
                    <Badge variant="secondary" className={`text-xs font-medium ${getTagColor(activeTask.type)}`}>
                      {getTagText(activeTask.type)}
                    </Badge>
                    <div className="flex items-center ml-auto">
                      {activeTask.code && (
                        <div className="flex items-center mr-2 text-gray-500 dark:text-gray-400">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">{activeTask.code}</span>
                        </div>
                      )}
                      {(activeTask.status === "done" || activeTask.status === "closed") && (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      {activeTask.assignedTo && getAssignedUser(activeTask.assignedTo) && (
                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                          {getAssignedUser(activeTask.assignedTo)?.initials}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

    </div>
  )
}

interface KanbanColumnProps {
  title: string
  count: number
  status: Task["status"]
  tasks: Task[]
  children?: React.ReactNode
  showReview?: boolean
  showCheckmark?: boolean
  getAssignedUser?: (userId?: string) => { initials: string; name?: string; lastName?: string } | null
  isOptional?: boolean
  onToggleVisibility?: () => void
}

function KanbanColumn({
  title,
  count,
  status,
  tasks,
  children,
  showReview = false,
  showCheckmark = false,
  getAssignedUser,
  isOptional = false,
  onToggleVisibility,
}: KanbanColumnProps) {
  // Hacer la columna droppable
  const { setNodeRef } = useSortable({
    id: `column-${status}`,
    data: {
      type: "container",
      status,
    },
  })

  // Función para obtener el color del título según el estado
  const getTitleColor = (status: Task["status"]) => {
    switch (status) {
      case "to-do":
        return "text-gray-600 dark:text-gray-200";
      case "in-progress":
        return "text-blue-600 dark:text-blue-300";
      case "review":
        return "text-yellow-600 dark:text-yellow-300";
      case "closed":
        return "text-red-600 dark:text-red-300";
      case "done":
        return "text-green-600 dark:text-green-300";
      default:
        return "text-gray-600 dark:text-gray-200";
    }
  };

  return (
    <div ref={setNodeRef} className="flex flex-col bg-gray-50 dark:bg-white/10 rounded-md transition-colors duration-200 h-full">
      <div className="flex items-center justify-between mb-4 px-2 h-8">
        <div className="flex items-center">
          <h2 className={`text-sm font-medium ${getTitleColor(status)}`}>{title}</h2>
        <Badge variant="outline" className="ml-2 bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50">
          {count}
        </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isOptional && onToggleVisibility && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-700/30"
              onClick={onToggleVisibility}
            >
              <Minus className="h-4 w-4" />
            </Button>
        )}
          {showCheckmark && <Check className="h-5 w-5 text-green-500" />}
        </div>
      </div>

      <div className="space-y-3 flex-1 pb-16 px-2 overflow-y-auto">
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              tag={getTagText(task.type)}
              tagColor={getTagColor(task.type)}
              taskId={task.code || ""}
              assignee={task.assignedTo || ""}
              completed={task.status === "done" || task.status === "closed"}
              hideTag={false}
              hideTaskId={!task.code}
              getAssignedUser={getAssignedUser}
            />
          ))}
        </SortableContext>
        {children}
      </div>
    </div>
  )
}

interface TaskCardProps {
  id: string
  title: string
  tag: string
  tagColor: string
  taskId: string
  assignee: string
  completed?: boolean
  hideTag?: boolean
  hideTaskId?: boolean
  isDragging?: boolean
  getAssignedUser?: (userId?: string) => { initials: string; name?: string; lastName?: string } | null
}

function TaskCard({
  id,
  title,
  tag,
  tagColor,
  taskId,
  assignee,
  completed = false,
  hideTag = false,
  hideTaskId = false,
  isDragging = false,
  getAssignedUser,
}: TaskCardProps) {
  const assignedUser = getAssignedUser ? getAssignedUser(assignee) : null;

  return (
    <Card className={`
      ${isDragging ? 'opacity-50' : ''}
      hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200
      cursor-grab active:cursor-grabbing
      w-full dark:border-white/10
    `}>
      <CardHeader className="p-3 pb-0">
        <h3 className="text-sm font-medium line-clamp-2 dark:text-white">{title}</h3>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {!hideTag && (
            <Badge variant="secondary" className={`text-xs font-medium ${tagColor} whitespace-nowrap`}>
              {tag}
            </Badge>
          )}
          <div className="flex items-center ml-auto gap-2">
            {!hideTaskId && taskId && (
              <div className="flex items-center text-gray-500 dark:text-gray-400 min-w-[60px]">
                <FileText className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="text-xs truncate">{taskId}</span>
              </div>
            )}
            {completed && <Check className="h-4 w-4 text-green-500 flex-shrink-0" />}
            {assignedUser && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {assignedUser.initials}
              </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{assignedUser.name} {assignedUser.lastName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SortableTaskCard(props: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-full">
      <TaskCard {...props} isDragging={isDragging} />
    </div>
  );
}