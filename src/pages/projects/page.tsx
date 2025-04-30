import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Tag,
  ChevronDown,
  AlertCircle,
  MoreHorizontal,
  Star,
  StarOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of the company website with new branding and improved UX",
    status: "in-progress",
    progress: 65,
    startDate: "2023-10-15",
    endDate: "2024-01-20",
    owner: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    members: [
      { name: "Sarah Miller", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "David Chen", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Maria Garcia", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    tags: ["Design", "Frontend", "UX"],
    priority: "high",
    isStarred: true,
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Create a cross-platform mobile application for task management",
    status: "not-started",
    progress: 0,
    startDate: "2024-02-01",
    endDate: "2024-05-30",
    owner: {
      name: "Emily Wong",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    members: [
      { name: "James Wilson", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Olivia Smith", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    tags: ["Mobile", "React Native", "API"],
    priority: "medium",
    isStarred: false,
  },
  {
    id: 3,
    name: "Data Migration",
    description: "Migrate customer data from legacy system to new cloud platform",
    status: "completed",
    progress: 100,
    startDate: "2023-08-10",
    endDate: "2023-11-15",
    owner: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    members: [
      { name: "Lisa Taylor", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Robert Davis", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Jennifer Lee", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Thomas Moore", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    tags: ["Database", "Cloud", "Security"],
    priority: "high",
    isStarred: true,
  },
  {
    id: 4,
    name: "Marketing Campaign",
    description: "Q1 digital marketing campaign for product launch",
    status: "at-risk",
    progress: 40,
    startDate: "2023-12-01",
    endDate: "2024-03-15",
    owner: {
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    members: [
      { name: "Daniel Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Emma Wilson", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    tags: ["Marketing", "Social Media", "Analytics"],
    priority: "high",
    isStarred: false,
  },
  {
    id: 5,
    name: "Product Feature Development",
    description: "Implement new features based on customer feedback",
    status: "in-progress",
    progress: 30,
    startDate: "2024-01-10",
    endDate: "2024-04-20",
    owner: {
      name: "William Clark",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    members: [
      { name: "Ava Robinson", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Noah Thompson", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Isabella White", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    tags: ["Development", "Backend", "Testing"],
    priority: "medium",
    isStarred: true,
  },
  {
    id: 6,
    name: "Internal Training Program",
    description: "Develop and implement training materials for new hires",
    status: "not-started",
    progress: 0,
    startDate: "2024-03-01",
    endDate: "2024-05-15",
    owner: {
      name: "Olivia Harris",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    members: [
      { name: "Ethan Martin", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Charlotte Lewis", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    tags: ["HR", "Training", "Documentation"],
    priority: "low",
    isStarred: false,
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "not-started":
      return (
        <Badge variant="outline" className="bg-slate-100 text-slate-700">
          Not Started
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-700">
          In Progress
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-700">
          Completed
        </Badge>
      )
    case "at-risk":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700">
          At Risk
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case "low":
      return <Badge className="bg-slate-500">Low</Badge>
    case "medium":
      return <Badge className="bg-blue-500">Medium</Badge>
    case "high":
      return <Badge className="bg-red-500">High</Badge>
    default:
      return <Badge>{priority}</Badge>
  }
}

// Project card component
const ProjectCard = ({ project, onToggleStar }: { project: any; onToggleStar: (id: number) => void }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <button onClick={() => onToggleStar(project.id)} className="text-yellow-400 hover:text-yellow-500">
                {project.isStarred ? <Star size={16} /> : <StarOff size={16} className="text-gray-400" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Project</DropdownMenuItem>
              <DropdownMenuItem>Archive Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-3">
          <StatusBadge status={project.status} />
          <PriorityBadge priority={project.priority} />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-gray-500" />
              <span>{format(new Date(project.startDate), "MMM d")}</span>
              <span>-</span>
              <span>{format(new Date(project.endDate), "MMM d, yyyy")}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {project.tags.map((tag: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.owner.avatar} alt={project.owner.name} />
              <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{project.owner.name}</span>
          </div>
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member: any, i: number) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-white">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs border-2 border-white">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// Create project form component
const CreateProjectForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" placeholder="Enter project name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter project description" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* <div className="space-y-2">
        <Label>Date Range</Label>
        <DatePickerWithRange />
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" placeholder="Enter tags separated by commas" />
      </div>

      <div className="space-y-2">
        <Label>Team Members</Label>
        <ScrollArea className="h-[120px] border rounded-md p-2">
          {[
            "Alex Johnson",
            "Sarah Miller",
            "David Chen",
            "Maria Garcia",
            "Emily Wong",
            "James Wilson",
            "Olivia Smith",
            "Michael Brown",
          ].map((member, i) => (
            <div key={i} className="flex items-center space-x-2 py-1">
              <Checkbox id={`member-${i}`} />
              <Label htmlFor={`member-${i}`} className="cursor-pointer">
                {member}
              </Label>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>Create Project</Button>
      </div>
    </div>
  )
}

// Projects page component
export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState("grid")

  // Filter projects based on search query and filters
  const filteredProjects = projects.filter((project) => {
    // Search filter
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Status filter
    const matchesStatus = statusFilter === "all" || project.status === statusFilter

    // Priority filter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Toggle star status
  const handleToggleStar = (id: number) => {
    setProjects(
      projects.map((project) => (project.id === id ? { ...project, isStarred: !project.isStarred } : project)),
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-500">Manage and track your team's projects</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <CreateProjectForm onClose={() => setCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("not-started")}>Not Started</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("at-risk")}>At Risk</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>Priority</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="my">My Projects</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <AlertCircle className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onToggleStar={handleToggleStar} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my">
          <div className="text-center py-12">
            <p>My projects will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="starred">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredProjects
              .filter((p) => p.isStarred)
              .map((project) => (
                <ProjectCard key={project.id} project={project} onToggleStar={handleToggleStar} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-12">
            <p>Recent projects will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

