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
import { io, type Socket } from "socket.io-client";
import { AuthContext } from "@/context/AuthContext";
import { apiClient } from "@/api/client-gateway";
import type { Members } from "@/interfaces/members.interface";
import { Loader } from "@mantine/core";

type ChatGroup = {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  initials: string;
  members: ChatMember[];
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
};

type ChatMember = {
  id: string;
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

const isMobile = () => window.innerWidth < 768;

export default function TeamChat({
  channels,
  teamMembers,
  team_data,
}: {
  channels: any[];
  teamMembers: Members[];
  team_data: { name: string; [key: string]: any };
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(channels);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(channels[0]?.id || "");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

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
    if (chatGroups.length > 0 && !chatGroups.some(g => g.id === selectedGroupId)) {
      setSelectedGroupId(chatGroups[0].id);
    }
  }, [chatGroups, selectedGroupId]);

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const transformMessage = (data: any): Message => {
    console.log('[FRONTEND] Transformando mensaje:', data);
    const timestamp = data.timestamp
      ? new Date(data.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Usar zona horaria local
        })
      : getCurrentTime();
    console.log('[FRONTEND] Timestamp transformado:', timestamp);
    
    return {
      id: data.id,
      sender: {
        id: data.userId || data.user_id,
        name: data.userName,
        avatar: data.avatar,
        initials: data.userName ? data.userName.slice(0, 2).toUpperCase() : "",
        status: "online" as "online",
      },
      content: data.value || data.message,
      timestamp,
      isCurrentUser: userProfile ? String(data.userId || data.user_id) === String(userProfile.id) : false,
      attachments: [],
    };
  };

  // 1) Conectar socket una sola vez y registrar handlers con logs
  useEffect(() => {
    if (!userProfile) return;
    const socket = io(import.meta.env.VITE_CHAT_WS, { auth: { userProfile } });
    socketRef.current = socket;

    socket.on('messageHistory', ({ channelId, messages }: { channelId: string, messages: any[] }) => {
      console.log('[SOCKET] messageHistory recibido para canal:', channelId, messages);
      const msgs = messages.map(transformMessage);
      setMessages(prev => ({ ...prev, [channelId]: msgs }));
    });

    socket.on('newMessage', (data: any) => {
      console.log('[SOCKET] newMessage recibido:', data);
      const transformed = transformMessage(data);
      setMessages(prev => {
        // Busca el canal correcto desde el mensaje recibido
        const channelId = data.channelId || selectedGroupId;
        const current = prev[channelId] || [];
        // busca y reemplaza optimista o concatena
        const idx = current.findIndex(msg =>
          msg.isCurrentUser &&
          msg.content === transformed.content &&
          (!msg.id.match(/^[0-9a-fA-F-]{36}$/))
        );
        if (idx !== -1) {
          const copy = [...current];
          copy[idx] = transformed;
          return { ...prev, [channelId]: copy };
        }
        if (!current.some(msg => msg.id === transformed.id)) {
          return { ...prev, [channelId]: [...current, transformed] };
        }
        return prev;
      });
    });

    socket.on('joined', (channel) => {
      console.log('[SOCKET] joined a channel:', channel);
    });

    return () => { socket.disconnect(); };
  }, [userProfile]);

  // 2) Unirse a canal sin recrear socket
  useEffect(() => {
    if (socketRef.current && selectedGroupId) {
      console.log('[SOCKET] Emitiendo join para canal:', selectedGroupId);
      socketRef.current.emit('join', selectedGroupId);
    }
  }, [selectedGroupId]);

  // Mantener scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedGroupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedGroupId]);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(isMobile());
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = () => {
    if (!socketRef.current) return;

    if (newMessage.trim() || fileUploads.length > 0) {
      setIsSending(true);
      // Timeout de seguridad para evitar bloqueo eterno
      const timeout = setTimeout(() => setIsSending(false), 7000); // 7 segundos

      const fileAttachments: FileAttachment[] = fileUploads.map(
        (file, index) => {
          let type: "image" | "pdf" | "document" | "other" = "other";
          if (file.type.startsWith("image/")) {
            type = "image";
          } else if (file.type === "application/pdf") {
            type = "pdf";
          } else if (
            file.type.includes("document") ||
            file.type.includes("sheet") ||
            file.type.includes("text")
          ) {
            type = "document";
          }
          return {
            id: Date.now() + index,
            name: file.name,
            size: formatFileSize(file.size),
            type,
            url: URL.createObjectURL(file),
            thumbnailUrl:
              type === "image" ? URL.createObjectURL(file) : undefined,
          };
        }
      );

      const tempMessage: Message = {
        id: Date.now().toString(),
        sender: {
          id: userProfile?.id || "",
          name: userProfile?.name || "",
          avatar: userProfile?.profile.profile_picture || "",
          initials: userProfile?.name.slice(0, 2).toUpperCase() || "",
          status: "online" as "online",
        },
        content: newMessage.trim(),
        timestamp: getCurrentTime(),
        isCurrentUser: true,
        attachments: fileAttachments.length > 0 ? fileAttachments : undefined,
      };

      setMessages((prev) => ({
        ...prev,
        [selectedGroupId]: [...(prev[selectedGroupId] || []), tempMessage],
      }));

      setChatGroups((prev) =>
        prev.map((group) =>
          group.id === selectedGroupId
            ? {
                ...group,
                lastMessage: {
                  content:
                    newMessage.trim() ||
                    (fileAttachments.length > 0
                      ? `Envió ${fileAttachments.length} archivo(s)`
                      : ""),
                  timestamp: getCurrentTime(),
                },
              }
            : group
        )
      );

      socketRef.current?.emit(
        "message",
        {
          channel: selectedGroup.id,
          value: newMessage.trim(),
        },
        (response: any) => {
          clearTimeout(timeout);
          setIsSending(false);
          if (response && response.error) {
            // Si hay error, elimina el mensaje temporal
            setMessages((prev) => ({
              ...prev,
              [selectedGroupId]: prev[selectedGroupId].filter(msg => msg.id !== tempMessage.id)
            }));
            // Opcional: muestra un toast o alerta
            console.error("Error sending message:", response.error);
          }
        }
      );

      setNewMessage("");
      setFileUploads([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      setFileUploads([...fileUploads, ...Array.from(e.target.files)]);
      setIsUploading(false);
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
    } else if (
      file.type.includes("document") ||
      file.type.includes("sheet") ||
      file.type.includes("text")
    ) {
      return <FileTextIcon className="h-4 w-4" />;
    } else {
      return <FileIcon className="h-4 w-4" />;
    }
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim() && selectedMembers.length > 0) {
      try {
        const payload = {
          name: newGroupName.trim(),
          description: newGroupDescription.trim() || "",
          team_id: team_data.id,
          user_id: userProfile?.id || "",
          channel_name: newGroupName.trim() + " grupo",
          parentChannelId: selectedGroup.id,
        };

        const response = await apiClient.post(
          "channels/create-channel",
          payload
        );
        const createdChannel = response.data;

        const finalMembers = [...selectedMembers];
        const newGroup: ChatGroup = {
          id: createdChannel.id,
          name: createdChannel.name,
          description: createdChannel.description,
          initials: createdChannel.name
            .trim()
            .split(" ")
            .map((word: string) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2),
          members: finalMembers.map((id) => {
            const member = teamMembers.find((m) => m.member.id === id)?.member;
            return {
              id: member?.id || "",
              name: member?.name || "",
              avatar: member?.name.slice(0, 2).toUpperCase() || "",
              initials: member?.name.slice(0, 2).toUpperCase() || "",
              status: "online" as "online",
            };
          }),
          unreadCount: 0,
          lastMessage: undefined,
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
      } catch (error) {
        console.error("Error al crear el canal", error);
      }
    }
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

  if (!selectedGroup || !team_data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader color="violet" type="bars" />
      </div>
    );
  }

  return (
    <div className={`flex h-[calc(100vh-120px)] ${isMobileView ? 'flex-col' : 'flex-row'}`}>
      {showSidebar && (
        <div className={`${isMobileView ? 'w-full' : 'w-80'} border-r`}>
          <div className="p-3 border-b border-border/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search chats..."
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
                      group.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      (group.description &&
                        group.description
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()))
                  )
                  .map((group) => (
                    <button
                      key={group.id}
                      className={cn(
                        "w-full flex items-center p-2 rounded-md text-left transition-colors",
                        selectedGroupId === group.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setChatGroups((prev) =>
                          prev.map((g) =>
                            g.id === group.id
                              ? { ...g, unreadCount: 0 }
                              : g
                          )
                        );
                      }}
                    >
                      <div className="relative">
                        <Avatar className="h-9 w-9 mr-2">
                          {group.avatar ? (
                            <AvatarImage src={group.avatar} />
                          ) : null}
                          <AvatarFallback className="text-xs font-medium bg-primary/20">
                            {group.initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {group.name}
                          </p>
                          {group.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {group.lastMessage.timestamp}
                            </span>
                          )}
                        </div>
                        {group.lastMessage && (
                          <p className="text-xs text-muted-foreground truncate">
                            {group.lastMessage.content}
                          </p>
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
          <div className="p-3 border-t border-border/40 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={
                      userProfile?.profile?.profile_picture ||
                      "/placeholder.svg?height=32&width=32"
                    }
                  />
                  <AvatarFallback className="bg-primary/10 text-xs font-medium">
                    {userProfile?.name?.slice(0, 2).toUpperCase() ||
                      "YOU"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {userProfile?.name || "You"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Online
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
      <Card className="relative overflow-hidden bg-card border border-border/40 rounded-xl h-full w-full max-w-none flex flex-col overscroll-contain">
        {chatGroups.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader color="violet" type="bars" />
          </div>
        ) : (
          <>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{team_data?.name || "Cargando..."}</CardTitle>
                    <CardDescription>
                      {isExpanded
                        ? "Real-time communication"
                        : "5 unread messages"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        Mute Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem>Search Messages</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowNewGroupDialog(true)}
                      >
                        Create Group
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleExpanded}
                    aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
                    className="h-8 w-8 rounded-full"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronUpIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {isExpanded && (
              <>
                <CardContent className="p-0 flex flex-1 overflow-hidden">
                  {/* Messages area */}
                  <div className="flex-1 flex flex-col overflow-hidden ">
                    <div className="p-3 flex items-center justify-between">
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
                          {selectedGroup.avatar ? (
                            <AvatarImage src={selectedGroup.avatar} />
                          ) : null}
                          <AvatarFallback>
                            {selectedGroup.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {selectedGroup.name || "Cargando..."}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedGroup.members.length} members
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                        >
                          <Search className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                            >
                              <MoreHorizontalIcon className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View info</DropdownMenuItem>
                            <DropdownMenuItem>Add members</DropdownMenuItem>
                            <DropdownMenuItem>
                              Mute notifications
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              Leave group
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden ">
                      <div className="h-[calc(100%-80px)] overflow-y-auto p-3 scrollbar-thin">
                        <div className="space-y-4">
                          {messages[selectedGroupId] &&
                          messages[selectedGroupId].length > 0 ? (
                            messages[selectedGroupId].map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${
                                  message.isCurrentUser
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`flex max-w-[80%] ${
                                    message.isCurrentUser
                                      ? "flex-row-reverse"
                                      : "flex-row"
                                  }`}
                                >
                                  <Avatar
                                    className={`h-8 w-8 ${
                                      message.isCurrentUser ? "ml-2" : "mr-2"
                                    }`}
                                  >
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
                                      <p className="font-semibold text-sm mb-1">
                                        {message.sender.name}
                                      </p>
                                    )}
                                    {message.content && (
                                      <p className="text-sm">
                                        {message.content}
                                      </p>
                                    )}
                                    {message.attachments &&
                                      message.attachments.length > 0 && (
                                        <div
                                          className={`mt-2 space-y-2 ${
                                            message.content
                                              ? "pt-2 border-t border-border/20"
                                              : ""
                                          }`}
                                        >
                                          {message.attachments.map(
                                            (attachment) => (
                                              <div key={attachment.id}>
                                                {renderFileAttachment(
                                                  attachment
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    <p
                                      className={`text-xs mt-1 ${
                                        message.isCurrentUser
                                          ? "text-primary-foreground/70"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {message.timestamp}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-muted-foreground">
                              No messages
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                    </div>
                    {fileUploads.length > 0 && (
                      <div className="px-3 py-2 border-t border-border/40 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium">
                            Attached files ({fileUploads.length})
                          </p>
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
                            <div
                              key={index}
                              className="relative bg-background rounded-md border border-border/50 p-1.5 pr-7 flex items-center text-xs"
                            >
                              {getFileIcon(file)}
                              <span className="ml-1.5 max-w-[120px] truncate">
                                {file.name}
                              </span>
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
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleFileUpload}
                              multiple
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                          >
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                          >
                            <MicIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="relative flex-1">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pr-10 bg-background/50 border-border/50 focus:bg-background rounded-full pl-4"
                            disabled={isSending || isUploading}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-7 w-7 rounded-full"
                          >
                            <SmileIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={
                            (!newMessage.trim() && fileUploads.length === 0) ||
                            isSending ||
                            isUploading
                          }
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
                <Dialog
                  open={showNewGroupDialog}
                  onOpenChange={setShowNewGroupDialog}
                >
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create new group</DialogTitle>
                      <DialogDescription>
                        Create a new chat group to collaborate with your team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="group-name">Group name</Label>
                        <Input
                          id="group-name"
                          placeholder="e.g. Development Team"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="group-description">
                          Description (optional)
                        </Label>
                        <Textarea
                          id="group-description"
                          placeholder="Describe the purpose of this group"
                          value={newGroupDescription}
                          onChange={(e) =>
                            setNewGroupDescription(e.target.value)
                          }
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Members</Label>
                        <div className="max-h-[200px] overflow-y-auto scrollbar-thin">
                          <div className="space-y-1">
                            {teamMembers
                              .filter((m) => m.member.id !== userProfile?.id)
                              .map((m) => (
                                <div
                                  key={m.member.id}
                                  className="flex items-center py-1.5 px-2 hover:bg-muted/50 rounded-md"
                                >
                                  <input
                                    type="checkbox"
                                    id={`member-${m.member.id}`}
                                    checked={selectedMembers.includes(
                                      m.member.id
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedMembers((prev) => [
                                          ...prev,
                                          m.member.id,
                                        ]);
                                      } else {
                                        setSelectedMembers((prev) =>
                                          prev.filter(
                                            (id) => id !== m.member.id
                                          )
                                        );
                                      }
                                    }}
                                    className="mr-2"
                                  />
                                  <label
                                    htmlFor={`member-${m.member.id}`}
                                    className="flex items-center flex-1 cursor-pointer"
                                  >
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage
                                        src={m.member.name
                                          .slice(0, 2)
                                          .toUpperCase()}
                                      />
                                      <AvatarFallback className="text-[10px]">
                                        {m.member.name
                                          .slice(0, 2)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">
                                      {m.member.name}
                                    </span>
                                  </label>
                                  <Badge
                                    variant="outline"
                                    className="ml-auto bg-green-100 text-green-700"
                                  >
                                    Online
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewGroupDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateGroup}
                        disabled={
                          !newGroupName.trim() || selectedMembers.length === 0
                        }
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Create group
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
