import { useContext } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthContext } from "@/context/AuthContext";
import { useProjectsByUser } from "@/api/queries";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectSelectorProps {
  selectedProjectId: string | null;
  onProjectChange: (projectId: string | null) => void;
}


interface Project {
  id: string;
  name: string;
  description?: string;
}

export function ProjectSelector({ selectedProjectId, onProjectChange }: ProjectSelectorProps) {
  const { user } = useContext(AuthContext);
  const { data: projectsData, isLoading } = useProjectsByUser(user?.id);
  
  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  if (!projectsData?.projects || projectsData.projects.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Project:</span>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
          No projects available
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Project:</span>
      <Select
        value={selectedProjectId || "all"}
        onValueChange={(value) => {
          if (value === "all") {
            onProjectChange(null);
          } else {
            onProjectChange(value);
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projectsData.projects.map((project: Project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 