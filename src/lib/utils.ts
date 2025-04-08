import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TeamRoleEnum } from "@/enums/team-roles.enum"
import { ChartSpline, GitBranch, Home, LayoutGrid, LogsIcon, PlaySquare, SquareKanban, Users2 } from "lucide-react"

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