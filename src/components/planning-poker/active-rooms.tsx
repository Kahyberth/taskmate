import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@mantine/core";
import { Datum } from "@/interfaces/active_rooms";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  live: {
    label: "Votación en curso",
    color: "bg-green-500",
  },
  waiting: {
    label: "En espera",
    color: "bg-gray-500",
  },
  closed: {
    label: "Cerrado",
    color: "bg-red-500",
  },
  paused: {
    label: "Pausado",
    color: "bg-orange-500",
  },
};


export function ActiveRooms() {
  interface ActiveRoom {
    id: string;
    name: string;
    host: {
      name: string;
      image: string;
    };
    participants: number;
    status: string;
    currentIssue: string;
    duration: string;
    project: string;
  }

  const [data, setData] = useState<ActiveRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_URL}/poker/all-sessions`)
        .then((response) => {
          console.log(response.data.data);

          const active_sessions = response.data.data.map((session: Datum) => {
            return {
              id: session.session_id,
              name: session.session_name,
              host: {
                name: session.created_by,
                image: "/placeholder.svg",
              },
              participants: 8,
              status: session.status,
              currentIssue: session.session_code,
              duration: "25min",
              project: "Test",
            };
          });

          console.log("Salas:", active_sessions);
          setData(active_sessions);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  const handleJoinRoom = (room_id: string) => {
    //TODO: Realizar verificacion de session
    navigate(`room/${room_id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salas Activas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading && (
          <>
            <Skeleton height={50} circle mb="xl" />
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </>
        )}
        {error && <div>Error al cargar las salas</div>}
        {!loading &&
          !error &&
          data &&
          data.map((room) => (
            <div
              key={room.id}
              className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{room.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {room.project}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{room.participants} participantes</span>
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
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="gap-1">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      statusConfig[room.status as keyof typeof statusConfig]
                        ?.color
                    }`}
                  />
                  {
                    statusConfig[room.status as keyof typeof statusConfig]
                      ?.label
                  }
                </Badge>
                <Button onClick={ () => handleJoinRoom(room.id) }>Unirse</Button>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
