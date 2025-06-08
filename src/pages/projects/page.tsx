import { useState, useContext, useCallback, useMemo, useEffect } from "react";
import { Plus, Search, Filter, AlertCircle, ChevronDown, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Pagination } from '@mantine/core';
import { useQueryClient } from "@tanstack/react-query";

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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { CreateProjectForm } from "@/components/projects/create-project";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectCardSkeleton } from "@/components/projects/project-card-skeleton";
import { AuthContext } from "@/context/AuthContext";
import { useProjectsByUser } from "@/api/queries";
import { Project } from "@/interfaces/projects.interface";
import { StatusBadge } from "@/components/backlog/status-badge";

export default function ProjectsPage() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const itemsPerPage = 6;
  const queryClient = useQueryClient();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { 
    data: projectsData = { projects: [], totalPages: 0, total: 0 }, 
    isLoading, 
    refetch 
  } = useProjectsByUser(user?.id, currentPage, itemsPerPage);
  
  const projects = projectsData.projects || [];
  const totalPages = projectsData.totalPages || 1;

  useEffect(() => {
    if (projects.length > 0) {
      setLocalProjects(projects);
    }
  }, [projects]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter, activeTab]);

  const handleCreateProjectSuccess = useCallback(() => {
    setCreateDialogOpen(false);
    refetch();
  }, [setCreateDialogOpen, refetch]);

  const updateProjectLocally = useCallback((updatedProject: Project) => {
    setLocalProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  }, []);

  const removeProjectLocally = useCallback((projectId: string) => {
    setLocalProjects(prevProjects => 
      prevProjects.filter(project => project.id !== projectId)
    );
    refetch();
  }, [refetch]);

  const filteredProjects = useMemo(() => {
    const tabFiltered = activeTab === "all" 
      ? localProjects 
      : localProjects.filter((project: Project) => project.createdBy === user?.id);
    
    return tabFiltered.filter((project: Project) => {
      const nameMatches = project.name && 
        project.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const descriptionMatches = project.description && 
        project.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
      const matchesSearch = nameMatches || descriptionMatches;
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [localProjects, debouncedSearchQuery, statusFilter, activeTab, user?.id]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const STATUS_OPTIONS = ["in-progress", "completed"];

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
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                {statusFilter !== "all" && (
                  <StatusBadge status={statusFilter} />
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem
                onClick={() => handleStatusFilter("all")}
                className="flex items-center justify-between"
              >
                <span>All Statuses</span>
                {statusFilter === "all" && (
                  <Circle className="h-2 w-2 fill-current" />
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleStatusFilter(option)}
                  className="flex items-center gap-2"
                >
                  <StatusBadge status={option} />
                  {statusFilter === option && (
                    <Circle className="h-2 w-2 fill-current ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => {
        setActiveTab(value);
        if (user?.id) {
          queryClient.invalidateQueries({ 
            queryKey: ["userProjects", user.id]
          });
          refetch();
        }
      }}>
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="my">My Projects</TabsTrigger>
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: Project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onProjectUpdated={updateProjectLocally}
                    onProjectDeleted={() => removeProjectLocally(project.id)}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination 
                    total={totalPages}
                    value={currentPage} 
                    onChange={handlePageChange} 
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "You haven't created any projects yet"}
              </p>
              <Button 
                onClick={() => setCreateDialogOpen(true)} 
                className="mt-4"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: Project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onProjectUpdated={updateProjectLocally}
                    onProjectDeleted={() => removeProjectLocally(project.id)}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination 
                    total={totalPages}
                    value={currentPage} 
                    onChange={handlePageChange} 
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}