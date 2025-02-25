import { useEffect, useRef, useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Hash,
  Send,
  Users,
  Search,
  Paperclip,
  Smile,
  ChevronDown,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  ImageIcon,
  Video,
  File,
  Download,
  X,
  Check,
  CheckCheck,
} from "lucide-react"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"


import { AnimatePresence, motion } from "framer-motion"
import { useTypingIndicator } from "@/hooks/use-typing-indicator"
import { useChatStore, type Message } from "@/hooks/use-chat-store"




type Channel = {
  id: string
  name: string
  category: string
  unreadCount?: number
}

// type Message = {
//   id: string
//   content: string
//   sender: string
//   timestamp: Date
//   reactions?: { emoji: string; count: number }[]
//   attachments?: {
//     name: string
//     url: string
//     type: "image" | "document" | "video" | "audio"
//     size: string
//   }[]
//   isThread?: boolean
//   replies?: number
// }

const currentUser = {
  id: "current-user",
  name: "You",
  avatar: "/placeholder.svg?height=32&width=32",
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [currentChannel, setCurrentChannel] = useState("general")
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isTyping, startTyping } = useTypingIndicator()

  const { messages, addMessage, addReaction } = useChatStore()

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const size = file.size / 1024 / 1024 // size in MB
      return size <= 50 // max 50MB
    })

    setFiles((prev) => [...prev, ...validFiles])

    // Simulate upload progress
    validFiles.forEach((file) => {
      simulateFileUpload(file)
    })
  }

  const simulateFileUpload = (file: File) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: progress,
      }))

      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 300)
  }

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  const channels: Channel[] = [
    { id: "announcements", name: "Announcements", category: "Important", unreadCount: 2 },
    { id: "general", name: "General", category: "Channels" },
    { id: "random", name: "Random", category: "Channels", unreadCount: 5 },
    { id: "support", name: "Support", category: "Channels" },
    { id: "design", name: "Design", category: "Teams" },
    { id: "engineering", name: "Engineering", category: "Teams" },
  ]

  const members = [
    { id: 1, name: "Sarah Wilson", online: true, avatar: "/placeholder.svg?height=32&width=32", status: "💻 Working" },
    {
      id: 2,
      name: "Michael Chen",
      online: true,
      avatar: "/placeholder.svg?height=32&width=32",
      status: "🎧 In a meeting",
    },
    { id: 3, name: "Emma Davis", online: false, avatar: "/placeholder.svg?height=32&width=32", lastSeen: "2h ago" },
    {
      id: 4,
      name: "James Miller",
      online: true,
      avatar: "/placeholder.svg?height=32&width=32",
      status: "✍️ Writing...",
    },
    { id: 5, name: "Lisa Anderson", online: false, avatar: "/placeholder.svg?height=32&width=32", lastSeen: "1d ago" },
  ]


  const groupedChannels = channels.reduce(
    (acc, channel) => {
      if (!acc[channel.category]) {
        acc[channel.category] = []
      }
      acc[channel.category].push(channel)
      return acc
    },
    {} as Record<string, Channel[]>,
  )

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() && files.length === 0) return

    const attachments = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/")
        ? ("image" as const)
        : file.type.startsWith("video/")
          ? ("video" as const)
          : ("document" as const),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    }))

    addMessage({
      content: input,
      sender: currentUser,
      attachments,
    })

    setInput("")
    setFiles([])
    setUploadProgress({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    startTyping()
  }

  const MessageStatus = ({ status }: { status: Message["status"] }) => {
    switch (status) {
      case "sending":
        return <div className="animate-pulse w-4 h-4 rounded-full bg-muted" />
      case "sent":
        return <Check className="w-4 h-4 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-primary" />
      case "error":
        return <X className="w-4 h-4 text-destructive" />
    }
  }

  return (
    <div className="flex h-screen bg-background transition-colors duration-150">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-semibold">Workspace Name</h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search channels" className="pl-9" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            {Object.entries(groupedChannels).map(([category, categoryChannels]) => (
              <div key={category}>
                <div className="text-sm font-medium text-muted-foreground px-2 py-1 flex items-center justify-between">
                  <span>{category}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="space-y-1 mt-1">
                  {categoryChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setCurrentChannel(channel.id)}
                      className={cn(
                        "w-full px-2 py-1.5 rounded-md text-sm flex items-center justify-between group hover:bg-accent",
                        currentChannel === channel.id ? "bg-accent" : "",
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4" />
                        <span>{channel.name}</span>
                      </div>
                      {channel.unreadCount && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5" />
            <h2 className="font-semibold">{channels.find((c) => c.id === currentChannel)?.name}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notification preferences</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon">
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={message.sender.avatar} />
                          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{message.sender.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(message.timestamp), "h:mm a")}
                            </span>
                            <MessageStatus status={message.status} />
                          </div>
                          {message.content && <p className="text-sm mt-1">{message.content}</p>}
                          {message.attachments?.map((attachment, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="mt-2"
                            >
                              {attachment.type === "image" ? (
                                <div className="relative rounded-lg overflow-hidden">
                                  <img
                                    src={attachment.url || "/placeholder.svg"}
                                    alt={attachment.name}
                                    className="max-h-[300px] object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 p-2 rounded-lg bg-accent">
                                  <File className="w-4 h-4" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                  </div>
                                  <Button variant="ghost" size="icon">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </motion.div>
                          ))}

                          {/* Message Actions */}
                          <div className="flex items-center space-x-2 mt-2">
                            {message.reactions?.map((reaction, i) => (
                              <Button
                                key={i}
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => addReaction(message.id, reaction.emoji)}
                              >
                                {reaction.emoji} {reaction.count}
                              </Button>
                            ))}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => addReaction(message.id, "👍")}
                              >
                                <Smile className="w-4 h-4 mr-1" />
                                Add reaction
                              </Button>
                              {message.isThread && (
                                <Button variant="ghost" size="sm" className="h-6 px-2">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  {message.replies} {message.replies === 1 ? "reply" : "replies"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2 text-sm text-muted-foreground"
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span>Someone is typing...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg transition-colors",
                  dragActive ? "border-primary bg-primary/10" : "border-muted",
                  files.length > 0 ? "mb-4" : "mb-0",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {files.length > 0 && (
                  <div className="p-4 space-y-3">
                    {files.map((file) => (
                      <div key={file.name} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {file.type.startsWith("image/") ? (
                              <ImageIcon className="w-4 h-4" />
                            ) : file.type.startsWith("video/") ? (
                              <Video className="w-4 h-4" />
                            ) : (
                              <File className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full mt-2">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{
                                width: `${uploadProgress[file.name] || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex space-x-2 p-4">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder={`Message #${currentChannel}`}
                    className="flex-1"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          type="button"
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Attach files</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFiles(Array.from(e.target.files))
                      }
                    }}
                  />
                  <Button type="submit" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="w-64 border-l p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Members - {members.length}</h3>
              <Button variant="ghost" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="group">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                            member.online ? "bg-green-500" : "bg-gray-400",
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{member.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.online ? member.status : member.lastSeen}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

