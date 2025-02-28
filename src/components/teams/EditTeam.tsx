import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Team, UpdateTeamDto } from "@/lib/store"
import { ImageUpload } from "@/components/teams/ImageUpload"
import { Input } from "../ui/input"
import React, { useContext, useEffect, useState } from "react"
import useTeamService from "@/hooks/useTeamService"
import { notifications } from "@mantine/notifications"
import { AuthContext } from "@/context/AuthContext"
import { useTeams } from "@/context/TeamsContext"

interface editTeamProps {
  teamToEdit: Team | null
  setTeamToEdit: (team: Team | null) => void
}

export const EditTeamComponent = ({ teamToEdit, setTeamToEdit }: editTeamProps) => {

  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [image, setImage] = useState< string | null >(null)
  const { user: user_data } = useContext(AuthContext)

  const { updateTeam, loading, error } = useTeamService()
  const { fetchTeams } = useTeams()

  useEffect(() => {
    if (teamToEdit) {
      setName(teamToEdit.name)
      setDescription(teamToEdit.description)
      setImage(teamToEdit.image || null)
    }

  }, [teamToEdit])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Entrando en Saving changes...");
    console.log("teamToEdit: ", teamToEdit);
  
    if (!teamToEdit) return;

    if(!user_data) {
      notifications.show({
        title: "Error de autenticación",
        message: "No se encontró el usuario. Inténtalo de nuevo.",
        color: "red",
      });
      return;
    }
  
    const updatedFields: UpdateTeamDto = { teamId: teamToEdit.id };
    console.log("updatedFields: ", updatedFields);

    if (name !== teamToEdit.name) updatedFields.name = name;
    if (description !== teamToEdit.description) updatedFields.description = description;
    if (image !== teamToEdit.image) updatedFields.image = image;

    // Verificar si hay cambios reales (excluyendo teamId)
    const hasRealChanges = Object.keys(updatedFields).length > 1;

  
    if (!hasRealChanges) {
      notifications.show({
        title: "Sin cambios",
        message: "No has modificado ningún campo.",
        color: "yellow",
      });
      return;
    }
    
    console.log("Actualizando equipo...", updatedFields);
    await updateTeam(updatedFields);
    if (!error) {
      notifications.show({
        title: "Equipo actualizado 🎉",
        message: "El equipo se ha actualizado correctamente.",
        color: "green",
      });
      fetchTeams()
      handleClose();
    } else {
      notifications.show({
        title: "Error al actualizar el equipo",
        message: error,
        color: "red",
      });
    }
  };
  
  

  const handleClose = () => {
    setImage(null)
    setName('')
    setDescription('')
    setTeamToEdit(null)
  }

  return (
    <Dialog open={!!teamToEdit} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>Update your team's information and settings.</DialogDescription>
        </DialogHeader>
        {teamToEdit && (
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="team-cover">Cover Image</label>
                <ImageUpload
                  currentImage={image || undefined}
                  onImageChange={(image) => setImage(image)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="team-name">Team Name</label>
                <Input
                  id="team-name"
                  name="team-name"
                  defaultValue={teamToEdit.name}
                  placeholder="Enter team name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="team-description">Description</label>
                <Input
                  id="team-description"
                  name="team-description"
                  defaultValue={teamToEdit.description}
                  placeholder="Enter team description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTeamToEdit(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !name || !description}>
                {loading ? "Saving Changes" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}