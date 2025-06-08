import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail } from "lucide-react"
import { Team } from "@/lib/store"
import { TeamRoleEnum } from "@/enums/team-roles.enum"
import { rolesE } from "@/lib/utils"
import { apiClient } from "@/api/client-gateway"
import axios from "axios"
import { notifications } from "@mantine/notifications"

interface InviteMembersDialogProps {
  open: boolean
  team: Team
  onOpenChange: (open: boolean) => void
}

export const InviteMembersDialog = ({ open, team, onOpenChange }: InviteMembersDialogProps) => {
  const [inviteeEmail, setInviteeEmail] = useState("")
  const [role, setRole] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [roles, setRoles] = useState<TeamRoleEnum[]>([])

  useEffect(() => {
    setRoles(rolesE)
  }, [])

  const handleSubmitInvitation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)

    try {
      await apiClient.post(`teams/generate-invite-link/${team.id}`, {
        inviteeEmail,
        teamId: team.id,
        roleInTeam: role,
      })

      notifications.show({
        title: "Invitation sent",
        message: `An invitation has been sent to ${inviteeEmail}`,
        color: "blue",
      })

      setInviteeEmail("")
      setRole("")
      onOpenChange(false)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.code === "ECONNABORTED"
            ? "Could not connect to the server. Please try again later."
            : error.response?.data?.message || error.message

        notifications.show({
          title: "Error",
          message,
          color: "red",
        })
      } else {
        notifications.show({
          title: "Unknown error",
          message: "An unexpected error occurred. Please try again later.",
          color: "red",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-indigo-400 to-purple-600 hover:from-indigo-500 hover:to-purple-700 dark:from-indigo-600 dark:to-purple-900 dark:hover:from-indigo-600 dark:hover:to-purple-600">
          <Mail className="mr-2 h-4 w-4" />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white text-black border-gray-200 dark:bg-[#170f3e] dark:text-white dark:border-white/10">
        <DialogHeader>
          <DialogTitle>Invite members</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-white/70">
            Invite new members to join your team {team?.name || ""}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitInvitation}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-black dark:text-white">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                value={inviteeEmail}
                onChange={(e) => setInviteeEmail(e.target.value)}
                required
                className="bg-white border border-gray-300 text-black dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-black dark:text-white">
                Role
              </Label>
              <Select onValueChange={(value) => setRole(value)} value={role}>
                <SelectTrigger className="bg-white border border-gray-300 text-black dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1f1b3a] dark:text-white">
                  {roles.map((r, i) => (
                    <SelectItem key={i} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border border-gray-300 bg-white text-black hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-400 to-purple-600 hover:from-indigo-500 hover:to-purple-700 text-white dark:from-indigo-600 dark:to-purple-900 dark:hover:from-indigo-600 dark:hover:to-purple-600"
            >
              {isLoading ? "Sending..." : "Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}