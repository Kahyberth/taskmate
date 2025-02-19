import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Search, Plus, Filter, Users, Mail, MoreVertical, LinkIcon, Settings, Activity, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { TeamRoleEnum } from "@/enums/team-roles.enum"

type Team = {
  id: number
  name: string
  description: string
  memberCount: number
  role: string
  category: string
  coverImage: string
  lastActive: string
  members: {
    name: string
    email: string
    role: string
    avatar: string
    status: string
  }[]
  activity: {
    type: string
    user: string
    date: string
  }[]
}



const rolesE = [
  TeamRoleEnum.ScrumMaster,
  TeamRoleEnum.ProductOwner,
  TeamRoleEnum.Developer,
  TeamRoleEnum.QATester,
  TeamRoleEnum.UXUIDesigner,
  TeamRoleEnum.TechLead,
  TeamRoleEnum.BusinessAnalyst,
  TeamRoleEnum.Stakeholder,
  TeamRoleEnum.SupportEngineer,
  TeamRoleEnum.LEADER,
]


const ImageUpload = ({
  currentImage,
  onImageChange,
}: {
  currentImage?: string
  onImageChange: (image: string | null) => void
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    // Simulate file upload and get URL
    // In production, replace this with actual file upload logic
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setTimeout(() => {
          onImageChange(e.target?.result as string)
          setUploadProgress(0)
        }, 1000)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    onImageChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          currentImage ? "bg-muted/50" : "bg-background",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {currentImage ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img src={currentImage || "/placeholder.svg"} alt="Preview" className="object-cover w-full h-full" />
            <button
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Drag & drop or click to upload</p>
            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
        </div>
      )}
    </div>
  )
}

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isLoading, setIsLoading] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [newTeamImage, setNewTeamImage] = useState<string | null>(null) // Added state for new team image
  const [ roles, setRoles ] = useState<TeamRoleEnum[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setRoles(rolesE)
  }
  , [])

  // Mock data - replace with real data in production
  const teams: Team[] = [
    {
      id: 1,
      name: "Design Team",
      description: "UI/UX and visual design team",
      memberCount: 8,
      role: "leader",
      category: "Design",
      coverImage: "/placeholder.svg?height=100&width=400",
      lastActive: "2 hours ago",
      members: [
        {
          name: "Sarah Wilson",
          email: "sarah@example.com",
          role: "leader",
          avatar: "/placeholder.svg",
          status: "active",
        },
        { name: "Mike Johnson", email: "mike@example.com", role: "member", avatar: "/placeholder.svg", status: "away" },
      ],
      activity: [
        { type: "member_joined", user: "Alex Thompson", date: "1 day ago" },
        { type: "project_created", user: "Sarah Wilson", date: "2 days ago" },
      ],
    },
    {
      id: 2,
      name: "Development Team",
      description: "Frontend and backend development",
      memberCount: 12,
      role: "member",
      category: "Engineering",
      coverImage: "/placeholder.svg?height=100&width=400",
      lastActive: "5 minutes ago",
      members: [
        { name: "John Doe", email: "john@example.com", role: "leader", avatar: "/placeholder.svg", status: "active" },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          role: "member",
          avatar: "/placeholder.svg",
          status: "offline",
        },
      ],
      activity: [
        { type: "deployment", user: "John Doe", date: "3 hours ago" },
        { type: "code_review", user: "Jane Smith", date: "5 hours ago" },
      ],
    },
  ]

  const handleCopyInviteLink = (teamId: number) => {
    // In production, generate a real invite link
    navigator.clipboard.writeText(`https://your-app.com/invite/${teamId}`)
    toast({
      title: "Invite link copied",
      description: "The team invite link has been copied to your clipboard.",
    })
  }

  const handleLeaveTeam = (teamId: number) => {
    toast({
      title: "Left team",
      description: "You have successfully left the team.",
    })
  }

  const handleDeleteTeam = (teamId: number) => {
    toast({
      title: "Team deleted",
      description: "The team has been permanently deleted.",
      variant: "destructive",
    })
  }

  const handleUpdateTeam = (teamData: Partial<Team>) => {
    // In production, implement actual update logic here
    toast({
      title: "Team updated",
      description: "The team information has been successfully updated.",
    })
  }

  const LoadingSkeleton = () => (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-1/3" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  )

  const filteredTeams = teams
    .filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterValue === "all" || team.role === filterValue),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "members") return b.memberCount - a.memberCount
      if (sortBy === "activity") return a.lastActive.localeCompare(b.lastActive)
      return 0
    })

  const teamDropdownContent = (team: Team) => (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Team Actions</DropdownMenuLabel>
      {team.role === "leader" ? (
        <>
          <DropdownMenuItem onClick={() => handleCopyInviteLink(team.id)}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy Invite Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditingTeam(team)}>
            <Settings className="mr-2 h-4 w-4" />
            Edit Team
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                Delete Team
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Team</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the team and remove all members.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteTeam(team.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
              Leave Team
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Team</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave this team? You'll need to be invited back to rejoin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleLeaveTeam(team.id)}>Leave</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </DropdownMenuContent>
  )

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground mt-1">Manage and collaborate with your teams</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>Create a new team to collaborate with others.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                // In production, implement actual team creation logic
                toast({
                  title: "Team created",
                  description: "Your new team has been created successfully.",
                })
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="team-cover">Cover Image</label>
                  <ImageUpload
                    currentImage={newTeamImage || undefined}
                    onImageChange={(image) => setNewTeamImage(image)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="team-name">Team Name</label>
                  <Input id="team-name" name="team-name" placeholder="Enter team name" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="team-description">Description</label>
                  <Input id="team-description" name="team-description" placeholder="Enter team description" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="team-category">Category</label>
                  <Select name="team-category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Team</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="leader">Teams I Lead</SelectItem>
              <SelectItem value="member">Teams I'm In</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="members">Sort by Members</SelectItem>
              <SelectItem value="activity">Sort by Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No teams found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent h-24" />
              <img
                src={team.coverImage || "/placeholder.svg"}
                alt=""
                className="absolute inset-0 h-24 w-full object-cover"
              />
              <CardHeader className="relative pt-28">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {team.name}
                      <Badge variant={team.role === "leader" ? "default" : "secondary"}>
                        {team.role === "leader" ? "Leader" : "Member"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{team.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    {teamDropdownContent(team)}
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {team.memberCount} members
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {team.lastActive}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      {team.activity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 truncate">
                            {activity.user} - {activity.type}
                          </span>
                          <span className="text-muted-foreground">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Members</h4>
                    <div className="space-y-2">
                      {team.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                                member.status === "active"
                                  ? "bg-green-500"
                                  : member.status === "away"
                                    ? "bg-yellow-500"
                                    : "bg-gray-300",
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            {member.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {team.role === "leader" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        Invite Members
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Members</DialogTitle>
                        <DialogDescription>Invite new members to join your team.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="email">Email address</label>
                          <Input id="email" placeholder="Enter email address" type="email" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="role">Role</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                roles.map((role, index) => (
                                  <SelectItem key={index} value={role}>{role}</SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Send Invitation</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button variant="outline" className="ml-auto" onClick={() => handleCopyInviteLink(team.id)}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy Invite Link
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update your team's information and settings.</DialogDescription>
          </DialogHeader>
          {editingTeam && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleUpdateTeam({
                  ...editingTeam,
                  name: formData.get("team-name") as string,
                  description: formData.get("team-description") as string,
                  category: formData.get("team-category") as string,
                })
                setEditingTeam(null)
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="team-cover">Cover Image</label>
                  <ImageUpload
                    currentImage={editingTeam.coverImage}
                    onImageChange={(image) => {
                      if (editingTeam) {
                        setEditingTeam({
                          ...editingTeam,
                          coverImage: image || "/placeholder.svg",
                        })
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="team-name">Team Name</label>
                  <Input
                    id="team-name"
                    name="team-name"
                    defaultValue={editingTeam.name}
                    placeholder="Enter team name"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="team-description">Description</label>
                  <Input
                    id="team-description"
                    name="team-description"
                    defaultValue={editingTeam.description}
                    placeholder="Enter team description"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="team-category">Category</label>
                  <Select name="team-category" defaultValue={editingTeam.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingTeam(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

