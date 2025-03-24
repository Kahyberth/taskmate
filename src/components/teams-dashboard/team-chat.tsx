import type React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SendIcon,
  PaperclipIcon,
  SmileIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ImageIcon,
  MicIcon,
  MoreHorizontalIcon,
  MessageSquare,
  Users,
  Plus,
  Search,
  X,
  FileIcon,
  FileTextIcon,
  FileImageIcon,
  FileIcon as FilePdfIcon,
  UserPlus,
  Settings,
  LogOut,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "@/context/AuthContext";

type ChatGroup = {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  initials: string;
  isDirectMessage: boolean;
  members: ChatMember[];
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
};

type ChatMember = {
  id: number;
  name: string;
  avatar: string;
  initials: string;
  status: "online" | "offline" | "away";
};

type FileAttachment = {
  id: number;
  name: string;
  size: string;
  type: "image" | "pdf" | "document" | "other";
  url: string;
  thumbnailUrl?: string;
};

type Message = {
  id: string;
  sender: ChatMember;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  attachments?: FileAttachment[];
};

const chatMembers: ChatMember[] = [
  { id: 1, name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "AJ", status: "online" },
  { id: 2, name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC", status: "online" },
  { id: 3, name: "Michael Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "MR", status: "away" },
  { id: 4, name: "Emily Taylor", avatar: "/placeholder.svg?height=32&width=32", initials: "ET", status: "offline" },
  { id: 5, name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK", status: "online" },
  { id: 6, name: "Jessica Patel", avatar: "/placeholder.svg?height=32&width=32", initials: "JP", status: "offline" },
  { id: 7, name: "You", avatar: "/placeholder.svg?height=32&width=32", initials: "YO", status: "online" },
];



const isMobile = () => window.innerWidth < 768;

export default function TeamChat({ channels }: { channels: any[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(channels);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket>();
  const { userProfile } = useContext(AuthContext);

  const selectedGroup =
    chatGroups.find((group) => group.id === selectedGroupId) || chatGroups[0];

  useEffect(() => {
    setChatGroups(channels);
  }, [channels]);

  useEffect(() => {
    if (chatGroups.length > 0) {
      setSelectedGroupId(chatGroups[0].id);
    }
  }, [chatGroups]);

  useEffect(() => {
    if (!userProfile || !selectedGroup) return;
    const socket = io("http://localhost:4005", { auth: { userProfile } });
    socket.emit("join", selectedGroup.id);
  
    socket.on(
      "messages",
      (data: Array<{ id: string; user_id: string; value: string; timestamp: string }>) => {
        setMessages((prev) => {
          const currentMessages = prev[selectedGroup.id] || [];
          const newMessages = data
            .filter((msg) =>
              !currentMessages.some((m) => m.id.toString() === msg.id.toString())
            )
            .map((msg) => ({
              id: msg.id,
              sender:
                chatMembers.find((m) => m.id.toString() === msg.user_id.toString()) ||
                chatMembers[6],
              content: msg.value,
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              // Si el id del mensaje coincide con el id del usuario actual, se marca como mensaje propio
              isCurrentUser: msg.user_id.toString() === userProfile?.id.toString(),
            }));
          return {
            ...prev,
            [selectedGroup.id]: [...currentMessages, ...newMessages],
          };
        });
      }
    );
    
    
    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, [userProfile, selectedGroup]);
  
  
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedGroupId]);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(isMobile());
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = () => {

    if (!socketRef.current) return;

    if (newMessage.trim() || fileUploads.length > 0) {
      setIsSending(true);
      setTimeout(() => {
        const fileAttachments: FileAttachment[] = fileUploads.map((file, index) => {
          let type: "image" | "pdf" | "document" | "other" = "other";
          if (file.type.startsWith("image/")) {
            type = "image";
          } else if (file.type === "application/pdf") {
            type = "pdf";
          } else if (file.type.includes("document") || file.type.includes("sheet") || file.type.includes("text")) {
            type = "document";
          }
          return {
            id: Date.now() + index,
            name: file.name,
            size: formatFileSize(file.size),
            type,
            url: URL.createObjectURL(file),
            thumbnailUrl: type === "image" ? URL.createObjectURL(file) : undefined,
          };
        });
        const newMsg: Message = {
          id: Date.now().toString(),
          sender: chatMembers[6],
          content: newMessage.trim(),
          timestamp: getCurrentTime(),
          isCurrentUser: true,
          attachments: fileAttachments.length > 0 ? fileAttachments : undefined,
        };
        setMessages((prev) => ({
          ...prev,
          [selectedGroupId]: [...(prev[selectedGroupId] || []), newMsg],
        }));

        socketRef.current?.emit("message", {
          channel: selectedGroup.id,
          value: newMsg.content,
        });


        setChatGroups((prev) =>
          prev.map((group) =>
            group.id === selectedGroupId
              ? {
                  ...group,
                  lastMessage: {
                    content:
                      newMessage.trim() ||
                      (fileAttachments.length > 0 ? `Envió ${fileAttachments.length} archivo(s)` : ""),
                    timestamp: getCurrentTime(),
                  },
                }
              : group
          )
        );
        setNewMessage("");
        setFileUploads([]);
        setIsSending(false);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFileUploads((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFileUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FileImageIcon className="h-4 w-4" />;
    } else if (file.type === "application/pdf") {
      return <FilePdfIcon className="h-4 w-4" />;
    } else if (file.type.includes("document") || file.type.includes("sheet") || file.type.includes("text")) {
      return <FileTextIcon className="h-4 w-4" />;
    } else {
      return <FileIcon className="h-4 w-4" />;
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() && selectedMembers.length > 0) {
      const currentUserIncluded = selectedMembers.includes(7);
      const finalMembers = currentUserIncluded ? selectedMembers : [...selectedMembers, 7];
      const newGroup: ChatGroup = {
        id: Date.now(),
        name: newGroupName.trim(),
        description: newGroupDescription.trim() || undefined,
        initials: newGroupName
          .trim()
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .substring(0, 2),
        isDirectMessage: false,
        members: finalMembers.map((id) => chatMembers.find((member) => member.id === id)!),
        unreadCount: 0,
      };
      setChatGroups((prev) => [newGroup, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newGroup.id]: [],
      }));
      setSelectedGroupId(newGroup.id);
      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedMembers([]);
      setShowNewGroupDialog(false);
    }
  };

  const handleStartDirectMessage = (memberId: number) => {
    const existingDM = chatGroups.find(
      (group) =>
        group.isDirectMessage &&
        group.members.length === 2 &&
        group.members.some((m) => m.id === memberId) &&
        group.members.some((m) => m.id === 7)
    );
    if (existingDM) {
      setSelectedGroupId(existingDM.id);
    } else {
      const member = chatMembers.find((m) => m.id === memberId)!;
      const newDM: ChatGroup = {
        id: Date.now(),
        name: member.name,
        avatar: member.avatar,
        initials: member.initials,
        isDirectMessage: true,
        members: [member, chatMembers[6]],
        unreadCount: 0,
      };
      setChatGroups((prev) => [newDM, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newDM.id]: [],
      }));
      setSelectedGroupId(newDM.id);
    }
    setShowMembersDialog(false);
  };

  const renderFileAttachment = (attachment: FileAttachment) => {
    switch (attachment.type) {
      case "image":
        return (
          <div className="relative rounded-md overflow-hidden border border-border/50 max-w-[200px]">
            <img
              src={attachment.thumbnailUrl || attachment.url}
              alt={attachment.name}
              className="max-w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1 text-xs truncate">
              {attachment.name}
            </div>
          </div>
        );
      case "pdf":
        return (
          <div className="flex items-center p-2 rounded-md border border-border/50 bg-background/50">
            <FilePdfIcon className="h-8 w-8 text-red-500 mr-2" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-muted-foreground">{attachment.size}</p>
            </div>
          </div>
        );
      case "document":
        return (
          <div className="flex items-center p-2 rounded-md border border-border/50 bg-background/50">
            <FileTextIcon className="h-8 w-8 text-blue-500 mr-2" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-muted-foreground">{attachment.size}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center p-2 rounded-md border border-border/50 bg-background/50">
            <FileIcon className="h-8 w-8 text-muted-foreground mr-2" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-muted-foreground">{attachment.size}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="border bg-gradient-to-br from-card to-card/80 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
      {chatGroups.length === 0 ? (
        <div>Cargando chats...</div>
      ) : (
        <>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Team Chat</CardTitle>
                  <CardDescription>{isExpanded ? "Comunicación en tiempo real" : "5 mensajes sin leer"}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Opciones de Chat</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Silenciar Notificaciones</DropdownMenuItem>
                    <DropdownMenuItem>Buscar Mensajes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowNewGroupDialog(true)}>Crear Grupo</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Configuración</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleExpanded}
                  aria-label={isExpanded ? "Colapsar chat" : "Expandir chat"}
                  className="h-8 w-8 rounded-full"
                >
                  {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          {isExpanded && (
            <>
              <CardContent className="p-0 flex">
                {/* Sidebar de grupos */}
                <div className="w-64 border-r border-border/40 flex flex-col">
                  <div className="p-3 border-b border-border/40">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar chats..."
                        className="pl-8 w-full bg-background/50 border-border/50 focus:bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-border/40">
                    <h3 className="text-sm font-medium">Chats</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => setShowMembersDialog(true)}
                      >
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => setShowNewGroupDialog(true)}
                      >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="h-[calc(100%-120px)] overflow-y-auto p-2 scrollbar-thin">
                      <div className="space-y-1">
                        {chatGroups
                          .filter(
                            (group) =>
                              group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
                          )
                          .map((group) => (
                            <button
                              key={group.id}
                              className={cn(
                                "w-full flex items-center p-2 rounded-md text-left transition-colors",
                                selectedGroupId === group.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                              )}
                              onClick={() => {
                                setSelectedGroupId(group.id);
                                setChatGroups((prev) =>
                                  prev.map((g) => (g.id === group.id ? { ...g, unreadCount: 0 } : g))
                                );
                              }}
                            >
                              <div className="relative">
                                <Avatar className="h-9 w-9 mr-2">
                                  {group.avatar ? <AvatarImage src={group.avatar} /> : null}
                                  <AvatarFallback
                                    className={cn("text-xs font-medium", group.isDirectMessage ? "bg-primary/10" : "bg-primary/20")}
                                  >
                                    {group.initials}
                                  </AvatarFallback>
                                </Avatar>
                                {group.isDirectMessage &&
                                  group.members.some((m) => m.id !== 7 && m.status === "online") && (
                                    <span className="absolute bottom-0 right-1.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                                  )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm truncate">{group.name}</p>
                                  {group.lastMessage && (
                                    <span className="text-xs text-muted-foreground">{group.lastMessage.timestamp}</span>
                                  )}
                                </div>
                                {group.lastMessage && (
                                  <p className="text-xs text-muted-foreground truncate">{group.lastMessage.content}</p>
                                )}
                              </div>
                              {group.unreadCount > 0 && (
                                <Badge className="ml-1 bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center rounded-full text-xs">
                                  {group.unreadCount}
                                </Badge>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-primary/10 text-xs font-medium">YO</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">You</p>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Preferencias</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <LogOut className="h-4 w-4 mr-2" />
                            Cerrar sesión
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                {/* Área de mensajes */}
                <div className="flex-1 flex flex-col">
                  <div className="p-3 border-b border-border/40 flex items-center justify-between">
                    <div className="flex items-center">
                      {showSidebar ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full mr-2 md:hidden"
                          onClick={() => setShowSidebar(false)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full mr-2"
                          onClick={() => setShowSidebar(true)}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      )}
                      <Avatar className="h-8 w-8 mr-2">
                        {selectedGroup.avatar ? <AvatarImage src={selectedGroup.avatar} /> : null}
                        <AvatarFallback>{selectedGroup.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{selectedGroup.name}</p>
                        {selectedGroup.isDirectMessage ? (
                          <p className="text-xs text-muted-foreground">
                            {selectedGroup.members.find((m) => m.id !== 7)?.status === "online"
                              ? "En línea"
                              : "Desconectado"}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">{selectedGroup.members.length} miembros</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                            <MoreHorizontalIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver información</DropdownMenuItem>
                          <DropdownMenuItem>Añadir miembros</DropdownMenuItem>
                          <DropdownMenuItem>Silenciar notificaciones</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Abandonar grupo</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="h-[400px] overflow-y-auto p-4 scrollbar-thin">
                      <div className="space-y-4">
                        {messages[selectedGroupId] && messages[selectedGroupId].length > 0 ? (
                          messages[selectedGroupId].map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex max-w-[80%] ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                              >
                                <Avatar className={`h-8 w-8 ${message.isCurrentUser ? "ml-2" : "mr-2"}`}>
                                  <AvatarImage src={message.sender.avatar} />
                                  <AvatarFallback className="bg-primary/10 text-xs font-medium">
                                    {message.sender.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`rounded-2xl p-3 ${
                                    message.isCurrentUser
                                      ? "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground"
                                      : "bg-card border"
                                  }`}
                                >
                                  {!message.isCurrentUser && (
                                    <p className="font-semibold text-sm mb-1">{message.sender.name}</p>
                                  )}
                                  {message.content && <p className="text-sm">{message.content}</p>}
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div
                                      className={`mt-2 space-y-2 ${
                                        message.content ? "pt-2 border-t border-border/20" : ""
                                      }`}
                                    >
                                      {message.attachments.map((attachment) => (
                                        <div key={attachment.id}>{renderFileAttachment(attachment)}</div>
                                      ))}
                                    </div>
                                  )}
                                  <p
                                    className={`text-xs mt-1 ${
                                      message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                                    }`}
                                  >
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground">No hay mensajes</div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </div>
                  {fileUploads.length > 0 && (
                    <div className="px-3 py-2 border-t border-border/40 bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium">Archivos adjuntos ({fileUploads.length})</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => setFileUploads([])}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {fileUploads.map((file, index) => (
                          <div key={index} className="relative bg-background rounded-md border border-border/50 p-1.5 pr-7 flex items-center text-xs">
                            {getFileIcon(file)}
                            <span className="ml-1.5 max-w-[120px] truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full absolute right-1 top-1/2 -translate-y-1/2"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <CardFooter className="border-t bg-card/50 p-3">
                    <div className="flex items-center w-full gap-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} multiple />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                          <MicIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="relative flex-1">
                        <Input
                          placeholder="Escribe tu mensaje..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="pr-10 bg-background/50 border-border/50 focus:bg-background rounded-full pl-4"
                          disabled={isSending || isUploading}
                        />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7 rounded-full">
                          <SmileIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={(!newMessage.trim() && fileUploads.length === 0) || isSending || isUploading}
                        className="rounded-full"
                        size="icon"
                      >
                        {isSending || isUploading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        ) : (
                          <SendIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </div>
              </CardContent>
              <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Crear nuevo grupo</DialogTitle>
                    <DialogDescription>Crea un nuevo grupo de chat para colaborar con tu equipo.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="group-name">Nombre del grupo</Label>
                      <Input
                        id="group-name"
                        placeholder="Ej: Equipo de Desarrollo"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group-description">Descripción (opcional)</Label>
                      <Textarea
                        id="group-description"
                        placeholder="Describe el propósito de este grupo"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Miembros</Label>
                      <div className="max-h-[200px] overflow-y-auto scrollbar-thin">
                        <div className="space-y-1">
                          {chatMembers
                            .filter((member) => member.id !== 7)
                            .map((member) => (
                              <div key={member.id} className="flex items-center py-1.5 px-2 hover:bg-muted/50 rounded-md">
                                <input
                                  type="checkbox"
                                  id={`member-${member.id}`}
                                  checked={selectedMembers.includes(member.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMembers((prev) => [...prev, member.id]);
                                    } else {
                                      setSelectedMembers((prev) => prev.filter((id) => id !== member.id));
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor={`member-${member.id}`} className="flex items-center flex-1 cursor-pointer">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{member.name}</span>
                                </label>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "ml-auto",
                                    member.status === "online"
                                      ? "bg-green-100 text-green-700"
                                      : member.status === "away"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-slate-100 text-slate-700"
                                  )}
                                >
                                  {member.status === "online" ? "En línea" : member.status === "away" ? "Ausente" : "Desconectado"}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewGroupDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateGroup} disabled={!newGroupName.trim() || selectedMembers.length === 0}>
                      <Users className="h-4 w-4 mr-2" />
                      Crear grupo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Nuevo mensaje directo</DialogTitle>
                    <DialogDescription>Selecciona un miembro para iniciar una conversación.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="relative mb-4">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Buscar miembros..." className="pl-8 w-full" />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto scrollbar-thin">
                      <div className="space-y-1 px-1">
                        {chatMembers
                          .filter((member) => member.id !== 7)
                          .map((member) => (
                            <button
                              key={member.id}
                              className="w-full flex items-center p-2 hover:bg-muted/50 rounded-md text-left"
                              onClick={() => handleStartDirectMessage(member.id)}
                            >
                              <div className="relative">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="bg-primary/10 text-xs">{member.initials}</AvatarFallback>
                                </Avatar>
                                <span
                                  className={cn(
                                    "absolute bottom-0 right-1.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                                    member.status === "online"
                                      ? "bg-green-500"
                                      : member.status === "away"
                                      ? "bg-amber-500"
                                      : "bg-slate-300"
                                  )}
                                ></span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{member.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {member.status === "online" ? "En línea" : member.status === "away" ? "Ausente" : "Desconectado"}
                                </p>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowMembersDialog(false)}>
                      Cancelar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </>
      )}
    </Card>
  );
}
