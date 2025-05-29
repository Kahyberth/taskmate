import { Check, FileText, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Task } from "@/interfaces/task.interface"

// Función para obtener el color de la etiqueta según el tipo de tarea
export const getTagColor = (type: Task["type"]) => {
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
export const getTagText = (type: Task["type"]) => {
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

interface KanbanColumnProps {
  title: string
  count: number
  status: Task["status"]
  tasks: Task[]
  children?: React.ReactNode
  showCheckmark?: boolean
  getAssignedUser?: (userId?: string) => { initials: string; name?: string; lastName?: string } | null
  isOptional?: boolean
  onToggleVisibility?: () => void
  isActive?: boolean
  isMobile?: boolean
}

export function KanbanColumn({
  title,
  count,
  status,
  tasks,
  children,
  showCheckmark = false,
  getAssignedUser,
  isOptional = false,
  onToggleVisibility,
  isActive = false,
  isMobile = false,
}: KanbanColumnProps) {
  const { setNodeRef } = useSortable({
    id: `column-${status}`,
    data: {
      type: "container",
      status,
    },
  })

  const getTitleColor = (status: Task["status"]) => {
    switch (status) {
      case "to-do":
        return "text-gray-600 dark:text-gray-200";
      case "in-progress":
        return "text-blue-600 dark:text-blue-300";
      case "review":
        return "text-yellow-600 dark:text-yellow-300";
      case "done":
        return "text-green-600 dark:text-green-300";
      case "closed":
        return "text-purple-600 dark:text-purple-300";
      default:
        return "text-gray-600 dark:text-gray-200";
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col rounded-md transition-all duration-200 h-full
        ${isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/50 dark:ring-blue-500/30' 
          : 'bg-gray-50 dark:bg-white/10'}
        ${isMobile ? 'mb-4' : ''}`}
      data-type="container"
      data-status={status}
    >
      <div className="flex items-center justify-between mb-4 px-2 h-8">
        <div className="flex items-center">
          <h2 className={`text-sm font-medium ${getTitleColor(status)} ${isActive ? 'text-blue-700 dark:text-blue-300' : ''}`}>
            {title}
          </h2>
          <Badge 
            variant="outline" 
            className={`ml-2 ${isActive 
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' 
              : 'bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`}
          >
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

      <div className={`space-y-3 flex-1 pb-16 px-2 overflow-y-auto min-h-[100px] ${isActive ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
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
  taskId?: string
  assignee?: string
  completed?: boolean
  hideTag?: boolean
  hideTaskId?: boolean
  isDragging?: boolean
  getAssignedUser?: (userId?: string) => { initials: string; name?: string; lastName?: string } | null
}

export function TaskCard({
  title,
  tag,
  tagColor,
  taskId = "",
  assignee = "",
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

export function SortableTaskCard(props: TaskCardProps) {
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