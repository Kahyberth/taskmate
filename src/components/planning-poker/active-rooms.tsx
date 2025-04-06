import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, Lock } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { Skeleton } from "@mantine/core"
import type { Datum } from "@/interfaces/active_rooms"
import { useNavigate } from "react-router-dom"
import "@mantine/notifications/styles.css"
import { notifications } from "@mantine/notifications"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthContext } from "@/context/AuthContext"
import { apiClient } from "@/api/client-gateway"

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
}

export function ActiveRooms() {
  interface ActiveRoom {
    id: string
    name: string
    host: {
      name: string
      image: string
    }
    participants: number
    status: string
    currentIssue: string
    duration: string
    project: string
    hasPassword: boolean
  }

  const [data, setData] = useState<ActiveRoom[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false) // Added loading state
  const navigate = useNavigate()
  const { user: user_data } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get(`${import.meta.env.VITE_API_URL}/poker/all-sessions`, {
          timeout: 10000,
        })
        .then((response) => {
          const active_sessions = response.data.data.map((session: Datum) => {
            return {
              id: session.session_id,
              name: session.session_name,
              host: {
                name: session.created_by,
                image: "/placeholder.svg",
              },
              participants: session.capacity,
              status: session.status,
              currentIssue: session.session_code,
              duration: "25min",
              project: session.project_name,
              hasPassword: session.session_code ? session.session_code.length > 0 : false,
            }
          })
          setData(active_sessions)
        })
        .catch((error) => {
          setError(error.message)
          setLoading(false)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    fetchData()
  }, [])

  const handleJoinRoom = async (room_id: string) => {
    setIsJoining(true)
    try {
      await apiClient.post(`${import.meta.env.VITE_API_URL}/poker/join-session`, {
        session_id: room_id,
        user_id: user_data?.id,
      })
      navigate(`room/${room_id}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || error.message,
        color: "red",
      })
      if (password) {
        setPassword("")
      }
    } finally {
      setIsJoining(false)
    }
  }

  const handleJoinRoomByCode = async (room_id: string, password: string) => {
    setIsJoining(true)
    try {
      await apiClient.post(`${import.meta.env.VITE_API_URL}/poker/join-session-code`, {
        session_id: room_id,
        user_id: user_data?.id,
        session_code: password,
      })
      setIsPasswordModalOpen(false)
      navigate(`room/${room_id}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || error.message,
        color: "red",
      })
      if (password) {
        setPassword("")
      }
    } finally {
      setIsJoining(false)
    }
  }

  const handleJoinAttempt = (room: ActiveRoom) => {
    if (room.hasPassword) {
      setSelectedRoomId(room.id)
      setIsPasswordModalOpen(true)
    } else {
      handleJoinRoom(room.id)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRoomId && password) {
      handleJoinRoomByCode(selectedRoomId, `POKER-${password}`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Salas Activas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 overflow-y-auto max-h-[700px]">
          {loading && (
            <>
              <Skeleton height={50} circle mb="xl" />
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
            </>
          )}

          {error && <div>Error al cargar las salas: {error}</div>}

          {!loading && !error && data.length === 0 && (
            <div className="text-center text-sm text-muted-foreground">No se encontraron salas activas.</div>
          )}

          {!loading &&
            !error &&
            data.length > 0 &&
            data.map((room) => (
              <div
                key={room.id}
                className="flex flex-col gap-4 rounded-lg border p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 w-full">
                  {/* Parte izquierda: Información de la sala */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{room.name}</h3>
                      {room.hasPassword && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {room.project}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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

                  {/* Parte derecha: Estado y botón */}
                  <div className="flex flex-col justify-between items-end sm:h-32 h-auto gap-4 w-full sm:w-auto sm:mt-0 mt-3">
                    <Badge variant="secondary" className="gap-1 w-fit">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${statusConfig[room.status as keyof typeof statusConfig]?.color
                          }`}
                      />
                      {
                        statusConfig[room.status as keyof typeof statusConfig]
                          ?.label
                      }
                    </Badge>
                    <Button
                      onClick={() => handleJoinAttempt(room)}
                      disabled={isJoining}
                      className="w-full sm:w-auto"
                    >
                      {isJoining ? "Uniéndose..." : "Unirse"}
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
            <DialogTitle>Ingrese la contraseña</DialogTitle>
            <DialogDescription>
              Esta sala está protegida. Por favor, ingrese la contraseña para unirse.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese la contraseña de la sala"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsPasswordModalOpen(false)
                  setPassword("")
                  setSelectedRoomId(null)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!password || isJoining}>
                {isJoining ? "Uniéndose..." : "Unirse"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

