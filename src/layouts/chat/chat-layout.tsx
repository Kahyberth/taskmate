import { ChatSidebar } from "@/components/chats/chat-sidebar";
import { EmptyState } from "@/components/chats/empty-state";
import { useState } from "react";

export function ChatMain() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <ChatSidebar onSelectChat={setSelectedChat} selectedChat={selectedChat} />
      {selectedChat ? <ChatMain /> : <EmptyState />}
    </div>
  );
}
