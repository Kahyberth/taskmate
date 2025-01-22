import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}

const chats = [
  {
    id: "1",
    type: "direct",
    user: {
      name: "María García",
      image: "/placeholder.svg",
      status: "online",
    },
    lastMessage: "¿Podemos revisar el diseño?",
    timestamp: "10:30",
    unread: 2,
  },
  {
    id: "2",
    type: "group",
    name: "Equipo Frontend",
    image: "/placeholder.svg",
    lastMessage: "Carlos: Ya subí los cambios",
    timestamp: "09:45",
    participants: 5,
    unread: 0,
  },
  {
    id: "3",
    type: "direct",
    user: {
      name: "Ana Martínez",
      image: "/placeholder.svg",
      status: "offline",
    },
    lastMessage: "Gracias por la ayuda",
    timestamp: "Ayer",
    unread: 0,
  },
];

export function ChatSidebar({ selectedChat, onSelectChat }: ChatSidebarProps) {
  const [filter, setFilter] = useState("");

  const filteredChats = chats.filter((chat) => {
    const searchTerm = filter.toLowerCase();
    if (chat.type === "direct") {
      return chat.user?.name.toLowerCase().includes(searchTerm) ?? false;
    }
    return chat.name?.toLowerCase().includes(searchTerm);
  });

  return (
    <div className="flex w-80 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mensajes</h2>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar chats..."
            className="pl-8 bg-accent/50 border-0 ring-offset-accent focus-visible:ring-accent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="px-4">
        <TabsList className="w-full bg-accent/50 p-0.5">
          <TabsTrigger value="all" className="flex-1 text-xs">
            Todos
          </TabsTrigger>
          <TabsTrigger value="direct" className="flex-1 text-xs">
            Directos
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex-1 text-xs">
            Grupos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-accent",
                "relative overflow-hidden",
                selectedChat === chat.id && "bg-accent shadow-sm"
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage
                    src={chat.type === "direct" ? chat.user?.image : chat.image}
                  />
                  <AvatarFallback className="bg-primary/10">
                    {chat.type === "direct" ? (
                      chat.user?.name[0]
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                {chat.type === "direct" && (
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                      chat.user?.status === "online"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    )}
                  />
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {chat.type === "direct" ? chat.user?.name : chat.name}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {chat.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs text-muted-foreground">
                    {chat.lastMessage}
                  </span>
                  {chat.unread > 0 && (
                    <Badge
                      variant="default"
                      className="ml-2 h-5 w-5 rounded-full p-0 text-[10px] font-bold"
                    >
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
