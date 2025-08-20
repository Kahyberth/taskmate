import { useState, useEffect, useMemo, useContext } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Plus,
  Search,
  HelpCircle,
  Users,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Home,
  Bot
} from "lucide-react"
import { getChannels, createChannel, getServerByTeamId } from "@/api/channels"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "@/context/AuthContext"

type Room = {
  id: string
  name: string
  description?: string
  parentId?: string | null
  members?: number
  lastMessage?: string
  time?: string
  unread?: number
}

interface ChannelsSidebarProps {
  team_id: string
  selectedId: string
  onSelectChannel: (id: string) => void
  showAIAssistant?: () => void
}

export default function ChannelsSidebar({ team_id, selectedId, onSelectChannel, showAIAssistant }: ChannelsSidebarProps) {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoadingChannels, setIsLoadingChannels] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [createParentId, setCreateParentId] = useState<string | undefined>(undefined)
  const [createName, setCreateName] = useState("")
  const [createDescription, setCreateDescription] = useState("")
  const [creating, setCreating] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const childrenMap = useMemo(() => {
    const map = new Map<string, Room[]>()
    rooms.forEach((r) => {
      const pid = r.parentId ?? "_root"
      if (!map.has(pid)) map.set(pid, [])
      map.get(pid)!.push(r)
    })
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => a.name.localeCompare(b.name))
      map.set(k, arr)
    }
    return map
  }, [rooms])

  const rootRooms = childrenMap.get("_root") ?? []

  useEffect(() => {
    const next: Record<string, boolean> = { ...expanded }
    rooms.forEach((r) => {
      if (childrenMap.get(r.id)?.length) {
        if (!(r.id in next)) next[r.id] = true
      }
    })
    setExpanded(next)
  }, [rooms, childrenMap])



  useEffect(() => {
    async function loadChannels() {
      try {
        // Primero intentar cargar desde la API
        const serverId = team_id;
        const response = await getChannels(serverId);
        const apiChannels = response.data;
        
        if (apiChannels && apiChannels.length > 0) {
          const convertedRooms: Room[] = apiChannels.map((channel: any) => ({
            id: channel.id || channel.channel_id,
            name: channel.name,
            description: channel.description,
            parentId: channel.parentId || channel.parent_id || undefined,
            members: 0,
            lastMessage: "",
            time: "",
            unread: 0,
          }));

          setRooms(convertedRooms);
          if (convertedRooms.length > 0 && !selectedId) {
            onSelectChannel(convertedRooms[0].id);
          }
        } else {
          // Si no hay canales en la API, crear canales de prueba
          const testRooms: Room[] = [
            {
              id: "general",
              name: "General",
              description: "Canal general del servidor",
              members: 0,
              lastMessage: "",
              time: "",
              unread: 0,
            },
            {
              id: "soporte",
              name: "Soporte",
              description: "Canal de soporte técnico",
              members: 0,
              lastMessage: "",
              time: "",
              unread: 0,
            },
            {
              id: "desarrollo",
              name: "Desarrollo",
              description: "Canal de desarrollo",
              members: 0,
              lastMessage: "",
              time: "",
              unread: 0,
            }
          ];
          
          setRooms(testRooms);
          if (!selectedId) {
            onSelectChannel(testRooms[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading channels:', error);
        // En caso de error, crear canales de prueba
        const defaultRooms: Room[] = [
          {
            id: "general",
            name: "General",
            description: "Canal general del servidor",
            members: 0,
            lastMessage: "",
            time: "",
            unread: 0,
          },
          {
            id: "soporte",
            name: "Soporte",
            description: "Canal de soporte técnico",
            members: 0,
            lastMessage: "",
            time: "",
            unread: 0,
          }
        ];
        
        setRooms(defaultRooms);
        if (!selectedId) {
          onSelectChannel(defaultRooms[0].id);
        }
      } finally {
        setIsLoadingChannels(false);
      }
    }

    if (team_id) {
      loadChannels();
    }
  }, [team_id, selectedId, onSelectChannel]);

  function openCreateDialog(parentId?: string) {
    setCreateParentId(parentId)
    setCreateName("")
    setCreateDescription("")
    setCreateOpen(true)
  }

  async function createRoom() {
    const name = createName.trim()
    if (!name || !userProfile) {
      console.log('createRoom: Missing name or userProfile', { name, userProfile: !!userProfile })
      return
    }

    console.log('createRoom: Starting creation process', { name, team_id, userProfile: userProfile.id })

    try {
      setCreating(true)
      
      // Obtener serverId real usando team_id
      console.log('createRoom: Fetching server info for team_id:', team_id)
      const server = await getServerByTeamId(team_id)
      console.log('createRoom: Server info received:', server)
      
      const payload: any = {
        name,
        description: createDescription.trim() || undefined,
        created_by: userProfile.id,
        serverId: server.server_id,
        parentId: (createParentId && createParentId !== 'root') ? createParentId : ""
      }
      
      console.log('createRoom: Payload to send:', payload)

      const created = await createChannel(payload)
      console.log('createRoom: Channel created, response:', created)
      const createdId = (created as any).id || (created as any).channel_id
      console.log('createRoom: Extracted created ID:', createdId)

      // Refrescar canales desde API
      console.log('createRoom: Refreshing channels list...')
      const refreshed = await getChannels(team_id)
      console.log('createRoom: Refreshed channels:', refreshed)
      const apiChannels = refreshed.data
      const convertedRooms: Room[] = apiChannels.map((channel: any) => ({
        id: channel.id || channel.channel_id,
        name: channel.name,
        description: channel.description,
        parentId: channel.parentId || channel.parent_id || undefined,
        members: 0,
        lastMessage: "",
        time: "",
        unread: 0,
      }))
      console.log('createRoom: Converted rooms:', convertedRooms)
      
      setRooms(convertedRooms)
      if ((created as any).parentId || (created as any).parent_id) {
        const pid = (created as any).parentId || (created as any).parent_id
        setExpanded((e) => ({ ...e, [pid as string]: true }))
      }
      if (createdId) onSelectChannel(createdId)
      setCreateOpen(false)
      setCreateName("")
      setCreateDescription("")
      setCreateParentId(undefined)
      console.log('createRoom: Process completed successfully')
    } catch (err) {
      console.error('Error creating channel:', err)
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
      }
      alert(`No se pudo crear el canal: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setCreating(false)
    }
  }

  if (isLoadingChannels) {
    return (
      <aside className="w-[300px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
        {/* Navigation Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/teams/dashboard/${team_id}`)}
              className="h-8 px-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Ir al Dashboard Principal"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={showAIAssistant}
              className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="IA Assistant"
            >
              <Bot className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Chat</h1>
                <p className="text-sm text-blue-100">Comunicación en tiempo real</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Ayuda</span>
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 h-10 bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus:bg-white/20"
              placeholder="Buscar chats..."
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando canales...</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="w-[300px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
        {/* Navigation Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/teams/dashboard/${team_id}`)}
              className="h-8 px-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Ir al Dashboard Principal"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={showAIAssistant}
              className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="IA Assistant"
            >
              <Bot className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Chat</h1>
                <p className="text-sm text-blue-100">Comunicación en tiempo real</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Ayuda</span>
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 h-10 bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus:bg-white/20"
              placeholder="Buscar chats..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Canales</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            onClick={() => openCreateDialog(undefined)}
            title="Crear canal"
            aria-label="Crear canal"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <ul className="px-4 pb-4">
            {rootRooms.length > 0 ? (
              rootRooms.map((room) => (
                <RoomNode
                  key={room.id}
                  room={room}
                  depth={0}
                  selectedId={selectedId}
                  onSelect={onSelectChannel}
                  childrenMap={childrenMap}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  onCreateSub={(parentId) => openCreateDialog(parentId)}
                />
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500 dark:text-gray-400">No hay canales disponibles</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Team ID: {team_id}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Rooms count: {rooms.length}</p>
              </div>
            )}
          </ul>
        </ScrollArea>
      </aside>

      {/* Dialogo crear sala/subcanal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Crear {createParentId ? "subcanal" : "sala"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="room-name">Nombre</Label>
              <Input
                id="room-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="p. ej. Soporte, Ventas, General"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="room-desc">Descripción (opcional)</Label>
              <Textarea
                id="room-desc"
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Describe de qué trata esta sala"
                className="min-h-[84px]"
              />
            </div>
            <div className="grid gap-2">
              <Label>Ubicación</Label>
              <Select
                value={createParentId ?? "root"}
                onValueChange={(v) => setCreateParentId(v === "root" ? undefined : v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecciona ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Sin padre (nivel raíz)</SelectItem>
                  {rooms.filter(Boolean).map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {roomPathLabel(r, rooms)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={createRoom} disabled={!createName.trim() || creating}>
              {creating ? 'Creando...' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ---------- Lista jerárquica ---------- */
function RoomNode({
  room,
  depth,
  selectedId,
  onSelect,
  childrenMap,
  expanded,
  setExpanded,
  onCreateSub,
}: {
  room: Room
  depth: number
  selectedId: string
  onSelect: (id: string) => void
  childrenMap: Map<string, Room[]>
  expanded: Record<string, boolean>
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  onCreateSub: (parentId: string) => void
}) {
  const children = childrenMap.get(room.id) ?? []
  const hasChildren = children.length > 0
  const isOpen = expanded[room.id] ?? true

  return (
    <li>
      <div
        className={cn(
          "group relative w-full rounded-xl px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200",
          selectedId === room.id && "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 ring-1 ring-blue-200 dark:ring-blue-700 shadow-sm",
        )}
        style={{ paddingLeft: 12 + depth * 20 }}
      >
        <div className="flex items-center gap-2">
          {/* Chevron */}
          <button
            className={cn(
              "mr-1 h-5 w-5 shrink-0 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
              !hasChildren && "opacity-0 pointer-events-none",
            )}
            onClick={() => setExpanded((e) => ({ ...e, [room.id]: !isOpen }))}
            aria-label={isOpen ? "Colapsar" : "Expandir"}
            title={isOpen ? "Colapsar" : "Expandir"}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {/* Avatar y título clickable */}
          <button onClick={() => onSelect(room.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
            <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-700">
              <AvatarImage src="/avatar-circle.png" alt={room.name} />
              <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {room.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{room.name}</span>
                {room.time && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{room.time}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{room.lastMessage || room.description || "Sin mensajes"}</p>
                {room.unread ? (
                  <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {room.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </button>

          {/* Botón crear subcanal */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-all duration-200"
            onClick={() => onCreateSub(room.id)}
            title="Crear subcanal"
            aria-label="Crear subcanal"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hijos */}
      {hasChildren && isOpen && (
        <ul>
          {children.map((child) => (
            <RoomNode
              key={child.id}
              room={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              childrenMap={childrenMap}
              expanded={expanded}
              setExpanded={setExpanded}
              onCreateSub={onCreateSub}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

/* ---------- Utilidades ---------- */
function roomPathLabel(room: Room, rooms: Room[]) {
  // Construir ruta legible: Padre / Hijo / Nieto
  const byId = new Map(rooms.map((r) => [r.id, r]))
  const parts: string[] = [room.name]
  let current = room
  let safety = 0
  while (current.parentId && byId.has(current.parentId) && safety < 10) {
    current = byId.get(current.parentId)!
    parts.push(current.name)
    safety++
  }
  return parts.reverse().join(" / ")
}
