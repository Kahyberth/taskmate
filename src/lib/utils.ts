import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TeamRoleEnum } from "@/enums/team-roles.enum"
import { AlarmClockPlus, Briefcase, ChartSpline, GitBranch, Home, LayoutGrid, ListTodo, LogsIcon, MessageSquare, PlaySquare, SquareKanban, Users, Users2 } from "lucide-react"
import { LucideIcon } from "lucide-react"
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
    title: "Proyectos",
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

export const teamDashboardMenuItems: MenuItem[] = [
  { title: "Resume", href: "", icon: Users },
  { title: "Chat", href: "chat", icon: MessageSquare },
  { title: "Members", href: "members", icon: Users },
  { title: "Time Tracking", href: "time-tracking", icon: AlarmClockPlus },
  { title: "Dashboard", href: "/dashboard", icon: Briefcase },
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