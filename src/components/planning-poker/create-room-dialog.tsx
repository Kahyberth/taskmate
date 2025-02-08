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
import { AuthContext } from "@/context/AuthProvider";
import { VotingScale } from "@/enums/room-scale.enum";
import axios from "axios";

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
            title: 'Implement user authentication',
            description: 'As a user, I want to be able to securely log in ...',
            priority: 'High',
          },
          {
            id: "2",
            title: 'Create dashboard layout',
            description: 'As a user, I want to see a clear overview ...',
            priority: 'Medium',
          },
          {
            id: "3",
            title: 'Login page design',
            description: 'As a user, I want to see a beautiful login page ...',
            priority: 'Low',
          },
          {
            id: "4",
            title: 'Manage user roles',
            description: 'As an admin, I want to be able to manage user roles ...',
            priority: 'High',
          },
          {
            id: "5",
            title: 'Create user profile page',
            description: 'As a user',
            priority: 'Medium',
          },
          {
            id: "6",
            title: 'Add user settings',
            description: 'As a user, I want to be able to change my settings ...',
            priority: 'Low',
          },
          {
            id: "7",
            title: 'Implement user authentication',
            description: 'As a user, I want to be able to securely log in ...',
            priority: 'High',
          },
          {
            id: "8",
            title: 'Create dashboard layout',
            description: 'As a user, I want to see a clear overview ...',
            priority: 'Medium',
          },
          {
            id: "9",
            title: 'Login page design',
            description: 'As a user, I want to see a beautiful login page ...',
            priority: 'Low',
          },
          {
            id: "10",
            title: 'Manage user roles',
            description: 'As an admin, I want to be able to manage user roles ...',
            priority: 'High',
          },
          {
            id: "11",
            title: 'Create user profile page',
            description: 'As a user, I want to see my profile page ...',
            priority: 'Medium',
          },
          {
            id: "12",
            title: 'Add user settings',
            description: 'As a user, I want to be able to change my settings ...',
            priority: 'Low',
          },
          {
            id: "13",
            title: 'Implement user authentication',
            description: 'As a user, I want to be able to securely log in ...',
            priority: 'High',
          },
          {
            id: "14",
            title: 'Create dashboard layout',
            description: 'As a user, I want to see a clear overview ...',
            priority: 'Medium',
          },
          {
            id: "15",
            title: 'Login page design',
            description: 'As a user, I want to see a beautiful login page ...',
            priority: 'Low',
          },
          {
            id: "16",
            title: 'Manage user roles',
            description: 'As an admin, I want to be able to manage user roles ...',
            priority: 'High',
          },
          {
            id: "17",
            title: 'Create user profile page',
            description: 'As a user, I want to see my profile page ...',
            priority: 'Medium',
          },
          {
            id: "18",
            title: 'Add user settings',
            description: 'As a user, I want to be able to change my settings ...',
            priority: 'Low',
          }

        ]);
      } catch (error) {
        console.error("Error al cargar historias de usuario:", error);
      }
    };

    fetchUserStories();
  }, [selectedProjectId]);

  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [votingScale, setVotingScale] = useState<VotingScale>(
    VotingScale.FIBONACCI
  );

  const [requireCode, setRequireCode] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const [loadAllStories, setLoadAllStories] = useState(true);

  const [selectedStories, setSelectedStories] = useState<UserStory[]>([]);
  const handleStorySelection = (story: UserStory) => {
      setSelectedStories((prev) =>
        prev.some((s) => s.id === story.id)
          ? prev.filter((s) => s.id !== story.id)
          : [...prev, story]
      );
    };

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Creando sala con los siguientes datos:");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/poker/create-session`, {
        session_name: roomName,
        description,
        project_id: selectedProjectId,
        voting_scale: votingScale,
        created_by: user?.id,
        session_code: requireCode ? accessCode : "",
        deck: loadAllStories ? userStories : selectedStories,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error creando la sala:", error);
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
                  // El value es el ID del proyecto seleccionado
                  value={selectedProjectId}
                  // Actualiza el ID cuando el usuario selecciona otro proyecto
                  onValueChange={(val) => {
                    setSelectedProjectId(val);
                    setSelectedStories([]); // limpiar historias seleccionadas
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
