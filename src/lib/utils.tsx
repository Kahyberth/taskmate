import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TeamRoleEnum } from "@/enums/team-roles.enum"
import { Home, LayoutGrid, ListTodo, MessageSquare, PlaySquare, SquareKanban, Users, Users2 } from "lucide-react"
import { LucideIcon, Bug, Sparkles, BookOpen, GitBranch, Lightbulb, FileText } from "lucide-react"
import { Projects } from "@/interfaces/projects.interface"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const rolesE = [
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

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  state?: { project: Projects };
}

export const projectsMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: LayoutGrid,
  },
  {
    title: "Backlog",
    href: "/projects/backlog",
    icon: ListTodo,
  },
  {
    title: "Board",
    href: "/projects/board",
    icon: SquareKanban,
  },
]

export const dashboardMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: LayoutGrid,
  },
  {
    title: "Planning Poker",
    href: "/dashboard/planning-poker",
    icon: PlaySquare,
  },
  {
    title: "Teams",
    href: "/dashboard/teams",
    icon: Users2,
  },
]

export const teamDashboardMenuItems: MenuItem[] = [
  { title: "Overview", href: "", icon: Users },
  { title: "Chat", href: "chat", icon: MessageSquare },
  { title: "Dashboard", href: "/dashboard", icon: Home },
];

export const sidebarConfig = {
  dashboard: {
    navItems: dashboardMenuItems,
    bgColor: "bg-white dark:bg-black/20",
    textColor: "text-gray-900 dark:text-white",
    borderColor: "border-black/10 dark:border-white/10",
    projectsTitle: "PROJECTS",
  },
  team: {
    navItems: teamDashboardMenuItems,
    bgColor: "bg-black/20",
    textColor: "text-white",
    borderColor: "border-white/10",
    projectsTitle: "PROJECTS",
  },
};

export const getTypeIcon = (type?: string) => {
  switch (type) {
    case 'bug':
      return <Bug size={14} className="text-red-500" />;
    case 'feature':
      return <Sparkles size={14} className="text-blue-500" />;
    case 'task':
      return <BookOpen size={14} className="text-yellow-500" />;
    case 'refactor':
      return <GitBranch size={14} className="text-purple-500" />;
    case 'user_story':
      return <Lightbulb size={14} className="text-green-500" />;
    default:
      return <FileText size={14} className="text-gray-500" />;
  }
};

export const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "done":
    case "closed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "review":
      return "bg-yellow-100 text-yellow-800";
    case "to-do":
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export const getStatusDisplayText = (status: string) => {
  switch (status) {
    case "to-do":
      return "TO DO";
    case "in-progress":
      return "IN PROGRESS";
    case "done":
      return "DONE";
    case "closed":
      return "CLOSED";
    case "review":
      return "IN REVIEW";
    default:
      return "TO DO";
  }
}