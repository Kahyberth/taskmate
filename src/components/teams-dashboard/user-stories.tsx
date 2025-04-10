import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  Tag,
  Calendar,
  BarChart2,
  ArrowUpCircle,
  Circle,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos para las historias de usuario
type UserStoryStatus = "todo" | "in-progress" | "completed";
type UserStoryPriority = "high" | "medium" | "low";

interface UserStory {
  id: number;
  title: string;
  description: string;
  status: UserStoryStatus;
  priority: UserStoryPriority;
  points: number;
  assignedTo: {
    name: string;
    avatar: string;
    initials: string;
  };
  createdBy: {
    name: string;
    avatar: string;
    initials: string;
  };
  createdAt: string;
  dueDate: string;
  tags: string[];
  acceptanceCriteria: string[];
  comments: number;
  attachments: number;
}

// Datos de ejemplo
const userStories: UserStory[] = [
  {
    id: 1001,
    title: "Implementar autenticación de usuarios con OAuth",
    description:
      "Como usuario, quiero poder iniciar sesión con mi cuenta de Google o GitHub para acceder rápidamente a la plataforma sin crear una nueva cuenta.",
    status: "in-progress",
    priority: "high",
    points: 8,
    assignedTo: {
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YO",
    },
    createdBy: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    createdAt: "2025-03-10",
    dueDate: "2025-03-25",
    tags: ["Autenticación", "Frontend", "API"],
    acceptanceCriteria: [
      "El usuario puede iniciar sesión con Google",
      "El usuario puede iniciar sesión con GitHub",
      "Se muestra un mensaje de error apropiado si falla la autenticación",
      "Se redirige al dashboard después del inicio de sesión exitoso",
    ],
    comments: 5,
    attachments: 2,
  },
  {
    id: 1002,
    title: "Diseñar e implementar panel de estadísticas para administradores",
    description:
      "Como administrador, quiero ver estadísticas clave de uso de la plataforma para tomar decisiones basadas en datos.",
    status: "todo",
    priority: "medium",
    points: 5,
    assignedTo: {
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YO",
    },
    createdBy: {
      name: "Jessica Patel",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JP",
    },
    createdAt: "2025-03-12",
    dueDate: "2025-03-30",
    tags: ["Dashboard", "Analytics", "UI/UX"],
    acceptanceCriteria: [
      "Mostrar gráficos de usuarios activos por día/semana/mes",
      "Mostrar tasa de conversión de usuarios",
      "Permitir exportar datos en formato CSV",
      "Implementar filtros por fecha",
    ],
    comments: 3,
    attachments: 1,
  },
  {
    id: 1003,
    title: "Optimizar tiempos de carga en la página de productos",
    description:
      "Como usuario, quiero que la página de productos cargue rápidamente para mejorar mi experiencia de navegación.",
    status: "completed",
    priority: "high",
    points: 3,
    assignedTo: {
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YO",
    },
    createdBy: {
      name: "Michael Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MR",
    },
    createdAt: "2025-03-05",
    dueDate: "2025-03-15",
    tags: ["Performance", "Frontend", "Optimización"],
    acceptanceCriteria: [
      "Tiempo de carga reducido a menos de 2 segundos",
      "Implementar lazy loading para imágenes",
      "Optimizar consultas a la base de datos",
      "Implementar caché del lado del cliente",
    ],
    comments: 7,
    attachments: 0,
  },
  {
    id: 1004,
    title: "Implementar funcionalidad de búsqueda avanzada",
    description:
      "Como usuario, quiero poder realizar búsquedas avanzadas con filtros para encontrar rápidamente lo que necesito.",
    status: "todo",
    priority: "medium",
    points: 5,
    assignedTo: {
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YO",
    },
    createdBy: {
      name: "Emily Taylor",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ET",
    },
    createdAt: "2025-03-14",
    dueDate: "2025-04-05",
    tags: ["Búsqueda", "UX", "Frontend"],
    acceptanceCriteria: [
      "Permitir búsqueda por palabras clave",
      "Implementar filtros por categoría, precio y valoración",
      "Mostrar sugerencias de búsqueda mientras el usuario escribe",
      "Guardar búsquedas recientes",
    ],
    comments: 2,
    attachments: 1,
  },
  {
    id: 1005,
    title: "Crear API para integración con sistemas externos",
    description:
      "Como desarrollador externo, quiero poder integrar mi sistema con la plataforma a través de una API bien documentada.",
    status: "in-progress",
    priority: "low",
    points: 13,
    assignedTo: {
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YO",
    },
    createdBy: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "DK",
    },
    createdAt: "2025-03-08",
    dueDate: "2025-04-10",
    tags: ["API", "Backend", "Documentación"],
    acceptanceCriteria: [
      "Crear endpoints RESTful para recursos principales",
      "Implementar autenticación OAuth para la API",
      "Crear documentación completa con Swagger",
      "Implementar límites de tasa para prevenir abusos",
      "Crear ejemplos de código para lenguajes populares",
    ],
    comments: 8,
    attachments: 3,
  },
];

export default function UserStories() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  // Filtrar historias por estado y búsqueda
  const filteredStories = userStories.filter((story) => {
    const matchesStatus =
      selectedStatus === "all" || story.status === selectedStatus;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Contar historias por estado
  const todoCount = userStories.filter(
    (story) => story.status === "todo"
  ).length;
  const inProgressCount = userStories.filter(
    (story) => story.status === "in-progress"
  ).length;
  const completedCount = userStories.filter(
    (story) => story.status === "completed"
  ).length;

  // Función para obtener el color y el icono según el estado
  const getStatusDetails = (status: UserStoryStatus) => {
    switch (status) {
      case "todo":
        return {
          color: "text-slate-500",
          bgColor: "bg-slate-100",
          icon: <Circle className="h-4 w-4 text-slate-500" />,
          label: "Por hacer",
        };
      case "in-progress":
        return {
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          label: "En progreso",
        };
      case "completed":
        return {
          color: "text-green-500",
          bgColor: "bg-green-100",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          label: "Completada",
        };
      default:
        return {
          color: "text-slate-500",
          bgColor: "bg-slate-100",
          icon: <Circle className="h-4 w-4" />,
          label: "Desconocido",
        };
    }
  };

  // Función para obtener detalles de prioridad
  const getPriorityDetails = (priority: UserStoryPriority) => {
    switch (priority) {
      case "high":
        return {
          color: "text-red-500",
          bgColor: "bg-red-100",
          icon: <ArrowUpCircle className="h-4 w-4 text-red-500" />,
          label: "Alta",
        };
      case "medium":
        return {
          color: "text-amber-500",
          bgColor: "bg-amber-100",
          icon: <ArrowUpCircle className="h-4 w-4 text-amber-500" />,
          label: "Media",
        };
      case "low":
        return {
          color: "text-green-500",
          bgColor: "bg-green-100",
          icon: <ArrowUpCircle className="h-4 w-4 text-green-500" />,
          label: "Baja",
        };
      default:
        return {
          color: "text-slate-500",
          bgColor: "bg-slate-100",
          icon: <ArrowUpCircle className="h-4 w-4" />,
          label: "Desconocida",
        };
    }
  };

  // Calcular el progreso total
  const totalPoints = userStories.reduce((sum, story) => sum + story.points, 0);
  const completedPoints = userStories
    .filter((story) => story.status === "completed")
    .reduce((sum, story) => sum + story.points, 0);
  const progressPercentage = Math.round((completedPoints / totalPoints) * 100);

  return (
    <Card className="border bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
              Historias de Usuario Asignadas
            </CardTitle>
            <CardDescription>
              Gestiona y visualiza tus historias de usuario
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar historias..."
                className="pl-8 w-full bg-background/50 border-border/50 focus:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px] bg-background/50 border-border/50 focus:bg-background">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="todo">Por hacer</SelectItem>
                <SelectItem value="in-progress">En progreso</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-card/50 p-4 rounded-xl border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Progreso Total
              </p>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart2 className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  {completedPoints} de {totalPoints} puntos
                </span>
                <span className="text-sm font-medium">
                  {progressPercentage}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{userStories.length} historias asignadas</span>
              <span>{completedCount} completadas</span>
            </div>
          </div>

          <div className="bg-card/50 p-4 rounded-xl border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">
                Estado de Historias
              </p>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 rounded-lg bg-slate-100">
                <Circle className="h-5 w-5 text-slate-500 mb-1" />
                <span className="text-lg font-bold">{todoCount}</span>
                <span className="text-xs text-muted-foreground">Por hacer</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-lg font-bold">{inProgressCount}</span>
                <span className="text-xs text-muted-foreground">
                  En progreso
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                <span className="text-lg font-bold">{completedCount}</span>
                <span className="text-xs text-muted-foreground">
                  Completadas
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card/50 p-4 rounded-xl border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">
                Próximas Fechas
              </p>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              {userStories
                .filter((story) => story.status !== "completed")
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
                )
                .slice(0, 2)
                .map((story) => (
                  <div
                    key={story.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="flex items-center">
                      {getStatusDetails(story.status).icon}
                      <span className="text-sm ml-2 truncate max-w-[60vw] sm:max-w-[150px]">
                        {story.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(story.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="board">Tablero</TabsTrigger>
          </TabsList>

          <TabsContent
            value="list"
            className="animate-in fade-in-50 duration-300"
          >
            <div className="space-y-3">
              {filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <Dialog key={story.id}>
                    <DialogTrigger asChild>
                      <div
                        className="border rounded-lg p-4 bg-card/50 hover:bg-card/80 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedStory(story)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-3">
                              {getStatusDetails(story.status).icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{story.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {story.description}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge
                            variant="outline"
                            className={`${
                              getPriorityDetails(story.priority).bgColor
                            } text-xs`}
                          >
                            {getPriorityDetails(story.priority).icon}
                            <span className="ml-1">
                              {getPriorityDetails(story.priority).label}
                            </span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-xs"
                          >
                            {story.points} puntos
                          </Badge>
                          {story.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-background/50 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {story.tags.length > 2 && (
                            <Badge
                              variant="outline"
                              className="bg-background/50 text-xs"
                            >
                              +{story.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>
                              Vence:{" "}
                              {new Date(story.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={story.assignedTo.avatar} />
                              <AvatarFallback className="text-[10px]">
                                {story.assignedTo.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={`${
                              getStatusDetails(story.status).bgColor
                            } ${getStatusDetails(story.status).color}`}
                          >
                            {getStatusDetails(story.status).label}
                          </Badge>
                          <Badge
                            className={`${
                              getPriorityDetails(story.priority).bgColor
                            } ${getPriorityDetails(story.priority).color}`}
                          >
                            Prioridad:{" "}
                            {getPriorityDetails(story.priority).label}
                          </Badge>
                          <Badge variant="outline">{story.points} puntos</Badge>
                        </div>
                        <DialogTitle>{story.title}</DialogTitle>
                        <DialogDescription>
                          ID: {story.id} • Creada el{" "}
                          {new Date(story.createdAt).toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Descripción</h4>
                          <p className="text-sm text-muted-foreground">
                            {story.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Asignada a
                            </h4>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={story.assignedTo.avatar} />
                                <AvatarFallback>
                                  {story.assignedTo.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {story.assignedTo.name}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Creada por
                            </h4>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={story.createdBy.avatar} />
                                <AvatarFallback>
                                  {story.createdBy.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {story.createdBy.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Etiquetas</h4>
                          <div className="flex flex-wrap gap-2">
                            {story.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-primary/5"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">
                            Criterios de aceptación
                          </h4>
                          <ul className="space-y-1">
                            {story.acceptanceCriteria.map((criteria, index) => (
                              <li
                                key={index}
                                className="text-sm flex items-start"
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span>{criteria}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">
                              Fecha de creación
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(story.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">
                              Fecha de vencimiento
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(story.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="flex justify-between items-center">
                        <DialogClose asChild>
                          <Button>Cerrar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">
                    No se encontraron historias
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Intenta cambiar los filtros o la búsqueda
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="board"
            className="animate-in fade-in-50 duration-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center">
                    <Circle className="h-4 w-4 text-slate-500 mr-2" />
                    <h3 className="font-medium">Por hacer</h3>
                  </div>
                  <Badge variant="outline" className="bg-slate-100">
                    {todoCount}
                  </Badge>
                </div>

                {filteredStories
                  .filter((story) => story.status === "todo")
                  .map((story) => (
                    <Dialog key={story.id}>
                      <DialogTrigger asChild>
                        <div
                          className="border rounded-lg p-3 bg-card/50 hover:bg-card/80 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedStory(story)}
                        >
                          <h4 className="font-medium text-sm">{story.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {story.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge
                              variant="outline"
                              className={`${
                                getPriorityDetails(story.priority).bgColor
                              } text-xs`}
                            >
                              {getPriorityDetails(story.priority).label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-primary/5 text-xs"
                            >
                              {story.points} pts
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                            <span className="text-xs text-muted-foreground">
                              {new Date(story.dueDate).toLocaleDateString()}
                            </span>
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={story.assignedTo.avatar} />
                              <AvatarFallback className="text-[10px]">
                                {story.assignedTo.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </DialogTrigger>
                    </Dialog>
                  ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="font-medium">En progreso</h3>
                  </div>
                  <Badge variant="outline" className="bg-blue-100">
                    {inProgressCount}
                  </Badge>
                </div>

                {filteredStories
                  .filter((story) => story.status === "in-progress")
                  .map((story) => (
                    <Dialog key={story.id}>
                      <DialogTrigger asChild>
                        <div
                          className="border rounded-lg p-3 bg-card/50 hover:bg-card/80 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedStory(story)}
                        >
                          <h4 className="font-medium text-sm">{story.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {story.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge
                              variant="outline"
                              className={`${
                                getPriorityDetails(story.priority).bgColor
                              } text-xs`}
                            >
                              {getPriorityDetails(story.priority).label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-primary/5 text-xs"
                            >
                              {story.points} pts
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                            <span className="text-xs text-muted-foreground">
                              {new Date(story.dueDate).toLocaleDateString()}
                            </span>
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={story.assignedTo.avatar} />
                              <AvatarFallback className="text-[10px]">
                                {story.assignedTo.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </DialogTrigger>
                    </Dialog>
                  ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <h3 className="font-medium">Completadas</h3>
                  </div>
                  <Badge variant="outline" className="bg-green-100">
                    {completedCount}
                  </Badge>
                </div>

                {filteredStories
                  .filter((story) => story.status === "completed")
                  .map((story) => (
                    <Dialog key={story.id}>
                      <DialogTrigger asChild>
                        <div
                          className="border rounded-lg p-3 bg-card/50 hover:bg-card/80 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedStory(story)}
                        >
                          <h4 className="font-medium text-sm">{story.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {story.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge
                              variant="outline"
                              className={`${
                                getPriorityDetails(story.priority).bgColor
                              } text-xs`}
                            >
                              {getPriorityDetails(story.priority).label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-primary/5 text-xs"
                            >
                              {story.points} pts
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                            <span className="text-xs text-muted-foreground">
                              {new Date(story.dueDate).toLocaleDateString()}
                            </span>
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={story.assignedTo.avatar} />
                              <AvatarFallback className="text-[10px]">
                                {story.assignedTo.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </DialogTrigger>
                    </Dialog>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
