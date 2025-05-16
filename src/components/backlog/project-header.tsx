import { useEffect, useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus } from "lucide-react";
import { Projects } from "@/interfaces/projects.interface";
import { Team } from "@/lib/store";

interface ProjectHeaderProps {
  project: Projects | null;
  projectMembers: any[];
  loadingMembers: boolean;
  onOpenMembersDialog: () => void;
}

export function ProjectHeader({
  project,
  projectMembers,
  loadingMembers,
  onOpenMembersDialog
}: ProjectHeaderProps) {
  // Filter unique members by user_id to prevent duplicate avatars
  const uniqueMembers = useMemo(() => {
    const memberIds = new Set();
    return projectMembers.filter(member => {
      // If the member ID is already in the set, it's a duplicate
      if (memberIds.has(member.user_id)) {
        return false;
      }
      // Otherwise, add it to the set and keep this member
      memberIds.add(member.user_id);
      return true;
    });
  }, [projectMembers]);

  return (
    <header className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-black/20">
      <div className="flex items-center p-3 px-4">
        {/* Additional header content could go here */}
      </div>
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-lg shadow-sm">
            <ClipboardList size={16} />
          </div>
          <h1 className="font-medium dark:text-white">{project?.name}</h1>
          
          {/* Project Members */}
          <div className="flex items-center ml-4">
            <div className="flex -space-x-2">
              {loadingMembers ? (
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
              ) : uniqueMembers.length > 0 ? (
                uniqueMembers.slice(0, 5).map((member) => (
                  <Avatar 
                    key={member.user_id} 
                    className="h-6 w-6 border-2 border-white dark:border-gray-800 bg-white dark:bg-gray-800"
                    style={{ zIndex: 5 }} 
                  >
                    <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {member.user ? member.user.name.charAt(0) + (member.user.lastName ? member.user.lastName.charAt(0) : '') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                ))
              ) : null}
              
              {uniqueMembers.length > 5 && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-xs"
                  style={{ zIndex: 10 }}
                  onClick={onOpenMembersDialog}
                >
                  <Plus size={12} />
                </Button>
              )}
              
              {/* Always show add button for easy member management */}
              {uniqueMembers.length <= 5 && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-xs ml-1"
                  style={{ zIndex: 10 }}
                  onClick={onOpenMembersDialog}
                >
                  <Plus size={12} />
                </Button>
              )}
            </div>
            {uniqueMembers.length > 0 && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {uniqueMembers.length} {uniqueMembers.length === 1 ? 'miembro' : 'miembros'}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 