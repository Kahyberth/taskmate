import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import KanbanBoard from "@/pages/backlog/kanban/page";
import { apiClient } from "@/api/client-gateway";
import { Projects } from "@/interfaces/projects.interface";

export default function ProjectBoardPage() {
  const { project_id } = useParams();
  const [project, setProject] = useState<Projects | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!project_id) return;

      try {
        setIsLoading(true);
        const response = await apiClient.get(`/projects/${project_id}`);
        if (response.data) {
          setProject(response.data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [project_id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project?.name || 'Tablero del proyecto'}</h1>
        <p className="text-gray-500">
          Visualiza y gestiona las tareas del proyecto en formato Kanban
        </p>
      </div>

      {/* Tablero Kanban */}
      <KanbanBoard />
    </div>
  );
} 