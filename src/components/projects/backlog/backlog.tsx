import { useState } from "react"
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Share2,
  Filter,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Task {
  id: string
  title: string
  type: "story" | "bug" | "task"
  status: string
  tag: string
  tagColor: string
  priority: "high" | "medium" | "low"
  assignee: {
    name: string
    avatar: string
    initials: string
  }
}

const tasks: Task[] = [
  {
    id: "TG-16",
    title: "Backlog - Backend",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "BACKLOG",
    tagColor: "bg-purple-100 text-purple-800",
    priority: "high",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-17",
    title: "Vista de Backlog - Frontend",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "BACKLOG",
    tagColor: "bg-purple-100 text-purple-800",
    priority: "medium",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-21",
    title: "Priorización de historias de usuario",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "ISSUES",
    tagColor: "bg-pink-100 text-pink-800",
    priority: "low",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-22",
    title: "Creación de historias de usuario",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "ISSUES",
    tagColor: "bg-pink-100 text-pink-800",
    priority: "medium",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-23",
    title: "Creación del proyecto - Backend",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "PROYECTOS",
    tagColor: "bg-violet-100 text-violet-800",
    priority: "high",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-24",
    title: "Creacion del proyecto - Frontend",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "PROYECTOS",
    tagColor: "bg-violet-100 text-violet-800",
    priority: "medium",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-26",
    title: "Project Management UI",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "UI/UX",
    tagColor: "bg-blue-100 text-blue-800",
    priority: "low",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-27",
    title: "Diseño responsive",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "UX/UI",
    tagColor: "bg-blue-100 text-blue-800",
    priority: "medium",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-28",
    title: "Notificaciones por correo electrónico",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "NOTIFICACIONES",
    tagColor: "bg-indigo-100 text-indigo-800",
    priority: "high",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-29",
    title: "Crear vista de burdowncharts",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "BURNDOWN CHART",
    tagColor: "bg-fuchsia-100 text-fuchsia-800",
    priority: "low",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-30",
    title: "Implementación de roles internos dentro de proyectos",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "PROYECTOS",
    tagColor: "bg-violet-100 text-violet-800",
    priority: "high",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
  {
    id: "TG-31",
    title: "AWS - RDS",
    type: "story",
    status: "TAREAS POR HACER",
    tag: "DEPLOYMENT",
    tagColor: "bg-rose-100 text-rose-800",
    priority: "medium",
    assignee: {
      name: "Karen G",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "KG",
    },
  },
]

const getPriorityIcon = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "↑"
    case "medium":
      return "→"
    case "low":
      return "↓"
    default:
      return "→"
  }
}

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "text-red-600"
    case "medium":
      return "text-yellow-600"
    case "low":
      return "text-green-600"
    default:
      return "text-gray-600"
  }
}

export function Backlog() {
  const [isSprintExpanded, setIsSprintExpanded] = useState(true)
  const [isBacklogExpanded, setIsBacklogExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 
        Si lo deseas, puedes sustituir "container" por un
        max-w-screen-xxl o similar para un control más fino.
      */}
      <main className="container mx-auto space-y-6 px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Buscar en el backlog"
              className="w-full bg-white pl-9 transition-shadow hover:shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select defaultValue="epic">
              <SelectTrigger className="w-[130px] bg-white">
                <SelectValue placeholder="Epic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="tipo">
              <SelectTrigger className="w-[130px] bg-white">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tipo">Tipo</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="bg-white">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Exportar a CSV</DropdownMenuItem>
                  <DropdownMenuItem>Imprimir backlog</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Sprint Actual */}
          <Card className="overflow-hidden">
            <CardHeader
              className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
              onClick={() => setIsSprintExpanded(!isSprintExpanded)}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isSprintExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </motion.div>
                  <span className="font-medium">Sprint Actual</span>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Añadir fechas
                  </Button>
                  <span className="text-sm text-gray-500">(1 incidencia)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {/* Badges de ejemplo */}
                    {[0, 0, 0].map((value, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className={i === 1 ? "bg-blue-100 hover:bg-blue-100" : ""}
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="secondary" size="sm" className="h-7">
                    Iniciar sprint
                  </Button>
                </div>
              </div>
            </CardHeader>
            <AnimatePresence>
              {isSprintExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="border-t p-4">
                    <ScrollArea className="h-full">
                      <div className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-4">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">TG-143</span>
                          <span className="text-sm">
                            fix: Scrollbar secundario de la sala poker causando
                            desfases en la UI
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            EN CURSO
                          </Badge>
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src="/placeholder.svg?height=32&width=32"
                              alt="KG"
                            />
                            <AvatarFallback>KG</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Backlog */}
          <Card>
            <CardHeader
              className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
              onClick={() => setIsBacklogExpanded(!isBacklogExpanded)}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isBacklogExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </motion.div>
                  <span className="font-medium">Backlog</span>
                  <span className="text-sm text-gray-500">
                    ({filteredTasks.length} incidencias)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    Planificar en la pizarra
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 bg-gray-100 px-1 text-[10px]"
                    >
                      PRUÉBALO
                    </Badge>
                  </Button>
                  <Button variant="secondary" size="sm" className="h-7">
                    Crear sprint
                  </Button>
                </div>
              </div>
            </CardHeader>
            <AnimatePresence>
              {isBacklogExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="border-t p-0">
                    {/* Ajusta la altura si deseas un scroll más preciso */}
                    <ScrollArea className="h-[calc(100vh-400px)]">
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          // Añadimos flex-wrap para evitar overflows
                          className="flex flex-col gap-4 border-b p-3 transition-colors hover:bg-gray-50 md:flex-row md:items-center md:justify-between md:flex-wrap"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <span className={getPriorityColor(task.priority)}>
                              {getPriorityIcon(task.priority)}
                            </span>
                            <span className="whitespace-nowrap text-sm font-medium">
                              {task.id}
                            </span>
                            <span className="truncate text-sm">
                              {task.title}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 ml-0 md:ml-8">
                            <Badge className={task.tagColor}>{task.tag}</Badge>
                            <Select defaultValue={task.status.toLowerCase()}>
                              <SelectTrigger className="h-8 w-[180px] bg-white">
                                <SelectValue placeholder={task.status} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="por-hacer">
                                  TAREAS POR HACER
                                </SelectItem>
                                <SelectItem value="en-curso">
                                  EN CURSO
                                </SelectItem>
                                <SelectItem value="completado">
                                  COMPLETADO
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                              />
                              <AvatarFallback>
                                {task.assignee.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <Button
            className="w-full justify-start gap-2 bg-white text-gray-500 hover:bg-gray-50"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Crear incidencia
          </Button>
        </div>
      </main>
    </div>
  )
}
