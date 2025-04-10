"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, LinkIcon } from "lucide-react"
import type { Team } from "@/lib/store"
import { TeamActionsDropdown } from "@/components/teams/TeamActionsDropdown"
import { InviteMembersDialog } from "@/components/teams/InviteMembersDialog"
import { useContext, useState, useRef, useEffect } from "react"
import { notifications } from "@mantine/notifications"
import useTeamService from "@/hooks/useTeamService"
import { AuthContext } from "@/context/AuthContext"
import * as Tooltip from "@radix-ui/react-tooltip"
import { useTeams } from "@/context/TeamsContext"

interface TeamCardProps {
  team: Team
  setTeamToEdit: (team: Team | null) => void
  onClick?: (team: Team) => void | undefined
}

export const TeamCard = ({ team, setTeamToEdit, onClick }: TeamCardProps) => {
  const nameRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const [showInviteDialog, setShowInviteDialog] = useState<boolean>(false)
  const { user: user_data } = useContext(AuthContext)
  const { deleteTeam, leaveTeam, loading, error } = useTeamService()
  const [isNameTruncated, setIsNameTruncated] = useState<boolean>(false)
  const [isDescTruncated, setIsDescTruncated] = useState<boolean>(false)
  const { removeTeam } = useTeams()

  useEffect(() => {
    if (nameRef.current) {
      setIsNameTruncated(nameRef.current.scrollWidth > nameRef.current.clientWidth)
    }
    if (descRef.current) {
      setIsDescTruncated(descRef.current.scrollHeight > descRef.current.offsetHeight)
    }
  }, [team.name, team.description])

  const handleCopyInviteLink = () => {
    notifications.show({
      title: "Funcionalidad no disponible",
      message: "Esta funcionalidad no está disponible aún",
      color: "yellow",
    })
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!user_data?.id) {
      notifications.show({
        title: "Error de autenticación",
        message: "No se encontró el usuario. Inténtalo de nuevo.",
        color: "red",
      })
      return
    }

    await deleteTeam(teamId, user_data.id)

    if (!error) {
      notifications.show({
        title: "Equipo eliminado",
        message: "El equipo ha sido eliminado correctamente",
        color: "green",
      })
      removeTeam(teamId)
    } else if (error) {
      notifications.show({
        title: "Error al eliminar el equipo",
        message: error,
        color: "red",
      })
    }
  }

  const handleLeaveTeam = async (teamId: string) => {
    if (!user_data?.id) {
      notifications.show({
        title: "Error de autenticación",
        message: "No se encontró el usuario. Inténtalo de nuevo.",
        color: "red",
      })
      return
    }

    await leaveTeam(teamId, user_data.id)

    if (!error) {
      notifications.show({
        title: "Saliste del equipo",
        message: "Has salido del equipo correctamente",
        color: "green",
      })
      removeTeam(teamId)
    } else {
      notifications.show({
        title: "Error al salir del equipo",
        message: error,
        color: "red",
      })
    }
  }

  return (
    <>
      <Card
        className="group relative overflow-hidden transition-all hover:shadow-lg flex flex-col h-full cursor-pointer bg-white/10 backdrop-blur-md border-white/20 shadow-xl"
        onClick={() => onClick && onClick(team)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/40 to-transparent h-32" />
        <img
          src={team.image || "/placeholder.svg?height=400&width=600"}
          alt=""
          className="absolute inset-0 h-32 w-full object-cover"
        />
        <CardHeader className="relative pt-36">
          <div className="flex justify-between items-start">
            <div className="max-w-[90%]">
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle
                        ref={nameRef}
                        className="break-words overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-white"
                      >
                        {team.name}
                      </CardTitle>
                      <Badge
                        variant={team.role === "LEADER" ? "default" : "secondary"}
                        className="shrink-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0"
                      >
                        {team.role === "LEADER" ? "Leader" : "Member"}
                      </Badge>
                    </div>
                  </Tooltip.Trigger>
                  {isNameTruncated && (
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-black text-white px-2 py-1 rounded shadow-md text-sm max-w-sm"
                      >
                        {team.name}
                        <Tooltip.Arrow className="fill-black" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  )}
                </Tooltip.Root>
              </Tooltip.Provider>

              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <CardDescription ref={descRef} className="break-words overflow-hidden line-clamp-2 text-white/70">
                      {team.description}
                    </CardDescription>
                  </Tooltip.Trigger>
                  {isDescTruncated && (
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-black text-white px-2 py-1 rounded shadow-md text-sm max-w-sm"
                      >
                        {team.description}
                        <Tooltip.Arrow className="fill-black" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  )}
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <TeamActionsDropdown
              team={team}
              handleCopyInviteLink={handleCopyInviteLink}
              setTeamToEdit={setTeamToEdit}
              handleDeleteTeam={handleDeleteTeam}
              handleLeaveTeam={handleLeaveTeam}
              loading={loading}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {team.members.length} members
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-white">Key Members</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto bg-white/15 rounded-lg p-2">
                {team.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-white/20 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 border border-white/20">
                        <AvatarImage src={member.member.image} />
                        <AvatarFallback className="bg-violet-800 text-white">
                          {member.member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
                          member.member.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">{member.member.name}</p>
                      <p className="text-xs text-white/60 truncate">{member.member.email}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto border-white/30 text-white bg-white/10">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          {team.role === "LEADER" ? (
            <div className="flex-grow" onClick={(e) => e.stopPropagation()}>
              <InviteMembersDialog open={showInviteDialog} team={team} onOpenChange={setShowInviteDialog} />
            </div>
          ) : (
            <Button
              variant="outline"
              className="ml-auto border-white/20 bg-white/15 text-white hover:bg-white/25"
              onClick={(e) => {
                e.stopPropagation(), handleCopyInviteLink()
              }}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy Invite Link
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  )
}
