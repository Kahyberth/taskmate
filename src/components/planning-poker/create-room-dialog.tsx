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

interface Team {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

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
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
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
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);


  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchProductBacklogId = async () => {
      const fetchProductBacklogId = await apiClient.get(
        `/backlog/get-backlog-by-project/${selectedProjectId}`
      );

      

      const { id: productBacklogId } = fetchProductBacklogId.data;

      if (productBacklogId !== null) {
        const fetchUserStories = await apiClient.get(
          `/backlog/get-all-issues/${productBacklogId}`
        );

        const userStories = fetchUserStories.data;

        setUserStories(userStories || []);
      }
    };

    fetchProductBacklogId();
  }, [selectedProjectId]);



  useEffect(() => {
    if (open) {
      const fetchTeamsByUser = async () => {
        setIsLoadingTeams(true);
        setIsDataLoaded(false);
        try {
          const fetchTeams = await apiClient.get(
            `/teams/get-team-by-user/${user?.id}`
          );
          const { data: teams } = fetchTeams.data;
          setTeams(teams || []);

          if (teams && teams.length > 0) {
            const teamId = teams[0].id.toString();
            setSelectedTeamId(teamId);

            const fetchProjectsByTeam = await apiClient.get(
              `/projects/team-projects?teamId=${teamId}`
            );

            const { data: projects } = fetchProjectsByTeam;
            setProjects(projects || []);

            if (projects && projects.length > 0) {
              const projectId = projects[0].id.toString();
              setSelectedProjectId(projectId);

              const fetchProductBacklogId = await apiClient.get(
                `/backlog/get-backlog-by-project/${projectId}`
              );

              const { id: productBacklogId } = fetchProductBacklogId.data;

              if (productBacklogId !== null) {
                const fetchUserStories = await apiClient.get(
                  `/backlog/get-all-issues/${productBacklogId}`
                );

                const userStories = fetchUserStories.data;

                setUserStories(userStories || []);
              }
            }
          }
          setIsDataLoaded(true);
        } catch (error) {
          console.error("Error al cargar equipos:", error);
          notifications.show({
            title: "Error al cargar equipos",
            message:
              "No se pudieron cargar los equipos. Inténtalo de nuevo más tarde.",
            color: "red",
          });
          setTeams([]);
          setProjects([]);
          setUserStories([]);
        } finally {
          setIsLoadingTeams(false);
        }
      };
      fetchTeamsByUser();
    }
  }, [open, user?.id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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

    console.log("DECK", loadAllStories ? userStories : selectedStories);


    const deck = loadAllStories ? userStories : selectedStories;

    const decks = deck.map((story) => ({
      id: story.id,
      title: story.title,
      description: story.description,
      priority: story.priority,
    }));

    console.log("DECKS", decks);

    const payload = {
      session_name: roomName,
      description,
      project_id: selectedProjectId,
      voting_scale: votingScale,
      created_by: user?.name,
      session_code: requireCode ? accessCode : "",
      deck: decks,
      leader_id: user?.id,
    }


    try {
      await apiClient.post(
        "/poker/create-session",
        payload,
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

        {isLoadingTeams ? (
          <div className="flex justify-center items-center py-8">
            <Loader color="grape" type="dots" />
          </div>
        ) : (
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
                  <Label className="font-medium">Equipo</Label>
                  <Select
                    value={selectedTeamId}
                    onValueChange={(val) => {
                      setSelectedTeamId(val);
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {isDataLoaded && teams && teams.length > 0
                        ? teams.map((team) => (
                            <SelectItem
                              key={team.id}
                              value={team.id.toString()}
                            >
                              {team.name}
                            </SelectItem>
                          ))
                        : null}
                    </SelectContent>
                  </Select>
                  {isDataLoaded && teams && teams.length === 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      (No hay equipos disponibles)
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-medium">Proyecto</Label>
                  <Select
                    value={selectedProjectId}
                    onValueChange={(val) => {
                      setSelectedProjectId(val);
                      setSelectedStories([]);
                    }}
                    required
                    disabled={!selectedTeamId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.length > 0 &&
                        projects.map((proj) => (
                          <SelectItem key={proj.id} value={proj.id.toString()}>
                            {proj.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {selectedTeamId && projects.length === 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      (No hay proyectos disponibles)
                    </div>
                  )}
                  {!selectedTeamId && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Selecciona un equipo primero
                    </div>
                  )}
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
                          checked={selectedStories.some(
                            (s) => s.id === story.id
                          )}
                          onCheckedChange={() => handleStorySelection(story)}
                        />
                        <Label htmlFor={`story-${story.id}`}>
                          {story.title}
                        </Label>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
