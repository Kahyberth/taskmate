"use client"

// This is an example of how you might want to update the TeamActionsDropdown component
// to match the new styling if needed. You would need to replace your existing component
// with this updated version.

import { MoreHorizontal, Edit, Trash, LogOut, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Team } from "@/lib/store"

interface TeamActionsDropdownProps {
  team: Team
  handleCopyInviteLink: () => void
  setTeamToEdit: (team: Team | null) => void
  handleDeleteTeam: (teamId: string) => void
  handleLeaveTeam: (teamId: string) => void
  loading: boolean
}

export const TeamActionsDropdown = ({
  team,
  handleCopyInviteLink,
  setTeamToEdit,
  handleDeleteTeam,
  handleLeaveTeam,
  loading,
}: TeamActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-black hover:bg-gray-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white text-black border border-gray-200 dark:bg-[#1e1248] dark:text-white dark:border-white/10"
      >
        {team.role === "LEADER" ? (
          <>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                setTeamToEdit(team)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar equipo
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                handleCopyInviteLink()
              }}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Copiar enlace de invitación
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteTeam(team.id)
              }}
              disabled={loading}
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar equipo
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                handleCopyInviteLink()
              }}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Copiar enlace de invitación
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              onClick={(e) => {
                e.stopPropagation()
                handleLeaveTeam(team.id)
              }}
              disabled={loading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Salir del equipo
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
