import { useState, useEffect, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Users, Loader2 } from "lucide-react";
import { apiClient } from "@/api/client-gateway";
import { AuthContext } from "@/context/AuthContext";
import { Team } from "@/lib/store";
import { notifications } from "@mantine/notifications";

interface InviteMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  projectMembers: any[];
  refetchMembers: () => Promise<void>;
  currentTeam?: Team | null;
}

export function InviteMembersDialog({
  open,
  onOpenChange,
  project,
  projectMembers,
  refetchMembers,
  currentTeam
}: InviteMembersDialogProps) {
  const { user } = useContext(AuthContext);
  const [availableTeamMembers, setAvailableTeamMembers] = useState<any[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedTeamMember('');
    } else if (open) {
      fetchAvailableTeamMembers();
    }
  }, [open, currentTeam?.id]);

  const fetchAvailableTeamMembers = async () => {
    console.log("currentTeam", currentTeam);
    if (!currentTeam?.id) {
      notifications.show({
        title: "Error",
        message: "Could not get the team ID",
        color: "red"
      });
      return;
    }

    await apiClient.get(`/projects/team-members/unassigned?teamId=${currentTeam.id}&projectId=${project.id}`)
    .then((response) => {
      setAvailableTeamMembers(response.data);
      console.log("availableTeamMembers", availableTeamMembers);
    })
    .catch((error) => {
      notifications.show({
        title: "Error",
        message: `Error loading available members: ${error}`,
        color: "red"
      })
    })
    .finally(() => {
      setLoadingMembers(false);
    })
  }

  const handleAddTeamMember = async () => {
    if (!selectedTeamMember || isAddingMember) return;
    
    setIsAddingMember(true);
    
    await apiClient.post(`/projects/invite-member`, {
      projectId: project.id,
      userId: user?.id,
      invitedUserId: selectedTeamMember,
      email: availableTeamMembers.find(m => m.member.id === selectedTeamMember)?.member.email
    })
    .then(async (response) => {
      if (response.data) {
        await refetchMembers();
        await fetchAvailableTeamMembers();
        
        setSelectedTeamMember('');
        
        notifications.show({
          title: "Member Added",
          message: "The member has been successfully added to the project",
          color: "green"
        });
      }
    })
    .catch((error) => {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Could not add the member",
        color: "red"
      });
    })
    .finally(() => {
      setIsAddingMember(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">Project Members</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {`${projectMembers.length} member(s) in this project`}
            {currentTeam && (
              <span className="ml-1">
                - Team: {currentTeam.name}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="team-member-select" className="text-sm font-medium dark:text-gray-200">
                Select team member
              </Label>
              <div className="flex gap-2">
                <Select
                  value={selectedTeamMember}
                  onValueChange={setSelectedTeamMember}
                  disabled={isAddingMember}
                >
                  <SelectTrigger id="team-member-select" className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {availableTeamMembers.length > 0 ? (
                      availableTeamMembers.map((teamMember) => (
                        <SelectItem 
                          key={teamMember.member.id} 
                          value={teamMember.member.id}
                          className="dark:text-gray-200"
                        >
                          {`${teamMember.member.name || ''} ${teamMember.member.lastName || ''}`.trim() || 'User'} 
                          <span className="ml-1 text-gray-500">({teamMember.role || 'Team Member'})</span>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled className="dark:text-gray-400">
                        No available members
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAddTeamMember} 
                  disabled={isAddingMember || !selectedTeamMember || selectedTeamMember === 'none'}
                  className="dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
                >
                  {isAddingMember ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span>Add</span>
                    </>
                  )}
                </Button>
              </div>
              {availableTeamMembers.length === 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No team members available to add to the project.
                  </p>
                </div>
              )}
              {availableTeamMembers.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {`${availableTeamMembers.length} member(s) available to add`}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Current members list */}
        <div className="max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {loadingMembers ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={`skeleton-${i}`} className="flex items-center p-2 rounded-md">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
                  <div className="ml-3 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projectMembers.length > 0 ? (
            <div className="grid gap-1.5">
              {projectMembers.map((member) => (
                <div 
                  key={member.userId || member.id}
                  className="flex items-center p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm">
                      {member.name 
                        ? member.name.charAt(0) + (member.lastName ? member.lastName.charAt(0) : '') 
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-gray-200 truncate">
                      {member 
                        ? `${member.name || ''} ${member.lastName || ''}`.trim() 
                        : 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {member.email || member.id}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Member
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Users className="mx-auto h-12 w-12 opacity-30 mb-2" />
              <p>No members in this project.</p>
              <p className="text-sm">Project members will appear here when added.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
