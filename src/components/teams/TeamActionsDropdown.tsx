import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, LinkIcon, Settings } from "lucide-react";
import { Team } from "@/lib/store";
import { CustomDialog } from "./CustomDialog";

interface TeamActionsDropdownProps {
  team: Team;
  handleCopyInviteLink: (teamId: string) => void;
  handleDeleteTeam: (teamId: string) => void;
  handleLeaveTeam: (teamId: string) => void;
  setTeamToEdit: (team: Team | null) => void;
  loading: boolean;
}

export const TeamActionsDropdown = ({
  team,
  handleCopyInviteLink,
  handleDeleteTeam,
  handleLeaveTeam,
  setTeamToEdit,
  loading,
}: TeamActionsDropdownProps) => {
  const [actionType, setActionType] = useState<"delete" | "leave" | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleActionConfirm = () => {
    if (actionType === "delete") {
      handleDeleteTeam(team.id);
    } else if (actionType === "leave") {
      handleLeaveTeam(team.id);
    }
    setIsOpen(false); // Cerrar el diálogo después de la acción
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()} // ← Detener propagación aquí
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Team Actions</DropdownMenuLabel>
          {team.role === "LEADER" ? (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleCopyInviteLink(team.id)}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Copy Invite Link
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTeamToEdit(team)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Edit Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setActionType("delete");
                  setIsOpen(true);
                }}
              >
                Delete Team
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setActionType("leave");
                setIsOpen(true);
              }}
            >
              Leave Team
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && !loading) {
            setIsOpen(false);
          }
        }}
        title={actionType === "delete" ? "Delete Team" : "Leave Team"}
        description={
          actionType === "delete"
            ? "Are you sure you want to delete this team? This action cannot be undone."
            : "Are you sure you want to leave this team? You'll need to be invited back to rejoin."
        }
        onConfirm={handleActionConfirm}
        confirmText={actionType === "delete" ? "Delete Team" : "Leave Team"}
        cancelText="Cancel"
        loading={loading}
        disabled={loading}
      />
    </>
  );
};
