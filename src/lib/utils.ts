import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TeamRoleEnum } from "@/enums/team-roles.enum"

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