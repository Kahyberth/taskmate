import { useState } from "react"
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

interface AIAssistantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIAssistantDialog({ open, onOpenChange }: AIAssistantDialogProps) {
  const [aiQuery, setAiQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiIsThinking, setAiIsThinking] = useState(false)


  const handleAiQuery = () => {
    if (!aiQuery.trim()) return

    setAiIsThinking(true)
    setAiResponse("")

    
    setTimeout(() => {
      setAiIsThinking(false)

     
      if (aiQuery.toLowerCase().includes("productivity")) {
        setAiResponse(
          "Based on your recent activity, I recommend focusing on the API Integration project today. Your productivity peaks between 9-11 AM, making this an ideal time for complex tasks. Would you like me to block this time on your calendar?",
        )
      } else if (aiQuery.toLowerCase().includes("report") || aiQuery.toLowerCase().includes("summary")) {
        setAiResponse(
          "This week, you completed 45 tasks (up 12% from last week) and spent 28 hours on active work. Your most productive day was Tuesday. Team collaboration has increased by 15%. Would you like a detailed report sent to your email?",
        )
      } else if (aiQuery.toLowerCase().includes("meeting") || aiQuery.toLowerCase().includes("schedule")) {
        setAiResponse(
          "I've analyzed your team's availability and found that Wednesday at 2 PM has the highest attendance probability. Based on the meeting topic, I recommend limiting it to 30 minutes. Would you like me to schedule this meeting?",
        )
      } else {
        setAiResponse(
          "I've analyzed your question and found relevant insights. Your current project is 65% complete, with an estimated completion date of next Friday. The main bottleneck appears to be the API integration task. Would you like suggestions on how to optimize this workflow?",
        )
      }
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
            TaskMate AI Assistant
          </DialogTitle>
          <DialogDescription>Ask me anything about your tasks, projects, or productivity insights.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
                <p className="text-sm">{aiResponse}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    Helpful
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ThumbsDown className="mr-1 h-3 w-3" />
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
              TaskMate AI 2.0
            </Badge>
            Powered by advanced machine learning
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

