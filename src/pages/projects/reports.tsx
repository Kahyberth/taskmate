import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/api/client-gateway";
import { Projects } from "@/interfaces/projects.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProjectReportsPage() {
  const { project_id } = useParams();
  const [project, setProject] = useState<Projects | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Datos de ejemplo para los gráficos
  const taskCompletionData = [
    { name: 'Semana 1', completadas: 5, pendientes: 8 },
    { name: 'Semana 2', completadas: 8, pendientes: 5 },
    { name: 'Semana 3', completadas: 12, pendientes: 3 },
    { name: 'Semana 4', completadas: 15, pendientes: 2 },
  ];

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
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project?.name || 'Informes del proyecto'}</h1>
        <p className="text-gray-500">
          Análisis y métricas del progreso del proyecto
        </p>
      </div>

      {/* Sección de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Progreso de tareas</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskCompletionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completadas" stackId="a" fill="#4ade80" />
                <Bar dataKey="pendientes" stackId="a" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de tareas por estado</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                No hay suficientes datos para generar este gráfico.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de métricas */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas clave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-sm text-gray-500">Velocidad del equipo</h3>
              <p className="text-2xl font-bold">24 pts/sprint</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-sm text-gray-500">Tiempo promedio de resolución</h3>
              <p className="text-2xl font-bold">3.2 días</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-sm text-gray-500">Tasa de finalización</h3>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 