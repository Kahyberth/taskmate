"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { notifications } from "@mantine/notifications"
import { ImageUpload } from "@/components/teams/ImageUpload"
import { AuthContext } from "@/context/AuthContext"
import axios from "axios"
import useTeamService from "@/hooks/useTeamService"
import { useTeams } from "@/context/TeamsContext"

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("")
  const [description, setDescription] = useState("")
  const [teamImage, setTeamImage] = useState<string | null>(null)

  const { user: user_data } = useContext(AuthContext)
  const { createTeam, loading } = useTeamService()
  const { fetchTeams } = useTeams()

  const resetForm = () => {
    setTeamImage(null)
    setTeamName("")
    setDescription("")
  }

  const closeDialog = () => {
    onOpenChange(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const team = {
      name: teamName,
      description: description,
      leaderId: user_data?.id || "",
      image: teamImage,
    }
    try {
      await createTeam(team)

      notifications.show({
        title: "Team created 🎉",
        message: "Team created successfully",
        color: "green",
      });

      fetchTeams()
      closeDialog()
      resetForm()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        notifications.show({
          title: error.code === "ECONNABORTED" ? "Connection error 🌐" : "Error creating team",
          message: error.response?.data?.message || error.message,
          color: "red",
        });
      } else {
        notifications.show({
          title: "Unknown error",
          message: "An unexpected error occurred. Please try again later.",
          color: "red",
        });
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>Create a new team to collaborate with others.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="team-cover">Cover Image</label>
              <ImageUpload
                currentImage={teamImage || undefined}
                onImageChange={(image) => setTeamImage(image)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="team-name">Team Name</label>
              <Input
                id="team-name"
                name="team-name"
                placeholder="Enter team name"
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="team-description">Description</label>
              <Input
                id="team-description"
                name="team-description"
                placeholder="Enter team description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !teamName || !description}>
              {loading ? "Creating Team" : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
