
import { useState, useRef } from "react"
import { Check, FileText, MoreHorizontal, Plus } from "lucide-react"
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
import type { Task } from "@/types/task"

// Initial data for the Kanban board
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Generación de Sprints",
    tag: "SPRINTS",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-33",
    assignee: "KG",
    status: "todo",
  },
  {
    id: "2",
    title: "Documentación de código",
    tag: "DOCUMENTACIÓN",
    tagColor: "bg-red-100 text-red-800",
    taskId: "TG-98",
    assignee: "KG",
    status: "todo",
  },
  {
    id: "3",
    title: "Manual de usuario",
    tag: "DOCUMENTACIÓN",
    tagColor: "bg-red-100 text-red-800",
    taskId: "TG-41",
    assignee: "KG",
    status: "todo",
  },
  {
    id: "4",
    title: "Asignación de miembros a un proyecto",
    tag: "PROYECTOS",
    tagColor: "bg-pink-100 text-pink-800",
    taskId: "TG-34",
    assignee: "KG",
    status: "todo",
  },
  {
    id: "5",
    title: "Implementación de roles internos dentro de proyectos",
    tag: "PROYECTOS",
    tagColor: "bg-pink-100 text-pink-800",
    taskId: "TG-30",
    assignee: "KG",
    status: "todo",
  },
  {
    id: "6",
    title: "Priorización de historias de usuario",
    tag: "ISSUES",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-21",
    assignee: "KG",
    status: "todo",
  },
  {
    id: "7",
    title: "Crear la funcionalidades del tablero",
    tag: "BOARD",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-87",
    assignee: "KG",
    status: "inProgress",
  },
  {
    id: "8",
    title: "Implementar la funcionalidad de discutir una tarea específica en el chat",
    tag: "CHAT",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-71",
    assignee: "KG",
    status: "inProgress",
  },
  {
    id: "9",
    title: "Notificaciones en la aplicación",
    tag: "NOTIFICACIONES",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-95",
    assignee: "KG",
    status: "inProgress",
  },
  {
    id: "10",
    title: "Modulo para registrar las horas trabajadas en un proyecto",
    tag: "NOTIFICACIONES",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-174",
    assignee: "KG",
    hideTag: true,
    status: "inProgress",
  },
  {
    id: "11",
    title: "Backlog - Backend",
    tag: "BACKLOG",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-16",
    assignee: "KG",
    status: "inProgress",
  },
  {
    id: "12",
    title: "Project Management UI",
    tag: "",
    tagColor: "",
    taskId: "TG-26",
    assignee: "KG",
    status: "inProgress",
  },
  {
    id: "13",
    title: "Notificaciones por correo electrónico",
    tag: "",
    tagColor: "",
    taskId: "",
    assignee: "",
    hideTaskId: true,
    status: "inProgress",
  },
  {
    id: "14",
    title: "Creación de historias de usuario",
    tag: "ISSUES",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-22",
    assignee: "KG",
    completed: true,
    status: "done",
  },
  {
    id: "15",
    title: "Asignación de miembros a una incidencia",
    tag: "ISSUES",
    tagColor: "bg-purple-100 text-purple-800",
    taskId: "TG-35",
    assignee: "KG",
    completed: true,
    status: "done",
  },
]

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  // Use a ref to track the target status during drag operations
  const targetStatusRef = useRef<{ id: string; status: "todo" | "inProgress" | "done" } | null>(null)

  // Get tasks by status
  const getTodoTasks = () => tasks.filter((task) => task.status === "todo")
  const getInProgressTasks = () => tasks.filter((task) => task.status === "inProgress")
  const getDoneTasks = () => tasks.filter((task) => task.status === "done")

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance required before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeTaskItem = tasks.find((task) => task.id === active.id)
    if (activeTaskItem) {
      setActiveTask(activeTaskItem)
      // Reset the target status ref at the start of a drag
      targetStatusRef.current = null
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      targetStatusRef.current = null
      return
    }

    // If we have a target status from dragOver, apply it now
    if (targetStatusRef.current && targetStatusRef.current.id === active.id) {
      setTasks(
        tasks.map((task) => (task.id === active.id ? { ...task, status: targetStatusRef.current!.status } : task)),
      )
    }
    // If the item was dropped in a different container
    else if (active.id !== over.id) {
      const activeTaskIndex = tasks.findIndex((task) => task.id === active.id)
      const overTaskIndex = tasks.findIndex((task) => task.id === over.id)

      if (activeTaskIndex !== -1 && overTaskIndex !== -1) {
        // Create a new array with the updated order
        const newTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex)
        setTasks(newTasks)
      }
    }

    setActiveTask(null)
    targetStatusRef.current = null
  }

  // Handle dropping in a different column - only track the target, don't update state yet
  const handleDragOver = (event: any) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id

    // If we're dragging over a container (column)
    if (over.data?.current?.type === "container") {
      const newStatus = over.data.current.status

      // Store the target status in the ref instead of updating state
      targetStatusRef.current = { id: activeId, status: newStatus }
    }
    // If we're dragging over another task
    else if (over.id !== activeId) {
      const overTask = tasks.find((task) => task.id === over.id)

      if (overTask) {
        // Store the target status in the ref instead of updating state
        targetStatusRef.current = { id: activeId, status: overTask.status }
      }
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* TO DO Column */}
          <KanbanColumn title="POR HACER" count={getTodoTasks().length} status="todo" tasks={getTodoTasks()} />

          {/* IN PROGRESS Column */}
          <KanbanColumn
            title="EN CURSO"
            count={getInProgressTasks().length}
            status="inProgress"
            tasks={getInProgressTasks()}
            showReview
          />

          {/* DONE Column */}
          <KanbanColumn
            title="LISTO"
            count={getDoneTasks().length}
            status="done"
            tasks={getDoneTasks()}
            showCheckmark
          />
        </div>

        {/* Drag Overlay - shows a preview of the dragged item */}
        <DragOverlay adjustScale={true} zIndex={100}>
          {activeTask ? (
            <div className="w-full max-w-[350px] opacity-80">
              <TaskCard
                id={activeTask.id}
                title={activeTask.title}
                tag={activeTask.tag}
                tagColor={activeTask.tagColor}
                taskId={activeTask.taskId}
                assignee={activeTask.assignee}
                completed={activeTask.completed}
                hideTag={activeTask.hideTag}
                hideTaskId={activeTask.hideTaskId}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-50"
      >
        <Plus className="h-5 w-5 text-gray-700" />
      </Button>
    </div>
  )
}

interface KanbanColumnProps {
  title: string
  count: number
  status: "todo" | "inProgress" | "done"
  tasks: Task[]
  children?: React.ReactNode
  showReview?: boolean
  showCheckmark?: boolean
}

function KanbanColumn({
  title,
  count,
  status,
  tasks,
  children,
  showReview = false,
  showCheckmark = false,
}: KanbanColumnProps) {
  // Make the column droppable
  const { setNodeRef } = useSortable({
    id: `column-${status}`,
    data: {
      type: "container",
      status,
    },
  })

  return (
    <div ref={setNodeRef} className="flex flex-col bg-gray-50 rounded-md transition-colors duration-200 h-full">
      <div className="flex items-center mb-4 px-2">
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        <Badge variant="outline" className="ml-2 bg-gray-200 text-gray-700 hover:bg-gray-200">
          {count}
        </Badge>
        {showReview && (
          <>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <div className="ml-2 text-sm text-blue-600 font-medium">REVIEW</div>
          </>
        )}
        {showCheckmark && <Check className="ml-auto h-5 w-5 text-green-500" />}
      </div>

      <div className="space-y-3 flex-1">
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              tag={task.tag}
              tagColor={task.tagColor}
              taskId={task.taskId}
              assignee={task.assignee}
              completed={task.completed}
              hideTag={task.hideTag}
              hideTaskId={task.hideTaskId}
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
}: TaskCardProps) {
  return (
    <Card className={`shadow-sm ${isDragging ? "shadow-md" : ""}`}>
      <CardHeader className="p-3 pb-0">
        <h3 className="text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="flex items-center">
          {!hideTag && tag && (
            <Badge variant="secondary" className={`text-xs font-medium ${tagColor}`}>
              {tag}
            </Badge>
          )}
          <div className="flex items-center ml-auto">
            {!hideTaskId && (
              <div className="flex items-center mr-2 text-gray-500">
                <FileText className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">{taskId}</span>
              </div>
            )}
            {completed && <Check className="h-4 w-4 text-green-500 mr-1" />}
            {assignee && (
              <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-medium">
                {assignee}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Sortable version of the TaskCard that can be dragged
function SortableTaskCard(props: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation cursor-grab active:cursor-grabbing"
    >
      <TaskCard {...props} isDragging={isDragging} />
    </div>
  )
}
