import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowUpRightIcon,
  MoreHorizontalIcon,
  FilterIcon,
  SlidersIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const activeProjects = [
  {
    id: 1,
    name: "Dashboard Redesign",
    description: "Redesigning the main dashboard interface",
    progress: 75,
    dueDate: "Mar 30, 2025",
    team: [
      { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC" },
      { name: "Emily Taylor", avatar: "/placeholder.svg?height=32&width=32", initials: "ET" },
      { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK" },
    ],
    priority: "High",
    tasks: { completed: 24, total: 32 },
  },
  {
    id: 2,
    name: "API Integration",
    description: "Integrating third-party payment APIs",
    progress: 45,
    dueDate: "Apr 15, 2025",
    team: [
      { name: "Michael Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "MR" },
      { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK" },
    ],
    priority: "Medium",
    tasks: { completed: 12, total: 28 },
  },
  {
    id: 3,
    name: "Mobile App Development",
    description: "Building native mobile applications",
    progress: 30,
    dueDate: "May 20, 2025",
    team: [
      { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC" },
      { name: "Jessica Patel", avatar: "/placeholder.svg?height=32&width=32", initials: "JP" },
    ],
    priority: "High",
    tasks: { completed: 8, total: 26 },
  },
]

const completedProjects = [
  {
    id: 4,
    name: "User Authentication System",
    description: "Implementing secure login and registration",
    completedDate: "Feb 28, 2025",
    team: [
      { name: "Michael Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "MR" },
      { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK" },
    ],
  },
  {
    id: 5,
    name: "Analytics Dashboard",
    description: "Creating data visualization components",
    completedDate: "Jan 15, 2025",
    team: [
      { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC" },
      { name: "Emily Taylor", avatar: "/placeholder.svg?height=32&width=32", initials: "ET" },
    ],
  },
]

export default function Projects() {
  return (
    <Card className="border bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Projects</CardTitle>
            <CardDescription>Manage and track all team projects</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SlidersIcon className="h-4 w-4" />
            </Button>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-background/50 border">
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="completed">Completed Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="animate-in fade-in-50 duration-300">
            <div className="space-y-6">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-xl p-5 bg-card/50 hover:shadow-md transition-all duration-200 hover:bg-card/80"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <Badge
                          className={`ml-2 ${
                            project.priority === "High"
                              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                              : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                          } border-none`}
                        >
                          {project.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0 gap-2">
                      <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                        {project.dueDate}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem>Add Task</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Archive Project</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-xs ml-2 bg-background px-2 py-0.5 rounded-full">
                          {project.tasks.completed}/{project.tasks.total} tasks
                        </span>
                      </div>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <div className="relative h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary/10 text-xs font-medium">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-medium">
                        +
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ArrowUpRightIcon className="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="animate-in fade-in-50 duration-300">
            <div className="space-y-4">
              {completedProjects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-xl p-4 bg-card/50 hover:bg-card/80 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm bg-background/80 px-3 py-1 rounded-full flex items-center">
                        <ClockIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-xs">Completed: {project.completedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <Avatar key={index} className="h-7 w-7 border-2 border-background">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary/10 text-xs font-medium">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-card/50 flex justify-between">
        <p className="text-sm text-muted-foreground">Showing 5 of 12 projects</p>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardFooter>
    </Card>
  )
}

