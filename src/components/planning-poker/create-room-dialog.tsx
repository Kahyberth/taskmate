import { useEffect, useState, useContext, FormEvent } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { VotingScale } from "@/enums/room-scale.enum";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { Loader } from "@mantine/core";
import { AuthContext } from "@/context/AuthContext";
import { apiClient } from "@/api/client-gateway";

// Interfaz para proyectos
interface Project {
  id: number;
  name: string;
}

// Interfaz para historias de usuario
interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: string;
}

export function CreateRoomDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useContext(AuthContext);
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [votingScale, setVotingScale] = useState<VotingScale>(
    VotingScale.FIBONACCI
  );
  const [requireCode, setRequireCode] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [loadAllStories, setLoadAllStories] = useState(true);
  const [selectedStories, setSelectedStories] = useState<UserStory[]>([]);
  console.log("ID: ", user?.id)

 

  // 2. Cargar proyectos al montar el componente
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/`);
        // setProjects(response.data);
        // if (response.data.length > 0) {
        //   setSelectedProjectId(response.data[0].id);
        // }

        setProjects([
          { id: 1, name: "Proyecto Alfa" },
          { id: 2, name: "Proyecto Beta" },
          { id: 3, name: "Proyecto Gamma" },
          { id: 4, name: "Proyecto Delta" },
          { id: 5, name: "Proyecto Epsilon" },
          { id: 6, name: "Proyecto Zeta" },
          { id: 7, name: "Proyecto Eta" },
          { id: 8, name: "Proyecto Theta" },
          { id: 9, name: "Proyecto Iota" },
          { id: 10, name: "Proyecto Kappa" },
        ]);

        setSelectedProjectId("1");
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      }
    };

    fetchProjects();
  }, []);

  // 3. Cargar historias de usuario según el proyecto seleccionado
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchUserStories = async () => {
      try {
        // const response = await axios.get(
        //   `${import.meta.env.VITE_API_URL}/projects/stories/${selectedProjectId}`
        // );
        // setUserStories(response.data);

        setUserStories([
          {
            id: "1",
            title: "Implement user authentication",
            description:
              "As a user, I want to be able to securely log in so that my data remains protected.",
            priority: "High",
          },
          {
            id: "2",
            title: "Create dashboard layout",
            description:
              "As a user, I want to see a clear overview of my tasks and activities so that I can manage my work efficiently.",
            priority: "Medium",
          },
          {
            id: "3",
            title: "Login page design",
            description:
              "As a user, I want to see a beautiful login page so that I feel confident using the application.",
            priority: "Low",
          },
          {
            id: "4",
            title: "Enable two-factor authentication",
            description:
              "As a user, I want to enable two-factor authentication so that my account is more secure.",
            priority: "High",
          },
          {
            id: "5",
            title: "Add dark mode to the dashboard",
            description:
              "As a user, I want to use a dark mode option on the dashboard so that I can reduce eye strain.",
            priority: "Medium",
          },
          {
            id: "6",
            title: "Customize login page with branding",
            description:
              "As a business owner, I want the login page to reflect my company's branding so that users recognize my brand.",
            priority: "Low",
          },
          {
            id: "7",
            title: "Implement password recovery system",
            description:
              "As a user, I want to recover my password easily if I forget it so that I don't lose access to my account.",
            priority: "High",
          },
          {
            id: "8",
            title: "Add real-time notifications to the dashboard",
            description:
              "As a user, I want to receive real-time notifications on the dashboard so that I stay updated on important events.",
            priority: "Medium",
          },
          {
            id: "9",
            title: "Optimize login page for mobile devices",
            description:
              "As a user, I want the login page to work seamlessly on my phone so that I can access the app from anywhere.",
            priority: "Low",
          },
          {
            id: "10",
            title: "Integrate social media login",
            description:
              "As a user, I want to log in using my social media accounts so that I don’t have to remember another username or password.",
            priority: "High",
          },
          {
            id: "11",
            title: "Provide dashboard customization options",
            description:
              "As a user, I want to customize the layout of my dashboard so that I can prioritize the information most relevant to me.",
            priority: "Medium",
          },
          {
            id: "12",
            title: "Add animations to the login page",
            description:
              "As a user, I want to see smooth animations on the login page so that the experience feels modern and engaging.",
            priority: "Low",
          },
          {
            id: "13",
            title: "Implement session timeout feature",
            description:
              "As a user, I want my session to automatically log out after a period of inactivity so that my account stays secure.",
            priority: "High",
          },
          {
            id: "14",
            title: "Display recent activity on the dashboard",
            description:
              "As a user, I want to see my recent activity on the dashboard so that I can quickly review my actions.",
            priority: "Medium",
          },
          {
            id: "15",
            title: "Ensure accessibility compliance for the login page",
            description:
              "As a user with disabilities, I want the login page to be accessible so that I can use the application without barriers.",
            priority: "Low",
          },
          {
            id: "16",
            title: "Allow multiple login attempts with warnings",
            description:
              "As a user, I want to be warned after multiple failed login attempts so that I know my account might be at risk.",
            priority: "High",
          },
          {
            id: "17",
            title: "Show weather updates on the dashboard",
            description:
              "As a user, I want to see weather updates on my dashboard so that I can plan my day accordingly.",
            priority: "Medium",
          },
          {
            id: "18",
            title: "Include a 'Remember Me' option on the login page",
            description:
              "As a user, I want the option to be remembered on the login page so that I don’t have to log in every time.",
            priority: "Low",
          },
          {
            id: "19",
            title: "Log failed login attempts for security audits",
            description:
              "As an admin, I want to track failed login attempts so that I can identify potential security threats.",
            priority: "High",
          },
          {
            id: "20",
            title: "Highlight urgent tasks on the dashboard",
            description:
              "As a user, I want urgent tasks to be highlighted on the dashboard so that I can prioritize them effectively.",
            priority: "Medium",
          },
        ]);
      } catch (error) {
        console.error("Error al cargar historias de usuario:", error);
      }
    };

    fetchUserStories();
  }, [selectedProjectId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader color="grape" type="dots" />
      </div>
    );
  }
  
  const handleStorySelection = (story: UserStory) => {
    setSelectedStories((prev) =>
      prev.some((s) => s.id === story.id)
        ? prev.filter((s) => s.id !== story.id)
        : [...prev, story]
    );
  };

  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Creando sala con los siguientes datos:");

    try {
      await apiClient.post('/poker/create-session',
        {
          session_name: roomName,
          description,
          project_id: selectedProjectId,
          voting_scale: votingScale,
          created_by: user?.name,
          session_code: requireCode ? accessCode : "",
          deck: loadAllStories ? userStories : selectedStories,
          leader_id: user?.id,
        },
        {
          timeout: 5000,
        }
      );

      onOpenChange(false);

      notifications.show({
        title: "Sala creada 🎉",
        message: "Sala creada correctamente",
        color: "green",
      });


    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          notifications.show({
            title: "Error de conexión 🌐",
            message:
              "No se pudo establecer conexión con el servidor. Inténtalo de nuevo más tarde.",
            color: "red",
          });
        } else {
          console.error("Error creando la sala:", error);
          notifications.show({
            title: "Error al crear la sala",
            message: error.response?.data?.message || error.message,
            color: "red",
          });
        }
      } else {
        console.error("Error desconocido:", error);
        notifications.show({
          title: "Error desconocido",
          message: "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
          color: "red",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Crear nueva sala de Planning Poker
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configura una nueva sesión de Planning Poker para tu equipo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN: Datos principales */}
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="roomName" className="font-medium">
                  Nombre de la sala
                </Label>
                <Input
                  id="roomName"
                  placeholder="Ej: Sprint 23 Planning"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="font-medium">Proyecto</Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={(val) => {
                    setSelectedProjectId(val);
                    setSelectedStories([]); 
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.length > 0 ? (
                      projects.map((proj) => (
                        <SelectItem key={proj.id} value={proj.id.toString()}>
                          {proj.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        (No hay proyectos disponibles)
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="font-medium">
                Descripción
              </Label>
              <Input
                id="description"
                placeholder="Describe el propósito de esta sesión"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          {/* SECCIÓN: Configuración de la votación */}
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="text-base font-semibold mb-1">
              Configuración de la votación
            </h3>
            {/* Escala de votación */}
            <div>
              <Label className="font-medium mb-2 block">
                Escala de votación
              </Label>
              <Select
                value={votingScale}
                onValueChange={(val: VotingScale) => setVotingScale(val)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una escala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VotingScale.FIBONACCI}>
                    Fibonacci (1,2,3,5,8,13,21)
                  </SelectItem>
                  <SelectItem value={VotingScale.MODIFIED_FIBONNACI}>
                    Modificada (0,½,1,2,3,5,8,13,20,40,100)
                  </SelectItem>
                  <SelectItem value={VotingScale.TSHIRT}>
                    Tallas (XS,S,M,L,XL)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkboxes de configuración */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireCode"
                  checked={requireCode}
                  onCheckedChange={(checked) =>
                    setRequireCode(checked === true)
                  }
                />
                <Label htmlFor="requireCode">Requerir código de acceso</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="loadAllStories"
                  checked={loadAllStories}
                  onCheckedChange={(checked) => {
                    setLoadAllStories(!!checked);
                    // Al desmarcar, limpiar historias seleccionadas
                    if (!checked) setSelectedStories([]);
                  }}
                />
                <Label htmlFor="loadAllStories">
                  Cargar todas las historias
                </Label>
              </div>
            </div>

            {requireCode && (
              <div className="mt-3">
                <Label htmlFor="accessCode" className="font-medium">
                  Código de acceso
                </Label>
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="Ej: A123..."
                  maxLength={6}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* SECCIÓN: Selección de historias (si NO se cargan todas) */}
          {!loadAllStories && (
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="text-base font-semibold mb-1">
                Selecciona las historias de usuario
              </h3>
              <div className="max-h-44 overflow-y-auto space-y-2">
                {userStories.length > 0 ? (
                  userStories.map((story) => (
                    <div
                      key={story.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        id={`story-${story.id}`}
                        checked={selectedStories.some((s) => s.id === story.id)}
                        onCheckedChange={() => handleStorySelection(story)}
                      />
                      <Label htmlFor={`story-${story.id}`}>{story.title}</Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay historias de usuario disponibles.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Botones del formulario */}
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear sala"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
