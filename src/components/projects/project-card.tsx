import { Link } from "react-router-dom"
import { Calendar, GitPullRequest, ListTodo } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProjectActivity } from "@/components/projects/project-activity"
import { ProjectStatus } from "./project-status"
import { ProjectPriority } from "./project-priority"

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in_progress" | "completed" | "archived";
  progress: number;
  priority: "completed" | "high" | "low" | "medium";
  dueDate: string;
  members: { image: string; name: string }[];
  activity: { type: string; description: string; date: string }[];
  metrics: {
    tasks: { completed: number; total: number };
    pullRequests: number;
    issues: number;
  };
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:border-blue-600">
      <Link to={`/projects/${project.id}`} className="absolute inset-0 z-10" />
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
          </div>
          <ProjectStatus status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progreso</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <ProjectPriority priority={project.priority} />
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(project.dueDate).toLocaleDateString()}
          </Badge>
        </div>

        <div className="flex -space-x-2">
          {project.members.slice(0, 4).map((member: { image: string; name: string }, i: number) => (
            <Avatar key={i} className="border-2 border-background">
              <AvatarImage src={member.image} alt={member.name} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
          ))}
          {project.members.length > 4 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-gray-100 text-xs">
              +{project.members.length - 4}
            </div>
          )}
        </div>

        <ProjectActivity activity={project.activity} />
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex w-full items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ListTodo className="h-4 w-4" />
              <span>{project.metrics.tasks.completed}/{project.metrics.tasks.total}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitPullRequest className="h-4 w-4" />
              <span>{project.metrics.pullRequests}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {project.metrics.issues > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {project.metrics.issues} issues
              </Badge>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

