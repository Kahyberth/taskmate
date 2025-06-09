import { useContext, useState } from "react"
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthContext } from "@/context/AuthContext"
import { apiClient } from "@/api/client-gateway"

interface AIAssistantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIAssistantDialog({ open, onOpenChange }: AIAssistantDialogProps) {
  const [aiQuery, setAiQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiIsThinking, setAiIsThinking] = useState(false)
  const { user } = useContext(AuthContext)

  const handleAiQuery = async () => {
    if (!aiQuery.trim() || !user?.id) return

    setAiIsThinking(true)
    setAiResponse("")

    try {
      const response = await apiClient.post(`/projects/ai-response`, {
          query: aiQuery,
          userId: user.id
      })

      setAiResponse(response.data.response)
    } catch (error) {
      console.error('Error fetching AI response:', error)
      setAiResponse("Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.")
    } finally {
      setAiIsThinking(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-white max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
            TaskMate AI Assistant
          </DialogTitle>
          <DialogDescription>Ask me anything about your tasks, projects, or productivity insights.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="bg-white/5 rounded-lg p-4 text-sm">
            <p className="font-medium text-purple-300">Try asking:</p>
            <ul className="mt-2 space-y-1 text-white/70">
              <li
                className="hover:text-white cursor-pointer"
                onClick={() => setAiQuery("What's my productivity like today?")}
              >
                • What's my productivity like today?
              </li>
              <li
                className="hover:text-white cursor-pointer"
                onClick={() => setAiQuery("Generate a summary report of this week")}
              >
                • Generate a summary report of this week
              </li>
              <li
                className="hover:text-white cursor-pointer"
                onClick={() => setAiQuery("When should I schedule the next team meeting?")}
              >
                • When should I schedule the next team meeting?
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                placeholder="Ask TaskMate AI..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="bg-white/5 border-white/10 text-white pr-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAiQuery()
                  }
                }}
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 bg-transparent hover:bg-white/10"
                onClick={handleAiQuery}
              >
                <Sparkles className="h-4 w-4 text-purple-400" />
              </Button>
            </div>

            {aiIsThinking && (
              <div className="p-4 rounded-lg bg-white/5 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></span>
                  <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse animation-delay-200"></span>
                  <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse animation-delay-500"></span>
                </div>
                <span className="text-sm text-white/70">TaskMate AI is thinking...</span>
              </div>
            )}

            {aiResponse && (
              <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="font-medium text-purple-300">TaskMate AI</span>
                </div>
                <div className="text-sm prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <ThumbsDown className="h-4 w-4" />
                    Not Helpful
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <div className="text-xs text-white/50 flex items-center">
            <Badge variant="outline" className="mr-2 border-purple-500/30 text-purple-300">
              TaskMate AI
            </Badge>
            Powered by DeepSeek
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

