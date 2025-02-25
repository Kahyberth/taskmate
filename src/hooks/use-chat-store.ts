import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Attachment = {
  name: string
  url: string
  type: "image" | "document" | "video" | "audio"
  size: string
}

export type Message = {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "error"
  reactions?: { emoji: string; count: number }[]
  attachments?: Attachment[]
  isThread?: boolean
  replies?: number
}

type ChatStore = {
  messages: Message[]
  addMessage: (message: Omit<Message, "id" | "status" | "timestamp">) => void
  updateMessageStatus: (id: string, status: Message["status"]) => void
  addReaction: (messageId: string, emoji: string) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) => {
        const newMessage = {
          ...message,
          id: Date.now().toString(),
          status: "sending" as const,
          timestamp: new Date(),
        }

        set((state) => ({
          messages: [...state.messages, newMessage],
        }))

        // Simulate message being sent
        setTimeout(() => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: "sent" as const } : msg,
            ),
          }))
        }, 1000)

        // Simulate message being delivered
        setTimeout(() => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: "delivered" as const } : msg,
            ),
          }))
        }, 2000)
      },
      updateMessageStatus: (id, status) =>
        set((state) => ({
          messages: state.messages.map((message) => (message.id === id ? { ...message, status } : message)),
        })),
      addReaction: (messageId, emoji) =>
        set((state) => ({
          messages: state.messages.map((message) => {
            if (message.id !== messageId) return message

            const reactions = message.reactions || []
            const existingReaction = reactions.find((r) => r.emoji === emoji)

            if (existingReaction) {
              return {
                ...message,
                reactions: reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)),
              }
            }

            return {
              ...message,
              reactions: [...reactions, { emoji, count: 1 }],
            }
          }),
        })),
    }),
    {
      name: "chat-store",
    },
  ),
)

