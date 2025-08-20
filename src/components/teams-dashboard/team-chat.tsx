import { useContext, useEffect, useMemo, useRef, useState, useCallback } from "react"
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
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Info,
  HelpCircle,
  Users,
  X,
  MessageSquare,
} from "lucide-react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useChatSocket } from "@/hooks/useChatSocket"
import { getChannels, getMessages, Message as ApiMessage, getServerByTeamId, createChannel } from "@/api/channels"
import { AuthContext } from "@/context/AuthContext"
import { useOutletContext } from "react-router-dom"

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

type Message = {
  id: string
  roomId: string
  text: string
  time: string
  fromMe: boolean
  userName?: string
  avatar?: string
}

type Member = {
  id: string
  name: string
  status: "online" | "offline"
}

type ChatContext = { selectedChannelId: string }

export default function Page({ team_id }: { team_id: string }) {
  

  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedId, setSelectedId] = useState<string>("")
  const { selectedChannelId } = useOutletContext<ChatContext>()
  const [isLoadingChannels, setIsLoadingChannels] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const { userProfile, loading } = useContext(AuthContext);

  const realUser = useMemo(() => {
    if (!userProfile) return null;

    return {
      id: userProfile.id,
      name: userProfile.name,
      lastName: userProfile.lastName,
      phone: userProfile.phone,
      email: userProfile.email,
      password: userProfile.password,
      language: userProfile.language,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
      lastLogin: userProfile.lastLogin,
      company: userProfile.company,
      isActive: userProfile.isActive,
      isAvailable: userProfile.isAvailable,
      profile: {
        id: userProfile.profile.id,
        userId: userProfile.profile.userId,
        profile_picture: userProfile.profile.profile_picture,
        profile_banner: userProfile.profile.profile_banner,
        bio: userProfile.profile.bio,
        updatedAt: userProfile.profile.updatedAt,
        availabilityStatus: userProfile.profile.availabilityStatus,
        isVerified: userProfile.profile.isVerified,
        isBlocked: userProfile.profile.isBlocked,
        skills: userProfile.profile.skills,
        location: userProfile.profile.location,
        social_links: userProfile.profile.social_links,
        experience: userProfile.profile.experience,
        education: userProfile.profile.education,
        timezone: userProfile.profile.timezone,
      },
    };
  }, [userProfile]);


  const socketAuth = useMemo(() => {
    if (!realUser || !selectedId) return null;

    return {
      room: selectedId,
      user: realUser
    };
  }, [selectedId, realUser]);

  const socketUrl = import.meta.env.VITE_CHAT_WS || 'http://localhost:3001';

  const {
    socket,
    isConnected,
    onlineUsers,
    offlineUsers,
    joinChannel,
    sendMessage: sendSocketMessage
  } = useChatSocket(socketUrl, socketAuth);

  const onlineMembers = useMemo(() => {
    return onlineUsers.map(user => ({
      id: user.id,
      name: `${user.name} ${user.lastName}`,
      status: "online" as const
    }));
  }, [onlineUsers]);

  const offlineMembers = useMemo(() => {
    return offlineUsers.map(user => ({
      id: user.id,
      name: `${user.name} ${user.lastName}`,
      status: "offline" as const
    }));
  }, [offlineUsers]);
  const [showMembers, setShowMembers] = useState<boolean>(false)

  const [draft, setDraft] = useState<string>("")
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [createParentId, setCreateParentId] = useState<string | undefined>(undefined)
  const [createName, setCreateName] = useState("")
  const [createDescription, setCreateDescription] = useState("")
  const [creating, setCreating] = useState(false)



  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const selectedRoom = useMemo(() => {
    const room = rooms.find((r) => r.id === selectedId) ?? rooms[0];
    return room;
  }, [selectedId, rooms])

  const roomMessages = useMemo(() => {
    const filtered = messages.filter((m) => m.roomId === selectedRoom?.id);
    return filtered;
  }, [messages, selectedRoom])

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

  // Nota: el sidebar externo renderiza canales; internamente no usamos rootRooms
  // const rootRooms = childrenMap.get("_root") ?? []

  useEffect(() => {
    // Sincronizar selección con el sidebar externo (layout)
    if (selectedChannelId) {
      setSelectedId(selectedChannelId)
    }
  }, [selectedChannelId])

  useEffect(() => {
    const next: Record<string, boolean> = { ...expanded }
    rooms.forEach((r) => {
      if (childrenMap.get(r.id)?.length) {
        if (!(r.id in next)) next[r.id] = true
      }
    })
    setExpanded(next)
  }, [rooms, childrenMap])

  function formatTimeEs(date: Date) {
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const isPM = hours >= 12
    hours = hours % 12
    if (hours === 0) hours = 12
    return `${hours}:${minutes} ${isPM ? "p. m." : "a. m."}`
  }

  function sendMessage() {
    const text = draft.trim()
    if (!text || !selectedRoom || !realUser) return

    sendSocketMessage({
      roomId: selectedRoom.id,
      text,
    });


    const now = new Date()
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `m-${Date.now()}`
    const newMessage: Message = {
      id,
      roomId: selectedRoom.id,
      text,
      time: formatTimeEs(now),
      fromMe: true,
      userName: `${realUser.name} ${realUser.lastName}`,
      avatar: '',
    }
    setMessages((prev) => [...prev, newMessage])
    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoom.id ? { ...r, lastMessage: newMessage.text, time: newMessage.time, unread: 0 } : r,
      ),
    )
    setDraft("")
  }

  /* ---------- Message Skeleton Loader ---------- */
  function MessageSkeleton({ fromMe = false }: { fromMe?: boolean }) {
    return (
      <div className={cn("mb-4 flex items-end gap-2", fromMe ? "justify-end" : "justify-start")}>
        {!fromMe && (
          <div className="h-7 w-7 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
        )}
        
        <div className={cn("max-w-[70%]", fromMe && "flex flex-col items-end")}>
          {!fromMe && (
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-1"></div>
          )}
          
          <div
            className={cn(
              "inline-block rounded-2xl px-3 py-2 animate-pulse",
              fromMe 
                ? "rounded-br-md bg-gray-200 dark:bg-gray-600" 
                : "rounded-bl-md bg-gray-150 dark:bg-gray-650"
            )}
          >
            <div className="space-y-1">
              <div className={cn(
                "h-4 bg-gray-300 dark:bg-gray-500 rounded",
                fromMe ? "w-32" : "w-40"
              )}></div>
              <div className={cn(
                "h-4 bg-gray-300 dark:bg-gray-500 rounded",
                fromMe ? "w-24" : "w-28"
              )}></div>
            </div>
          </div>
          
          <div className={cn(
            "mt-1 h-2 w-12 bg-gray-150 dark:bg-gray-650 rounded animate-pulse",
            fromMe ? "self-end" : "self-start"
          )}></div>
        </div>
        
        {fromMe && (
          <div className="h-7 w-7 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
        )}
      </div>
    )
  }

  function ChatSkeleton() {
    return (
      <div className="px-8 py-6 space-y-4">
        <MessageSkeleton fromMe={false} />
        <MessageSkeleton fromMe={true} />
        <MessageSkeleton fromMe={false} />
        <MessageSkeleton fromMe={false} />
        <MessageSkeleton fromMe={true} />
        <MessageSkeleton fromMe={false} />
      </div>
    )
  }


  useEffect(() => {
    async function loadChannels() {
      try {
        // Pedimos canales por teamId (API espera teamId)
        const response = await getChannels(team_id);
        const apiChannels = response.data;
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
          setSelectedId(convertedRooms[0].id);
        }
      } catch (error) {
        console.error('Error loading channels:', error);
      } finally {
        setIsLoadingChannels(false);
      }
    }

    loadChannels();
  }, [team_id]);

  useEffect(() => {
    if (!selectedId || isLoadingChannels) return;

    setMessages([]);

    async function loadMessages() {
      setIsLoadingMessages(true);
      const minLoadingTime = 600;
      const startTime = Date.now();
      try {
        console.log('Loading messages for channel:', selectedId);
        const apiMessages = await getMessages(selectedId, 50);
        console.log('API Messages received:', apiMessages);

        const convertedMessages: Message[] = apiMessages.map((msg: ApiMessage) => {
          const isFromMe = realUser ? msg.userName === `${realUser.name} ${realUser.lastName}` : false;

          return {
            id: msg.message_id,
            roomId: msg.channel.channel_id,
            text: msg.value,
            time: formatTimeEs(new Date(msg.createdAt)),
            fromMe: isFromMe,
            userName: msg.userName,
            avatar: msg.avatar,
          };
        });

        console.log('Converted messages:', convertedMessages);
        setMessages(convertedMessages);
        console.log('Loaded messages:', convertedMessages.length);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadingTime - elapsed);
        setTimeout(() => setIsLoadingMessages(false), remaining);
      }
    }

    loadMessages();
  }, [selectedId, isLoadingChannels]);

  useEffect(() => {
    if (!socket || !isConnected || isLoadingChannels || !socketAuth) {
      console.log('Cannot join channel:', {
        hasSocket: !!socket,
        isConnected,
        isLoadingChannels,
        hasSocketAuth: !!socketAuth
      });
      return;
    }

    console.log('Joining channel with auth:', socketAuth);
    joinChannel();
  }, [socket, isConnected, selectedId, joinChannel, isLoadingChannels, socketAuth]);

  useEffect(() => {
    console.log('Connection status:', {
      isConnected,
      onlineMembersCount: onlineMembers.length,
      offlineMembersCount: offlineMembers.length,
      selectedRoom: selectedRoom?.name
    });
  }, [isConnected, onlineMembers.length, offlineMembers.length, selectedRoom]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      setMessages((prev) => {
        const messageExists = prev.some(m => m.id === message.id);
        if (messageExists) {
          return prev;
        }

        const isFromMe = realUser ? message.userName === `${realUser.name} ${realUser.lastName}` : false;

        const newMessage: Message = {
          id: message.id,
          roomId: message.roomId,
          text: message.text,
          time: formatTimeEs(new Date(message.time)),
          fromMe: isFromMe,
          userName: message.userName,
          avatar: message.avatar,
        };

        return [...prev, newMessage];
      });

      setRooms((prev) =>
        prev.map((r) =>
          r.id === message.roomId ? { ...r, lastMessage: message.text, time: formatTimeEs(new Date(message.time)), unread: 0 } : r,
        ),
      );
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages, selectedId])

  const openCreateDialog = useCallback((parentId?: string) => {
    setCreateParentId(parentId)
    setCreateName("")
    setCreateDescription("")
    setCreateOpen(true)
  }, [])

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
      if (createdId) setSelectedId(createdId)
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

  if (loading || !userProfile) {
    return (
      <main className="h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando usuario...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden">
      <div className="flex h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden">
        {/* Sidebar de canales provisto por el layout. Este aside interno se ha removido para evitar duplicados. */}

        {/* Conversación centro */}
        <section className="flex-1 flex flex-col bg-white dark:bg-gray-900 min-h-0">
          <header className="h-16 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{selectedRoom?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {selectedRoom?.name}
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}
                      title={isConnected ? 'Conectado' : 'Desconectado'} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {onlineMembers.length} en línea
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Search className="h-4 w-4" />
                <span className="sr-only">Buscar en chat</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={() => openCreateDialog(undefined)}
                title="Crear canal o subcanal"
                aria-label="Crear canal o subcanal"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-10 w-10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", showMembers && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400")}
                onClick={() => setShowMembers((v) => !v)}
                title="Ver miembros"
                aria-label="Ver miembros"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Info className="h-4 w-4" />
                <span className="sr-only">Información</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Más opciones</span>
              </Button>
            </div>
          </header>

          {/* Mensajes */}
          <ScrollArea className="flex-1 bg-gray-50 dark:bg-gray-800 min-h-0 overflow-y-auto">
            <div className="px-8 py-6">
              {!isConnected && (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Conectando al servidor...</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Los mensajes se enviarán cuando se establezca la conexión</p>
                  </div>
                </div>
              )}
              {isLoadingMessages ? (
                <ChatSkeleton />
              ) : roomMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No hay mensajes</h3>
                  <p className="text-gray-500 dark:text-gray-400">¡Sé el primero en escribir en este canal!</p>
                </div>
              ) : (
                <div>
              {roomMessages.map((m) => (
                <MessageBubble
                  key={m.id}
                  text={m.text}
                  time={m.time}
                  fromMe={m.fromMe}
                  userName={m.userName}
                  userAvatar=""
                />
              ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Composer */}
          <footer className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-900 flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Adjuntar archivo</span>
              </Button>

              {/* Emoji button + anchored picker */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors",
                    showEmojiPicker && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  )}
                  onClick={() => setShowEmojiPicker((v) => !v)}
                >
                <Smile className="h-5 w-5" />
                <span className="sr-only">Insertar emoji</span>
              </Button>
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: any) => {
                        const newText = draft + emoji.native
                        setDraft(newText)
                        setShowEmojiPicker(false)
                        if (inputRef.current) inputRef.current.focus()
                      }}
                      theme="auto"
                      set="native"
                      previewPosition="none"
                      skinTonePosition="none"
                      maxFrequentRows={2}
                      perLine={8}
                      searchPosition="top"
                    />
                  </div>
                )}
              </div>

              <Input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 h-12 text-sm border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    sendMessage()
                  }
                  if (e.key === "Escape" && showEmojiPicker) {
                    setShowEmojiPicker(false)
                  }
                }}
              />

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg"
                disabled={!draft.trim()}
                onClick={sendMessage}
                aria-label="Enviar mensaje"
                title="Enviar"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </footer>
        </section>

        {/* Panel de miembros (derecha) */}
        {showMembers && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20 lg:hidden"
              onClick={() => setShowMembers(false)}
              aria-hidden="true"
            />
            <aside className="fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-[320px] border-l border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl lg:static lg:z-auto lg:w-[300px] lg:shadow-none flex flex-col">
              <header className="h-16 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Miembros</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={() => setShowMembers(false)}
                  aria-label="Cerrar panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </header>
              <ScrollArea className="flex-1 min-h-0">
                <div className="px-6 py-6 space-y-8">
                  <MembersSection title={`Conectados (${onlineMembers.length})`} members={onlineMembers} />
                  <MembersSection title={`Desconectados (${offlineMembers.length})`} members={offlineMembers} />
                </div>
              </ScrollArea>
            </aside>
          </>
        )}
      </div>

      {/* Botón de ayuda flotante */}
      <div className="fixed right-3 bottom-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shadow-sm bg-white/90 dark:bg-gray-800/90">
          <HelpCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="sr-only">Ayuda</span>
        </Button>
      </div>

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
    </main>
  )
}

// El listado de canales ahora lo provee el layout externo, por lo que el
// componente RoomNode ya no es necesario en este archivo.

/* ---------- Panel de miembros ---------- */
function MembersSection({ title, members }: { title: string; members: Member[] }) {
  return (
    <div>
      <div className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${title.includes('Conectados') ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        {title}
      </div>
      <ul className="space-y-2">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
            <PresenceAvatar name={m.name} status={m.status} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{m.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{m.status === "online" ? "En línea" : "Desconectado"}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PresenceAvatar({ name, status }: { name: string; status: "online" | "offline" }) {
  const initial = name.charAt(0).toUpperCase()
  const isOnline = status === "online"
  return (
    <div className="relative">
      <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-700">
        <AvatarImage src="/diverse-user-avatars.png" alt={name} />
        <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          {initial}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-900 shadow-sm",
          isOnline ? "bg-emerald-500" : "bg-gray-400",
        )}
        aria-label={isOnline ? "Usuario en línea" : "Usuario desconectado"}
        role="status"
      />
    </div>
  )
}

/* ---------- Mensajes ---------- */
function MessageBubble({
  text = "Mensaje",
  time = "3:59 p. m.",
  fromMe = true,
  userName,
  userAvatar,
}: {
  text?: string
  time?: string
  fromMe?: boolean
  userName?: string
  userAvatar?: string
}) {
  if (fromMe) {
    return (
      <div className="mb-2 flex items-end justify-end gap-2">
        <div className="max-w-[70%]">
          <div
            className="inline-block rounded-2xl rounded-br-md bg-blue-500 px-3 py-2 text-white text-[13px] leading-5 shadow-sm break-words whitespace-pre-wrap"
            style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
          >
            {text}
          </div>
          <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 text-right">{time}</div>
        </div>
        <Avatar className="h-7 w-7">
          <AvatarImage src={userAvatar || "/diverse-user-avatars.png"} alt="Tú" />
          <AvatarFallback className="text-[11px]">Tú</AvatarFallback>
        </Avatar>
      </div>
    )
  }

  return (
    <div className="mb-2 flex items-end gap-2">
      <Avatar className="h-7 w-7">
        <AvatarImage src="/diverse-user-avatars.png" alt={userName || "Usuario"} />
        <AvatarFallback className="text-[11px]">{(userName || "U").charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="max-w-[70%]">
        {userName && (
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">{userName}</div>
        )}
        <div
          className="inline-block rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-[13px] leading-5 text-gray-900 dark:text-gray-100 break-words whitespace-pre-wrap"
          style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        >
          {text}
        </div>
        <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{time}</div>
      </div>
    </div>
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
