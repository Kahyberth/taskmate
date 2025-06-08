import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Lock } from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import { Skeleton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/AuthContext";
import { apiClient } from "@/api/client-gateway";
import type { Datum } from "@/interfaces/active_rooms";
import { io, Socket } from "socket.io-client";

const statusConfig = {
  live: { label: "Votación en curso", color: "bg-green-500" },
  waiting: { label: "En espera", color: "bg-gray-500" },
  closed: { label: "Cerrado", color: "bg-red-500" },
  paused: { label: "Pausado", color: "bg-orange-500" },
  started: { label: "Iniciado", color: "bg-green-500" },
  default: { label: "Desconocido", color: "bg-gray-500" },
};

interface ActiveRoom {
  id: string;
  name: string;
  host: { name: string; image: string };
  participants: number;
  currentParticipants: number;
  status: string;
  currentIssue: string;
  duration: string;
  project: string;
  hasPassword: boolean;
}

interface joinRoomProps {
  roomId: string;
  usePassword?: boolean;
  password?: string;
}

export function ActiveRooms() {
  const [data, setData] = useState<ActiveRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [projectsId, setProjectsId] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user: user_data, userProfile } = useContext(AuthContext);

  const socketRef = useRef<Socket | null>(null);

  //TODO: Agregar un estado global para la project_id

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchTeams = await apiClient.get(
        `/teams/get-team-by-user/${user_data?.id}`
      );

      const { data: teams } = fetchTeams.data;

      const allProjects: any[] = [];
      for (const team of teams) {
        const fetchProjectsByTeam = await apiClient.get(
          `/projects/team-projects?teamId=${team.id}`
        );
        const { data: projects } = fetchProjectsByTeam;
        if (projects.length > 0) {
          allProjects.push(...projects);
        }
      }

      const projectIds = allProjects.map((project) => project.id.toString());
      setProjectsId(projectIds);

 
      let allSessions: Datum[] = [];

      for (const projectId of projectIds) {
        const response = await apiClient.get(
          `${import.meta.env.VITE_API_URL}/poker/session-details-by-project-id?project_id=${projectId}`,
          { timeout: 10000 }
        );
        if (Array.isArray(response.data.data)) {
          allSessions = allSessions.concat(response.data.data);
        }
      }

      setData(prev =>
        allSessions.map((session: Datum) => {
          const prevRoom = prev.find(r => r.id === session.session_id);
          return {
            id: session.session_id,
            name: session.session_name,
            host: { name: session.created_by, image: "/placeholder.svg" },
            participants: session.capacity,
            currentParticipants: prevRoom?.currentParticipants ?? 0,
            status: session.status,
            currentIssue: session.session_code,
            duration: "25min",
            project: session.project_name,
            hasPassword: !!session.session_code,
          };
        })
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_POKER_WS}`, {
      auth: {
        userProfile,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("session-status-changed", ({ sessionId, status }) => {
      console.log("session-status-changed", { sessionId, status });
      fetchData();
    });

    socket.on("participant-count-updated", ({ roomId, count }) => {
      setData((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, currentParticipants: count } : room
        )
      );
    });

    socket.on("room-will-be-deleted", ({ message, roomId }) => {
      notifications.show({
        title: "Aviso",
        message,
        color: "yellow",
      });
      setData((prev) => prev.filter((room) => room.id !== roomId));
    });

    return () => {
      socket.off("session-status-changed");
      socket.off("participant-count-updated");
      socket.off("room-will-be-deleted");
      socket.disconnect();
    };
  }, [userProfile]);

  const handleJoinRoom = async ({
    roomId,
    usePassword = false,
    password = "",
  }: joinRoomProps) => {
    setJoiningRoomId(roomId);
    try {
      const endpoint = usePassword ? "join-session-code" : "join-session";
      const payload = usePassword
        ? { session_id: roomId, user_id: user_data?.id, session_code: password }
        : { session_id: roomId, user_id: user_data?.id };

      await apiClient.post(
        `${import.meta.env.VITE_API_URL}/poker/${endpoint}`,
        payload
      );
      navigate(`room/${roomId}`);
    } catch (error: unknown) {
      let message = "Unknown error";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        message = error.response.data.message as string;
      } else if (error instanceof Error) {
        message = error.message;
      }
      notifications.show({
        title: "Error",
        message,
        color: "red",
      });
    } finally {
      setJoiningRoomId(null);
      setPassword("");
      setSelectedRoomId(null);
    }
  };

  const handleJoinAttempt = (room: ActiveRoom) => {
    if (room.hasPassword) {
      setSelectedRoomId(room.id);
      setIsPasswordModalOpen(true);
    } else {
      handleJoinRoom({ roomId: room.id });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoomId && password) {
      handleJoinRoom({
        roomId: selectedRoomId,
        usePassword: true,
        password: `POKER-${password}`,
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Salas Activas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto max-h-[700px]">
          {loading && (
            <>
              <Skeleton height={50} circle />
              <Skeleton height={10} radius="xl" />
              <Skeleton height={10} radius="xl" mt={6} />
              <Skeleton height={10} width="70%" radius="xl" mt={6} />
            </>
          )}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && data.length === 0 && (
            <p className="text-center text-muted-foreground">
              No se encontraron salas activas.
            </p>
          )}

          {!loading &&
            !error &&
            data.map((room) => (
              <div
                key={room.id}
                className="border rounded-lg p-4 flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{room.name}</h3>
                      {room.hasPassword && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {room.project}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {room.currentParticipants ?? 0}/{room.participants}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{room.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={room.host.image} />
                        <AvatarFallback>{room.host.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        Organizado por{" "}
                        <span className="font-medium">{room.host.name}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant="secondary" className="gap-1">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          statusConfig[room.status as keyof typeof statusConfig]
                            ?.color || statusConfig.default.color
                        }`}
                      />
                      {statusConfig[room.status as keyof typeof statusConfig]
                        ?.label || statusConfig.default.label}
                    </Badge>
                    <Button
                      onClick={() => handleJoinAttempt(room)}
                      disabled={joiningRoomId === room.id}
                    >
                      {joiningRoomId === room.id ? "Uniéndose..." : "Unirse"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ingrese el código de la sala</DialogTitle>
            <DialogDescription>
              Esta sala está protegida por código.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Código</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPassword("");
                  setJoiningRoomId(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!password || joiningRoomId !== selectedRoomId}
              >
                {joiningRoomId === selectedRoomId ? "Uniéndose..." : "Unirse"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
