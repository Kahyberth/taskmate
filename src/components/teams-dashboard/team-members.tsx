import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  MoreHorizontalIcon,
  MessageSquareIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SC",
    status: "online",
    projects: ["Dashboard Redesign", "Mobile App"],
    email: "sarah.chen@company.com",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MR",
    status: "offline",
    projects: ["API Integration", "Database Migration"],
    email: "michael.r@company.com",
  },
  {
    id: 3,
    name: "Emily Taylor",
    role: "UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ET",
    status: "online",
    projects: ["User Research", "Dashboard Redesign"],
    email: "emily.t@company.com",
  },
  {
    id: 4,
    name: "David Kim",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DK",
    status: "online",
    projects: ["CI/CD Pipeline", "Cloud Migration"],
    email: "david.kim@company.com",
  },
  {
    id: 5,
    name: "Jessica Patel",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JP",
    status: "offline",
    projects: ["Product Roadmap", "Feature Planning"],
    email: "jessica.p@company.com",
  },
]

export default function TeamMembers() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <Card className="border bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Team Members</CardTitle>
            <CardDescription>{teamMembers.length} members in your team</CardDescription>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-[260px]">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8 w-full bg-background/50 border-border/50 focus:bg-background"
              />
            </div>
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative rounded-xl border bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="absolute top-3 right-3 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/80">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Remove from Team</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="h-12 bg-gradient-to-r from-primary/10 to-primary/5"></div>

              <div className="px-4 pt-4 pb-5 relative">
                <div className="flex items-start">
                  <div className="relative -mt-10">
                    <Avatar className="h-14 w-14 border-4 border-background">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-primary/10 text-base font-semibold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background ${
                        member.status === "online" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></span>
                  </div>
                  <div className="ml-3 mt-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-1.5">Projects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.projects.map((project) => (
                      <Badge key={project} variant="outline" className="bg-primary/5">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div
                  className={`flex justify-center gap-2 mt-4 pt-3 border-t border-border/40 transition-opacity duration-200 ${
                    hoveredMember === member.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <MessageSquareIcon className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <PhoneIcon className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <MailIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-card/50 flex justify-between">
        <p className="text-sm text-muted-foreground">Showing 5 of 12 team members</p>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardFooter>
    </Card>
  )
}

