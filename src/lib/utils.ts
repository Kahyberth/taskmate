import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TeamRoleEnum } from "@/enums/team-roles.enum"
import { AlarmClockPlus, Briefcase, ChartSpline, GitBranch, Home, LayoutGrid, LogsIcon, MessageSquare, PlaySquare, SquareKanban, Users, Users2 } from "lucide-react"

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

export const projectsMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Backlog",
    href: "backlog",
    icon: LogsIcon,
  },
  {
    title: "Board",
    href: "board",
    icon: SquareKanban,
  },
  {
    title: "Repositories",
    href: "issues",
    icon: GitBranch,
  },
  {
    title: "Reports",
    href: "reports",
    icon: ChartSpline,
  },
]

export const dashboardMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Proyectos",
    href: "/dashboard/projects",
    icon: LayoutGrid,
  },
  {
    title: "Planning Poker",
    href: "/dashboard/planning-poker",
    icon: PlaySquare,
  },
  {
    title: "Equipos",
    href: "/dashboard/teams",
    icon: Users2,
  },
]

export const teamDashboardMenuItems = [
  { title: "Resume", href: "", icon: Users },
  { title: "Chat", href: "chat", icon: MessageSquare },
  { title: "Members", href: "members", icon: Users },
  { title: "Time Tracking", href: "time-tracking", icon: AlarmClockPlus },
  { title: "Dashboard", href: "/dashboard", icon: Briefcase },
];

export const projectItems = [
  {
    title: "Website Redesign",
    href: "/projects/website-redesign",
    color: "bg-green-500",
  },
  { title: "Mobile App", 
    href: "/projects/mobile-app", 
    color: "bg-blue-500" 
  },
  {
    title: "API Integration",
    href: "/projects/api-integration",
    color: "bg-purple-500",
  },
];

export const sidebarConfig = {
  dashboard: {
    navItems: dashboardMenuItems,
    bgColor: "bg-white dark:bg-black/20",
    textColor: "text-gray-900 dark:text-white",
    borderColor: "border-black/10 dark:border-white/10",
    projectsTitle: "PROYECTOS",
  },
  team: {
    navItems: teamDashboardMenuItems,
    bgColor: "bg-black/20",
    textColor: "text-white",
    borderColor: "border-white/10",
    projectsTitle: "PROJECTS",
  },
};