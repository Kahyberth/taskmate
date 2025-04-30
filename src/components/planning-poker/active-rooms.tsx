import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, Lock } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { Skeleton } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { notifications } from "@mantine/notifications"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthContext } from "@/context/AuthContext"
import { apiClient } from "@/api/client-gateway"
import type { Datum } from "@/interfaces/active_rooms"

const statusConfig = {
  live: { label: "Votación en curso", color: "bg-green-500" },
  waiting: { label: "En espera", color: "bg-gray-500" },
  closed: { label: "Cerrado", color: "bg-red-500" },
  paused: { label: "Pausado", color: "bg-orange-500" },
}

interface ActiveRoom {
  id: string
  name: string
  host: { name: string; image: string }
  participants: number
  status: string
  currentIssue: string
  duration: string
  project: string
  hasPassword: boolean
}

interface joinRoomProps {
  roomId: string
  usePassword?: boolean
  password?: string
}

export function ActiveRooms() {
  const [data, setData] = useState<ActiveRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user: user_data } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${import.meta.env.VITE_API_URL}/poker/all-sessions`, {
          timeout: 10000,
        })
        const active_sessions = response.data.data.map((session: Datum) => ({
          id: session.session_id,
          name: session.session_name,
          host: { name: session.created_by, image: "/placeholder.svg" },
          participants: session.capacity,
          status: session.status,
          currentIssue: session.session_code,
          duration: "25min",
          project: session.project_name,
          hasPassword: !!session.session_code,
        }))
        setData(active_sessions)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleJoinRoom = async ({ roomId, usePassword = false, password = "" }: joinRoomProps) => {
    setJoiningRoomId(roomId)
    try {
      const endpoint = usePassword ? "join-session-code" : "join-session"
      const payload = usePassword
        ? { session_id: roomId, user_id: user_data?.id, session_code: password }
        : { session_id: roomId, user_id: user_data?.id }

      await apiClient.post(`${import.meta.env.VITE_API_URL}/poker/${endpoint}`, payload)
      navigate(`room/${roomId}`)
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || error.message,
        color: "red",
      })
    } finally {
      setJoiningRoomId(null)
      setPassword("")
      setSelectedRoomId(null)
    }
  }

  const handleJoinAttempt = (room: ActiveRoom) => {
    if (room.hasPassword) {
      setSelectedRoomId(room.id)
      setIsPasswordModalOpen(true)
    } else {
      handleJoinRoom({ roomId: room.id })
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRoomId && password) {
      handleJoinRoom({ roomId: selectedRoomId, usePassword: true, password: `POKER-${password}` })
    }
  }

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
            <p className="text-center text-muted-foreground">No se encontraron salas activas.</p>
          )}

          {!loading && !error && data.map((room) => (
            <div key={room.id} className="border rounded-lg p-4 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{room.name}</h3>
                    {room.hasPassword && <Lock className="h-4 w-4 text-muted-foreground" />}
                    <Badge variant="secondary" className="text-xs">{room.project}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span>{room.participants}</span></div>
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{room.duration}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={room.host.image} />
                      <AvatarFallback>{room.host.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Organizado por <span className="font-medium">{room.host.name}</span></span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge variant="secondary" className="gap-1">
                    <div className={`h-1.5 w-1.5 rounded-full ${statusConfig[room.status as keyof typeof statusConfig]?.color}`} />
                    {statusConfig[room.status as keyof typeof statusConfig]?.label}
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
            <DialogDescription>Esta sala está protegida por código.</DialogDescription>
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
                  setIsPasswordModalOpen(false)
                  setPassword("")
                  setJoiningRoomId(null)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!password || joiningRoomId !== selectedRoomId}>
                {joiningRoomId === selectedRoomId ? "Uniéndose..." : "Unirse"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
