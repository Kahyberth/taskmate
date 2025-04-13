import type React from "react";

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import "@mantine/notifications/styles.css";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Clock,
  MessageSquare,
  RefreshCcw,
  Send,
  ChevronRight,
  BarChart2,
  Users,
  History,
  Settings,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { type Socket, io } from "socket.io-client";
import { useRef } from "react";
import { AuthContext } from "@/context/AuthContext";

const fibonacciSequence = ["0", "1", "2", "3", "5", "8", "13", "21", "34", "?"];
// const fibonacciModified = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"];
// const tallas = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "?"];

interface User {
  id: number;
  name: string;
  avatar: string;
  role: string;
}

export interface Story {
  id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low" | string;
  acceptanceCriteria?: string[];
}

interface message {
  value: string;
}

interface ChatHistory {
  username: string;
  message: string;
  message_date: string;
}

export function PlanningPokerRoom() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isVotingComplete, setIsVotingComplete] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // const [sequence, setSequence] = useState(fibonacciSequence);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { user: string; message: string; timestamp: string }[]
  >([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [votingHistory, setVotingHistory] = useState<
    { story_title: string; card_value: number; history_date: string }[]
  >([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [isLastStory, setIsLastStory] = useState(false);
  const navigate = useNavigate();
  const [votes, setVotes] = useState<{ value: string; participant: User }[]>(
    []
  );
  const [votingResults, setVotingResults] = useState<{
    average: number;
    median: number;
    mode: number;
    votes: { value: string; participant: User }[];
  } | null>(null);

  const [aiSuggestion, setAiSuggestion] = useState<{
    points: number;
    confidence: number;
    reasoning: string;
  } | null>(null);

  const { id: room_id } = useParams();
  const { userProfile } = useContext(AuthContext);
  const [roomCreator, setRoomCreator] = useState<string | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    const socket = io("http://localhost:8081", {
      auth: {
        userProfile,
      },
    });

    socketRef.current = socket;

    if (room_id) {
      socket.emit("join-room", room_id);
    }

    socket.on("story-changed", (payload: { story: Story; isLast: boolean }) => {
      console.log(payload.story);

      setIsVotingComplete(false);
      setSelectedCard(null);
      setCurrentStory(payload.story);
      setIsLastStory(payload.isLast);
      setChatMessages([]);
      setVotes([]);
      setTimer(null);
    });

    socket.on("voting-history-updated", (updatedHistory) => {
      setVotingHistory(updatedHistory);
    });

    socket.on("success", ({ value }: message) => {
      notifications.show({
        title: "✔️Success",
        message: value,
        color: "green",
        position: "top-right",
      });
    });

    socket.on("participant-list", (participants: User[]) => {
      setUsers(participants);
    });

    socket.on("voting-history-updated", (updatedHistory) => {
      setVotingHistory(updatedHistory);
    });

    socket.on("room-creator", (creator_id: string) => {
      setRoomCreator(creator_id);
    });

    socket.on("error", ({ value }: message) => {
      notifications.show({
        title: "❌Error",
        message: value,
        color: "red",
        position: "top-right",
      });
    });

    socket.on("session-ended", () => {
      const id = notifications.show({
        title: "Session Ended",
        message: "The planning poker session has ended 🎉",
        position: "top-right",
        loading: true,
      });

      setIsVotingComplete(false);
      setSelectedCard(null);
      setCurrentStory(null);
      setIsLastStory(false);
      setChatMessages([]);
      setVotes([]);
      setTimer(null);

      setTimeout(() => {
        notifications.update({
          id,
          color: "teal",
          title: "Session Ended ✔",
          message: "The planning poker session has ended ✔. Redirecting... ",
          icon: <IconCheck size={18} />,
          loading: false,
          autoClose: 2000,
        });

        navigate("/");
      }, 2000);
    });

    socket.on("message", (messageData: { message: string; sender: User }) => {
      setChatMessages((prev) => [
        ...prev,
        {
          user: messageData.sender.name,
          message: messageData.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    socket.on("voting-repeated", ({ value }) => {
      notifications.show({
        title: "Voting Reset",
        message: value,
        color: "blue",
        position: "top-right",
      });

      setIsVotingComplete(false);
      setSelectedCard(null);
      setVotes([]);
      setVotingResults(null);
    });

    socket.on("timer-started", ({ duration }) => {
      setTimer(duration);
      setIsTimerRunning(true);
    });

    socket.on("timer-stopped", () => {
      setIsTimerRunning(false);
    });

    socket.on("timer-update", ({ timeLeft }) => {
      setTimer(timeLeft);
    });

    socket.on("timer-finished", () => {
      setIsTimerRunning(false);
      setIsVotingComplete(true);
    });

    if (room_id) {
      socket.emit("request-timer-update", room_id);
    }

    socket.on("votes-updated", ({ votes, participants }) => {
      setVotes(votes);
      setUsers(participants);
    });

    socket.on("voting-results", (results) => {
      setVotingResults(results);
      setIsVotingComplete(true);
    });

    socket.on("suggestion-accepted", ({ storyId, points }) => {
      notifications.show({
        title: "Story Points Set",
        message: `Story ${storyId} has been assigned ${points} points`,
        color: "green",
        position: "top-right",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userProfile, room_id, navigate]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("chat-history", (history: ChatHistory[]) => {
        setChatMessages(
          history.map((chat) => ({
            user: chat.username,
            message: chat.message,
            timestamp: new Date(chat.message_date).toLocaleTimeString(),
          }))
        );
      });
    }
  }, []);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && room_id && socketRef.current) {
      socketRef.current.emit("send-message", {
        message: chatMessage,
        room: room_id,
      });
      setChatMessage("");
    }
  };

  const handleStartTimer = (duration: number) => {
    if (room_id && socketRef.current) {
      socketRef.current.emit("start-timer", {
        room: room_id,
        duration: duration,
      });
    }
  };

  const handleNextStory = () => {
    if (!socketRef.current || !room_id) return;
    socketRef.current.emit("next-story", room_id);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleExitRoom = async () => {
    if (socketRef.current && room_id) {
      socketRef.current.emit("leave-room", room_id);
    }

    const id = notifications.show({
      loading: true,
      title: "Leaving session in progress",
      message: "Please wait...",
      autoClose: false,
      withCloseButton: false,
    });

    setTimeout(() => {
      notifications.update({
        id,
        color: "teal",
        title: "Session left successfully ✔",
        message:
          "You have left the planning poker session successfully. Redirecting...",
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 2000,
      });
      navigate("/");
      setIsExitDialogOpen(false);
    }, 2000);
  };

  const handleCardSelect = (card: string) => {
    if (room_id && socketRef.current && !isVotingComplete) {
      socketRef.current.emit("submit-vote", {
        room: room_id,
        vote: card,
      });
      setSelectedCard(card);
    }
  };

  const handleFinishSession = () => {
    if (socketRef.current && room_id) {
      socketRef.current.emit("end-session", room_id);
    }
  };

  const handleVoteComplete = () => {
    if (room_id && socketRef.current) {
      socketRef.current.emit("complete-voting", room_id);
    }
  };

  const handleRepeatVoting = () => {
    if (room_id && socketRef.current) {
      socketRef.current.emit("repeat-voting", room_id);
    }
  };

  const handleAiSuggestion = () => {
    if (!currentStory || !votingResults) return;

    // In a real implementation, this would call an API endpoint
    // Here we're simulating the AI suggestion with a simple algorithm
    const storyComplexity = currentStory.description.length / 50;
    const votingSpread = Math.abs(votingResults.average - votingResults.median);

    // Calculate a suggested point value based on voting results and story complexity
    let suggestedPoints = votingResults.median;

    // If there's high variance in votes, adjust toward the average
    if (votingSpread > 2) {
      suggestedPoints = Math.round(
        (votingResults.median + votingResults.average) / 2
      );
    }

    // Adjust based on story complexity
    if (storyComplexity > 5 && suggestedPoints < 8) {
      suggestedPoints += 1;
    }

    // Ensure it's a valid Fibonacci number
    const fibNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34];
    const closestFib = fibNumbers.reduce((prev, curr) =>
      Math.abs(curr - suggestedPoints) < Math.abs(prev - suggestedPoints)
        ? curr
        : prev
    );

    // Calculate confidence based on voting consensus
    const confidence = Math.max(0, Math.min(100, 100 - votingSpread * 10));

    // Generate reasoning
    let reasoning = `Based on the voting results (median: ${
      votingResults.median
    }, average: ${votingResults.average.toFixed(1)})`;

    if (votingSpread > 2) {
      reasoning += ` and the significant spread in team estimates`;
    }

    if (storyComplexity > 5) {
      reasoning += `, considering the complexity of the story description`;
    }

    reasoning += `, I suggest ${closestFib} story points.`;

    setAiSuggestion({
      points: closestFib,
      confidence,
      reasoning,
    });
  };

  const handleAcceptSuggestion = () => {
    if (!aiSuggestion || !room_id || !socketRef.current) return;

    // In a real implementation, this would emit an event to save the accepted suggestion
    socketRef.current.emit("accept-suggestion", {
      room: room_id,
      points: aiSuggestion.points,
      storyId: currentStory?.id,
    });

    notifications.show({
      title: "Suggestion Accepted",
      message: `Story points set to ${aiSuggestion.points}`,
      color: "green",
      position: "top-right",
    });
  };

  const handleRejectSuggestion = () => {
    setAiSuggestion(null);
  };

  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex-1 flex flex-col">
        <header
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border-b p-6 shadow-sm`}
        >
          <div className="flex justify-between items-center">
            <h1
              className={`text-3xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Planning Poker
            </h1>
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
                    <Button onClick={() => setIsSettingsOpen(false)}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog
                open={isExitDialogOpen}
                onOpenChange={setIsExitDialogOpen}
              >
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
                    <Button
                      variant="outline"
                      onClick={() => setIsExitDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleExitRoom}>Exit Room</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {currentStory?.title}
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {currentStory?.description}
              </p>
            </div>
            <Badge
              variant={
                currentStory?.priority === "High" ? "destructive" : "default"
              }
            >
              {currentStory?.priority} Priority
            </Badge>
          </div>
        </header>
        <main className="flex-1 p-6 flex gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <Card
              className={`mb-6 ${
                isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white"
              }`}
            >
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
                          ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {value}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold ...">
                    <Clock className="mr-3 text-blue-600" />
                    {timer !== null ? (
                      <motion.span
                        key={timer}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {Math.floor(timer / 60)}:
                        {(timer % 60).toString().padStart(2, "0")}
                      </motion.span>
                    ) : (
                      "00:00"
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!isVotingComplete && !isTimerRunning && (
                      <Button
                        onClick={() => handleStartTimer(120)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Start Timer
                      </Button>
                    )}
                    {isTimerRunning && (
                      <Button
                        onClick={() =>
                          socketRef.current?.emit("stop-timer", {
                            room: room_id,
                          })
                        }
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Stop Timer
                      </Button>
                    )}
                    {!isVotingComplete ? (
                      <Button
                        onClick={handleVoteComplete}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Complete Voting
                      </Button>
                    ) : (
                      <Button
                        onClick={handleRepeatVoting}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        <RefreshCcw className="mr-2 h-5 w-5" />
                        Repeat Voting
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card
              className={`flex-1 overflow-hidden ${
                isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-26rem)]">
                  <div className="grid grid-cols-2 gap-4">
                    {users.map((user) => (
                      <motion.div
                        key={user.id}
                        className={`flex items-center p-3 rounded-lg ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-200"
                        } border shadow-sm`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {user.name}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {user.role}
                          </div>
                        </div>
                        <div className="ml-2">
                          {votes.some((v) => v.participant.id === user.id) ? (
                            <Badge
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Voted
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-gray-400 text-gray-600"
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="w-96 flex flex-col">
            <Tabs defaultValue="statistics" className="flex-1 flex flex-col">
              <TabsList
                className={`grid w-full grid-cols-3 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent
                value="statistics"
                className="flex-1 overflow-hidden"
              >
                <Card
                  className={`h-full flex-col ${
                    isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart2 className="mr-2 text-blue-600" />
                      Voting Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {votingResults ? (
                      <div className="space-y-6">
                        {/* Resultados Principales */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p
                              className={`text-2xl font-bold ${
                                isDarkMode ? "text-green-400" : "text-green-600"
                              }`}
                            >
                              {votingResults.average.toFixed(1)}
                            </p>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Average
                            </p>
                          </div>
                          <div className="text-center">
                            <p
                              className={`text-2xl font-bold ${
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                              }`}
                            >
                              {votingResults.median}
                            </p>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Median
                            </p>
                          </div>
                          <div className="text-center">
                            <p
                              className={`text-2xl font-bold ${
                                isDarkMode
                                  ? "text-purple-400"
                                  : "text-purple-600"
                              }`}
                            >
                              {votingResults.mode}
                            </p>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Mode
                            </p>
                          </div>
                        </div>

                        {/* Barras de Progreso */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                Consensus Level
                              </span>
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {((votingResults.average / 34) * 100).toFixed(
                                  0
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={(votingResults.average / 34) * 100}
                              className={`h-3 ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Votos Individuales */}
                        <div className="mt-6">
                          <h3
                            className={`text-lg font-semibold mb-4 ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            Individual Votes
                          </h3>
                          <div className="space-y-3">
                            {votingResults.votes.map((vote, index) => (
                              <motion.div
                                key={`${vote.participant.id}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex justify-between items-center p-2 rounded-lg ${
                                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage
                                      src={vote.participant.avatar}
                                    />
                                    <AvatarFallback>
                                      {vote.participant.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span
                                    className={`text-sm ${
                                      isDarkMode
                                        ? "text-gray-200"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {vote.participant.name}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`px-3 py-1 rounded-full ${
                                    isDarkMode
                                      ? "border-blue-400 text-blue-400"
                                      : "border-blue-600 text-blue-600"
                                  }`}
                                >
                                  {vote.value}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* AI Suggestion */}
                        {roomCreator &&
                          userProfile?.id === roomCreator &&
                          votingResults &&
                          !aiSuggestion && (
                            <div className="mt-6">
                              <Button
                                onClick={handleAiSuggestion}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Get AI Suggestion
                              </Button>
                            </div>
                          )}

                        {aiSuggestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-6 p-4 rounded-lg border ${
                              isDarkMode
                                ? "bg-gray-700 border-purple-700"
                                : "bg-purple-50 border-purple-200"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h3
                                className={`text-lg font-semibold ${
                                  isDarkMode
                                    ? "text-purple-300"
                                    : "text-purple-700"
                                }`}
                              >
                                AI Suggestion
                              </h3>
                              <Badge
                                variant="outline"
                                className={`${
                                  isDarkMode
                                    ? "border-purple-400 text-purple-300"
                                    : "border-purple-500 text-purple-700"
                                }`}
                              >
                                {aiSuggestion.confidence}% confidence
                              </Badge>
                            </div>

                            <div className="flex items-center justify-center my-4">
                              <div
                                className={`text-4xl font-bold ${
                                  isDarkMode
                                    ? "text-purple-300"
                                    : "text-purple-700"
                                }`}
                              >
                                {aiSuggestion.points}
                              </div>
                              <div className="text-sm ml-2">story points</div>
                            </div>

                            <p
                              className={`text-sm mb-4 ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {aiSuggestion.reasoning}
                            </p>

                            <div className="flex space-x-2">
                              <Button
                                onClick={handleAcceptSuggestion}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                Accept
                              </Button>
                              <Button
                                onClick={handleRejectSuggestion}
                                variant="outline"
                                className="flex-1"
                              >
                                Reject
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <BarChart2
                          className={`h-12 w-12 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`text-lg text-center ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {votes.length > 0
                            ? "Waiting for all votes..."
                            : "No votes submitted yet"}
                        </p>
                        <Progress
                          value={(votes.length / users.length) * 100}
                          className={`h-2 w-48 ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        />
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {votes.length} of {users.length} votes received
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="chat" className="flex-1 overflow-hidden">
                <Card
                  className={`h-full flex flex-col ${
                    isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center ">
                      <MessageSquare className="mr-2 text-blue-600" />
                      Team Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col min-h-0">
                    <ScrollArea className="flex-1 h-full pr-4 pb-4 overflow-y-auto max-h-[500px]">
                      <div className="space-y-4 pb-4 max-h-[500px]">
                        {chatMessages.map((msg, index) => (
                          <motion.div
                            key={index}
                            ref={
                              index === chatMessages.length - 1
                                ? lastMessageRef
                                : null
                            }
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col"
                          >
                            <div
                              className={`flex items-center mb-1 ${
                                msg.user === "You" ? "ml-auto" : ""
                              }`}
                            >
                              <span className="font-semibold text-blue-600">
                                {msg.user}
                              </span>
                              <span
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                } ml-2`}
                              >
                                {msg.timestamp}
                              </span>
                            </div>
                            <div
                              className={`${
                                isDarkMode
                                  ? "bg-gray-700 text-gray-200"
                                  : "bg-gray-100 text-gray-700"
                              } rounded-lg p-2 break-words whitespace-pre-wrap max-w-full w-fit
                              overflow-hidden word-break break-all overflow-wrap-anywhere
                              ${msg.user === "You" ? "ml-auto" : ""}`}
                            >
                              {msg.message}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Separator
                      className={`my-4 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    />
                    <form
                      onSubmit={handleChatSubmit}
                      className="flex items-center"
                    >
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className={`flex-1 mr-3 ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-100"
                            : "bg-white text-gray-900"
                        }`}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="flex-1 overflow-hidden">
                <Card
                  className={`h-full flex flex-col ${
                    isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="mr-2 text-blue-600" />
                      Voting History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ScrollArea className="h-full pr-4">
                      {votingHistory.map((vote, index) => (
                        <div
                          key={index}
                          className={`mb-4 p-3 ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-50"
                          } rounded-lg`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span
                              className={`font-semibold ${
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                              }`}
                            >
                              {vote.story_title}
                            </span>
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {vote.history_date}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              } mr-2`}
                            >
                              Average:
                            </span>
                            <span
                              className={`font-medium ${
                                isDarkMode ? "text-gray-100" : "text-gray-800"
                              }`}
                            >
                              {vote.card_value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            {isLastStory ? (
              <Button
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                disabled={!isVotingComplete}
                onClick={handleFinishSession}
              >
                Finalizar sesión
              </Button>
            ) : (
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!isVotingComplete}
                onClick={handleNextStory}
              >
                Next User Story
                <ChevronRight className="ml-2 h-5 w-4" />
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
