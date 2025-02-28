import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Team } from "@/lib/store"
import { TeamRoleEnum } from "@/enums/team-roles.enum"
import { useEffect, useState } from "react"
import { rolesE } from "@/lib/utils"
import { apiClient } from "@/api/client-gateway"
import axios from "axios"
import { notifications } from "@mantine/notifications"
import { Mail } from "lucide-react"



export const InviteMembersDialog = ({
  open,
  team,
  onOpenChange,
}: {
  open: boolean;
  team: Team;
  onOpenChange: (open: boolean) => void;
}) => {

  const [ inviteeEmail, setInviteeEmail ] = useState<string>('')
  const [ role, setRole ] = useState<string>('')
  const [ isLoading, setLoading ] = useState<boolean>(false)
  const [ roles, setRoles ] = useState<TeamRoleEnum[]>([])

  useEffect(() => {
    setRoles(rolesE)
  }, [])

  const handleSubmitInvitation = async () => {
    setLoading(true);
    try {
      await apiClient.post(`teams/generate-invite-link/${team.id}`, 
        {
        inviteeEmail: inviteeEmail,
        teamId: team.id,
        roleInTeam: role,
        }
      )
      onOpenChange(false)

      notifications.show({
        title: "Invitación enviada",
        message: `Se ha enviado una invitación a ${inviteeEmail}`,
        color: "blue",
      });

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          notifications.show({
            title: "Error de conexión 🌐",
            message:
              "No se pudo establecer conexión con el servidor. Inténtalo de nuevo más tarde.",
            color: "red",
          });
        } else {
          console.error("Error invitando al equipo:", error);
          notifications.show({
            title: "Error invitando al equipo",
            message: error.response?.data?.message || error.message,
            color: "red",
          });
        }
      } else {
        console.error("Error desconocido:", error);
        notifications.show({
          title: "Error desconocido",
          message: "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
          color: "red",
        });
      }
    } finally {
      setLoading(false);
    }
      
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>Invite new members to join your team.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="email">Email address</label>
            <Input 
              id="email" 
              name="email" 
              placeholder="Enter email address" 
              type="email" 
              onChange={(e) => {setInviteeEmail(e.target.value)}}/>
          </div>
          <div className="grid gap-2">
            <label htmlFor="role">Role</label>
            <Select onValueChange={(value) => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {
                  roles.map((role, index) => (
                    <SelectItem key={index} value={role}>
                      {role}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSubmitInvitation}>
            {isLoading ? "Inviting to team..." : "Send Invitation"}  
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


