import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"
import {
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
import { useChatSocket } from "@/hooks/useChatSocket"
import { getMessages, Message as ApiMessage } from "@/api/channels"
import { AuthContext } from "@/context/AuthContext"
import { useOutletContext } from "react-router-dom"



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

interface ChatContext {
  selectedChannelId: string;
}

export default function Page() {
  const { selectedChannelId } = useOutletContext<ChatContext>();
  
  if (!selectedChannelId) {
    return (
      <main className="h-full w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Selecciona un canal</h3>
          <p className="text-gray-500 dark:text-gray-400">Elige un canal del sidebar para comenzar a chatear</p>
        </div>
      </main>
    );
  }
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
    if (!realUser || !selectedChannelId) return null;

    return {
      room: selectedChannelId,
      user: realUser
    };
  }, [selectedChannelId, realUser]);

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

  const roomMessages = useMemo(() => {
    const filtered = messages.filter((m) => m.roomId === selectedChannelId);
    console.log('Room messages for', selectedChannelId, ':', filtered);
    return filtered;
  }, [messages, selectedChannelId])

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
    if (!text || !selectedChannelId || !realUser) return

    sendSocketMessage({
      roomId: selectedChannelId,
      text,
    });

    const now = new Date()
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `m-${Date.now()}`
    const newMessage: Message = {
      id,
      roomId: selectedChannelId,
      text,
      time: formatTimeEs(now),
      fromMe: true,
      userName: `${realUser.name} ${realUser.lastName}`,
      avatar: '',
    }
    setMessages((prev) => [...prev, newMessage])
    setDraft("")
  }



  useEffect(() => {
    if (!selectedChannelId) return;

    setMessages([]);

    async function loadMessages() {
      setIsLoadingMessages(true);
      try {
        console.log('Loading messages for channel:', selectedChannelId);
        const apiMessages = await getMessages(selectedChannelId, 50);
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
        setIsLoadingMessages(false);
      }
    }

    loadMessages();
  }, [selectedChannelId, realUser]);

  useEffect(() => {
    if (!socket || !isConnected || !socketAuth) {
      console.log('Cannot join channel:', {
        hasSocket: !!socket,
        isConnected,
        hasSocketAuth: !!socketAuth
      });
      return;
    }

    console.log('Joining channel with auth:', socketAuth);
    joinChannel();
  }, [socket, isConnected, selectedChannelId, joinChannel, socketAuth]);

  useEffect(() => {
    console.log('Connection status:', {
      isConnected,
      onlineMembersCount: onlineMembers.length,
      offlineMembersCount: offlineMembers.length,
      selectedChannelId
    });
  }, [isConnected, onlineMembers.length, offlineMembers.length, selectedChannelId]);

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
  }, [messages, selectedChannelId])



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
      {/* Conversación principal */}
      <section className="flex flex-col h-full bg-white dark:bg-gray-900 min-h-0">
          <header className="h-16 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{selectedChannelId?.charAt(0).toUpperCase() || 'C'}</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    Canal Activo
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
              {isLoadingMessages && (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Cargando mensajes...</span>
                  </div>
                </div>
              )}
              {!isLoadingMessages && roomMessages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No hay mensajes</h3>
                  <p className="text-gray-500 dark:text-gray-400">¡Sé el primero en escribir en este canal!</p>
                </div>
              )}
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
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Smile className="h-5 w-5" />
                <span className="sr-only">Insertar emoji</span>
              </Button>

              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 h-12 text-sm border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    sendMessage()
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

      {/* Botón de ayuda flotante */}
      <div className="fixed right-3 bottom-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shadow-sm bg-white/90 dark:bg-gray-800/90">
          <HelpCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="sr-only">Ayuda</span>
        </Button>
      </div>


    </main>
  )
}



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


