import { useState, useContext } from "react";
import { Plus, Search, Filter, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateProjectForm } from "@/components/projects/create-project";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectCardSkeleton } from "@/components/projects/project-card-skeleton";
import { AuthContext } from "@/context/AuthContext";
import { useProjectsByUser } from "@/api/queries";

export default function ProjectsPage() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Usar React Query para obtener los proyectos
  const { data: projects = [], isLoading, refetch } = useProjectsByUser(user?.id);

  const handleCreateProjectSuccess = () => {
    setCreateDialogOpen(false);
    refetch();
  };

  // Definir un tipo para el proyecto
  type Project = {
    id: string;
    name?: string;
    description?: string;
    status?: string;
    priority?: string;
  };

  const filteredProjects = projects.filter((project: Project) => {
    // Validar que project.name y project.description existan antes de usar toLowerCase
    const nameMatches = project.name && 
      project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descriptionMatches = project.description && 
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSearch = nameMatches || descriptionMatches;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and track your team's projects</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <CreateProjectForm onClose={handleCreateProjectSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("not-started")}>
                Not Started
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("at-risk")}>
                At Risk
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Priority</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                High
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="my">My Projects</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <AlertCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: Project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>My projects will be displayed here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>Recent projects will be displayed here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}