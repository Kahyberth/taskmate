import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Clock, MessageSquare, RefreshCcw, Send, ChevronRight, BarChart2, Users, History, Settings, Moon, Sun, LogOut } from 'lucide-react'
// import { useFetch } from '@mantine/hooks'








const mockUsers = [
  { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40', role: 'Product Owner' },
  { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40', role: 'Scrum Master' },
  { id: 3, name: 'Charlie Davis', avatar: '/placeholder.svg?height=40&width=40', role: 'Developer' },
  { id: 4, name: 'Diana Miller', avatar: '/placeholder.svg?height=40&width=40', role: 'Designer' },
  { id: 5, name: 'Ethan Brown', avatar: '/placeholder.svg?height=40&width=40', role: 'QA Engineer' },
]

const mockUserStories = [
  { id: 1, title: 'Implement user authentication', description: 'As a user, I want to be able to securely log in to the application', priority: 'High', acceptanceCriteria: ['Secure password hashing', 'Two-factor authentication option', 'Password reset functionality'] },
  { id: 2, title: 'Create dashboard layout', description: 'As a user, I want to see a clear overview of my tasks and projects', priority: 'Medium', acceptanceCriteria: ['Responsive design', 'Customizable widgets', 'Real-time data updates'] },
  { id: 3, title: 'Develop API integration', description: 'As a developer, I want to integrate our app with external APIs', priority: 'High', acceptanceCriteria: ['OAuth 2.0 implementation', 'Rate limiting', 'Error handling and logging'] },
  { id: 4, title: 'Design responsive UI', description: 'As a user, I want the application to work seamlessly on all devices', priority: 'Medium', acceptanceCriteria: ['Mobile-first approach', 'Cross-browser compatibility', 'Accessibility compliance'] },
]

const fibonacciSequence = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?']

export function PlanningPokerRoom() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isVotingComplete, setIsVotingComplete] = useState(false)
  const [timer, setTimer] = useState(120)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string; timestamp: string }[]>([])
  const [currentStory, setCurrentStory] = useState(mockUserStories[0])
  const [storyIndex, setStoryIndex] = useState(0)
  const [votingHistory, setVotingHistory] = useState<{ story: string; average: number; date: string }[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)

  // const { data, loading, error } = useFetch<User[]>('/api/users');



  // useEffect(() => {}, [])


  useEffect(() => {
    if (timer > 0 && !isVotingComplete) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setIsVotingComplete(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isVotingComplete]);

  const handleCardSelect = (card: string) => {
    setSelectedCard(card)
  }

  const handleVoteComplete = () => {
    setIsVotingComplete(true)
    // In a real app, you'd calculate the actual average
    const averageVote = 8
    setVotingHistory([
      ...votingHistory,
      { story: currentStory.title, average: averageVote, date: new Date().toLocaleDateString() }
    ])
  }

  const handleRepeatVoting = () => {
    setIsVotingComplete(false)
    setSelectedCard(null)
    setTimer(120)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { user: 'You', message: chatMessage, timestamp: new Date().toLocaleTimeString() }
      ])
      setChatMessage('')
    }
  }

  const handleNextStory = () => {
    const nextIndex = (storyIndex + 1) % mockUserStories.length
    setCurrentStory(mockUserStories[nextIndex])
    setStoryIndex(nextIndex)
    setIsVotingComplete(false)
    setSelectedCard(null)
    setTimer(120)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleExitRoom = () => {
    // In a real app, you'd handle the room exit logic here
    console.log("Exiting room...")
    setIsExitDialogOpen(false)
    // Redirect to home page or perform other necessary actions
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex-1 flex flex-col">
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6 shadow-sm`}>
          <div className="flex justify-between items-center">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Planning Poker</h1>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="dark-mode"
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                      />
                      <Label htmlFor="dark-mode" className="sr-only">
                        Dark Mode
                      </Label>
                      {isDarkMode ? (
                        <Moon className="h-4 w-4 text-gray-100" />
                      ) : (
                        <Sun className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Dark Mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Room Settings</DialogTitle>
                    <DialogDescription>
                      Adjust the settings for your planning poker session.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <h4 className="mb-2 text-sm font-medium">Voting System</h4>
                    <div className="flex items-center space-x-2">
                      <Switch id="fibonacci" defaultChecked />
                      <Label htmlFor="fibonacci">Use Fibonacci sequence</Label>
                    </div>
                  </div>
                  <div className="py-4">
                    <h4 className="mb-2 text-sm font-medium">Timer Duration</h4>
                    <Input type="number" placeholder="120" defaultValue="120" />
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsSettingsOpen(false)}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Exit Room</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to exit the planning poker room?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExitDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleExitRoom}>Exit Room</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{currentStory.title}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currentStory.description}</p>
            </div>
            <Badge variant={currentStory.priority === 'High' ? 'destructive' : 'default'}>
              {currentStory.priority} Priority
            </Badge>
          </div>
        </header>
        <main className="flex-1 p-6 flex gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>Vote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {fibonacciSequence.map((value) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardSelect(value)}
                      className={`h-20 text-xl font-semibold rounded-lg transition-all ${
                        selectedCard === value
                          ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                          : isDarkMode
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {value}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} flex items-center`}>
                    <Clock className="mr-3 text-blue-600" />
                    <motion.div
                      key={timer}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {timer > 0 ? (
                        <span>
                          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                        </span>
                      ) : (
                        "Time's up!"
                      )}
                    </motion.div>
                  </div>
                  {!isVotingComplete ? (
                    <Button onClick={handleVoteComplete} className="bg-green-600 hover:bg-green-700 text-white">
                      Complete Voting
                    </Button>
                  ) : (
                    <Button onClick={handleRepeatVoting} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      <RefreshCcw className="mr-2 h-5 w-5" />
                      Repeat Voting
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className={`flex-1 overflow-hidden ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-26rem)]">
                  <div className="grid grid-cols-2 gap-4">
                    {mockUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        className={`flex items-center p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                        } border shadow-sm`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.role}</div>
                        </div>
                        {selectedCard && (
                          <div className={`ml-auto ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} text-xs font-semibold px-2 py-1 rounded-full`}>
                            Voted
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="w-96 flex flex-col">
            <Tabs defaultValue="statistics" className="flex-1 flex flex-col">
              <TabsList className={`grid w-full grid-cols-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="statistics" className="flex-1 overflow-hidden">
                <Card className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart2 className="mr-2 text-blue-600" />
                      Voting Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {isVotingComplete ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average</span>
                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>8</span>
                          </div>
                          <Progress value={80} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Median</span>
                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>5</span>
                          </div>
                          <Progress value={50} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mode</span>
                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>5</span>
                          </div>
                          <Progress value={50} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Statistics will be available once voting is complete.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="chat" className="flex-1 overflow-hidden">
                <Card className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 text-blue-600" />
                      Team Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 pr-4">
                      {chatMessages.map((msg, index) => (
                        <motion.div
                          key={index}
                          className="mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center mb-1">
                            <span className="font-semibold text-blue-600">{msg.user}</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>{msg.timestamp}</span>
                          </div>
                          <p className={`${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} rounded-lg p-2`}>{msg.message}</p>
                        </motion.div>
                      ))}
                    </ScrollArea>
                    <Separator className={`my-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <form onSubmit={handleChatSubmit} className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className={`flex-1 mr-3 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}
                      />
                      <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="flex-1 overflow-hidden">
                <Card className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="mr-2 text-blue-600" />
                      Voting History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ScrollArea className="h-full pr-4">
                      {votingHistory.map((vote, index) => (
                        <div key={index} className={`mb-4 p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{vote.story}</span>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{vote.date}</span>
                          </div>
                          <div className="flex items-center">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`}>Average:</span>
                            <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{vote.average}</span>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNextStory}>
              Next User Story
              <ChevronRight className="ml-2 h-5 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

