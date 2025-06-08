"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, LinkIcon, AlertTriangle } from "lucide-react"
import type { Team } from "@/lib/store"
import { TeamActionsDropdown } from "@/components/teams/TeamActionsDropdown"
import { InviteMembersDialog } from "@/components/teams/InviteMembersDialog"
import { useContext, useState, useRef, useEffect } from "react"
import { notifications } from "@mantine/notifications"
import { AuthContext } from "@/context/AuthContext"
import * as Tooltip from "@radix-ui/react-tooltip"
import { useTeams } from "@/context/TeamsContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteTeam, useLeaveTeam } from "@/api/queries"

interface TeamCardProps {
  team: Team
  setTeamToEdit: (team: Team | null) => void
  onClick?: (team: Team) => void | undefined
}

export const TeamCard = ({ team, setTeamToEdit, onClick }: TeamCardProps) => {
  const nameRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const [showInviteDialog, setShowInviteDialog] = useState<boolean>(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)
  const { user: user_data } = useContext(AuthContext)
  const [isNameTruncated, setIsNameTruncated] = useState<boolean>(false)
  const [isDescTruncated, setIsDescTruncated] = useState<boolean>(false)
  const { removeTeam } = useTeams()
  
  const deleteTeamMutation = useDeleteTeam()
  const leaveTeamMutation = useLeaveTeam()
  const [isLeaving, setIsLeaving] = useState(false)

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
      title: "Feature not available",
      message: "This feature is not available yet",
      color: "yellow",
    })
  }

  const confirmDeleteTeam = (teamId: string) => {
    setTeamToDelete(teamId)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteTeam = async () => {
    if (!user_data?.id || !teamToDelete) {
      notifications.show({
        title: "Authentication error",
        message: "User not found. Please try again.",
        color: "red",
      })
      return
    }

    try {
      setShowDeleteConfirmation(false)
      

      await deleteTeamMutation.mutateAsync({ 
        teamId: teamToDelete, 
        requesterId: user_data.id 
      })
      
      removeTeam(teamToDelete)
      
      notifications.show({
        title: "Team deleted",
        message: "The team has been successfully deleted",
        color: "green",
      })
    } catch (err: any) {
      notifications.show({
        title: "Error deleting team",
        message: err?.message || "An unexpected error occurred",
        color: "red",
      })
    } finally {
      setTeamToDelete(null)
    }
  }

  const handleLeaveTeam = async (teamId: string) => {
    if (!user_data?.id) {
      notifications.show({
        title: "Authentication error",
        message: "User not found. Please try again.",
        color: "red",
      })
      return
    }

    try {
      setIsLeaving(true)
      console.log("Leaving team", teamId)
      await leaveTeamMutation.mutateAsync({ teamId, userId: user_data.id })
      removeTeam(teamId)
      
      notifications.show({
        title: "Left team",
        message: "You have successfully left the team",
        color: "green",
      })
    } catch (err: any) {
      notifications.show({
        title: "Error leaving team",
        message: err?.message || "An unexpected error occurred",
        color: "red",
      })
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <>
      <Card
        className="group relative text-black dark:text-white overflow-hidden transition-all hover:shadow-lg flex flex-col h-full cursor-pointer dark:bg-white/5 backdrop-blur-md dark:border-white/10 border-black/20"
        onClick={() => onClick && onClick(team)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/50 to-transparent h-32" />
        {team.image && (
          <img
            src={team.image}
            alt=""
            className="absolute inset-0 h-32 w-full object-cover"
          />
        )}
        <CardHeader className="relative pt-36">
          <div className="flex justify-between items-start">
            <div className="max-w-[90%]">
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle
                        ref={nameRef}
                        className="break-words overflow-hidden text-ellipsis whitespace-nowrap flex-1"
                      >
                        {team.name}
                      </CardTitle>
                      <Badge
                        variant={team.role === "LEADER" ? "default" : "secondary"}
                        className="shrink-0 bg-gradient-to-r from-indigo-600 to-purple-900  border-0"
                      >
                        {team.role === "LEADER" ? "Leader" : "Member"}
                      </Badge>
                    </div>
                  </Tooltip.Trigger>
                  {isNameTruncated && (
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="dark:bg-black bg-white px-2 py-1 rounded shadow-md text-sm max-w-sm"
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
                    <CardDescription ref={descRef} className="break-words overflow-hidden line-clamp-2 dark:text-white/70 text-black/70">
                      {team.description}
                    </CardDescription>
                  </Tooltip.Trigger>
                  {isDescTruncated && (
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        className="bg-black px-2 py-1 rounded shadow-md text-sm max-w-sm"
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
              handleDeleteTeam={confirmDeleteTeam}
              handleLeaveTeam={handleLeaveTeam}
              loading={deleteTeamMutation.isPending || isLeaving}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm dark:text-white/60">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {team.members.length} members
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Key Members</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto dark:bg-white/5 bg-slate-300/20 rounded-lg p-2">
                {team.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-md dark:hover:bg-white/10 hover:bg-slate-300/30 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 border dark:border-white/20 border-black/20">
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
                      <p className="text-sm font-medium truncate">{member.member.name} {member.member.lastName}</p>
                      <p className="text-xs text-black/60 dark:text-white/60 truncate">{member.member.email}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto border-black/30 dark:border-white/20 text-black/80 dark:text-white/80">
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
              className="ml-auto border-black/10 bg-white/5 hover:bg-white/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Team Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This action cannot be undone and all team data will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={deleteTeamMutation.isPending}
            >
              {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}