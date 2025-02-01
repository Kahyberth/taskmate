import * as React from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  type: "bug" | "task" | "story"
  priority: "low" | "medium" | "high"
  assignee: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "Por hacer",
    tasks: [
      {
        id: "TG-143",
        title: "Fix: Scrollbar secundario de la sala poker causando desfases en la UI",
        type: "bug",
        priority: "high",
        assignee: "KG",
      },
      {
        id: "TG-144",
        title: "Implementar autenticación con Google",
        type: "task",
        priority: "medium",
        assignee: "KG",
      },
      {
        id: "TG-145",
        title: "Diseñar nueva página de inicio",
        type: "story",
        priority: "low",
        assignee: "KG",
      },
    ],
  },
  {
    id: "in-progress",
    title: "En progreso",
    tasks: [
      {
        id: "TG-146",
        title: "Optimizar rendimiento de la aplicación",
        type: "task",
        priority: "high",
        assignee: "KG",
      },
      {
        id: "TG-147",
        title: "Integrar API de pagos",
        type: "story",
        priority: "medium",
        assignee: "KG",
      },
    ],
  },
  {
    id: "done",
    title: "Hecho",
    tasks: [
      {
        id: "TG-148",
        title: "Configurar CI/CD pipeline",
        type: "task",
        priority: "high",
        assignee: "KG",
      },
      {
        id: "TG-149",
        title: "Implementar dark mode",
        type: "story",
        priority: "low",
        assignee: "KG",
      },
    ],
  },
]

function TaskCard({ task, index }: { task: Task; index: number }) {
  const getPriorityColor = (priority: Task["priority"]) => {
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

  const getTypeIcon = (type: Task["type"]) => {
    switch (type) {
      case "bug":
        return "⊗"
      case "task":
        return "◇"
      case "story":
        return "○"
      default:
        return "◇"
    }
  }

  const getTypeColor = (type: Task["type"]) => {
    switch (type) {
      case "bug":
        return "text-red-600"
      case "task":
        return "text-green-600"
      case "story":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "mb-2 rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
            snapshot.isDragging && "shadow-lg",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={getTypeColor(task.type)}>{getTypeIcon(task.type)}</span>
              <span className="text-sm font-medium">{task.id}</span>
            </div>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
          <p className="mt-2 text-sm">{task.title}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-emerald-600 text-center text-xs text-white leading-6">
                {task.assignee}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  )
}

function Column({ column, tasks }: { column: Column; tasks: Task[] }) {
  return (
    <div className="flex h-full w-[320px] flex-col rounded-lg border bg-gray-50/50 p-2">
      <div className="mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{column.title}</h3>
          <Badge variant="secondary" className="bg-gray-100">
            {tasks.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 space-y-2 overflow-y-auto",
              "min-h-[200px]", // Add minimum height
              snapshot.isDraggingOver && "bg-blue-50/50", // Add visual feedback
              !tasks.length && "flex items-center justify-center", // Center placeholder text when empty
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {!tasks.length && <p className="text-sm text-gray-500">Arrastra las tarjetas aquí</p>}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export function Board() {
  const [columns, setColumns] = React.useState(initialColumns)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      const column = columns.find((col) => col.id === source.droppableId)
      if (!column) return

      const newTasks = Array.from(column.tasks)
      const [removed] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, removed)

      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return {
              ...col,
              tasks: newTasks,
            }
          }
          return col
        }),
      )
    } else {
      // Moving to a different column
      const sourceColumn = columns.find((col) => col.id === source.droppableId)
      const destColumn = columns.find((col) => col.id === destination.droppableId)
      if (!sourceColumn || !destColumn) return

      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = Array.from(destColumn.tasks)
      const [removed] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, removed)

      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return {
              ...col,
              tasks: sourceTasks,
            }
          }
          if (col.id === destination.droppableId) {
            return {
              ...col,
              tasks: destTasks,
            }
          }
          return col
        }),
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
    
      <main className="container flex-1 space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Buscar incidencias" className="pl-9 bg-white transition-shadow hover:shadow-md" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select defaultValue="sprint-1">
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Sprint 1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sprint-1">Sprint 1</SelectItem>
                <SelectItem value="sprint-2">Sprint 2</SelectItem>
                <SelectItem value="sprint-3">Sprint 3</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="bg-white">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <Column key={column.id} column={column} tasks={column.tasks} />
            ))}
            <Button
              variant="outline"
              className="flex h-[calc(100vh-220px)] w-[320px] flex-col items-center justify-center gap-2 border-2 border-dashed bg-gray-50/50"
            >
              <Plus className="h-5 w-5" />
              <span>Añadir columna</span>
            </Button>
          </div>
        </DragDropContext>
      </main>
    </div>
  )
}

