import { Link } from 'react-router-dom'
import { ChevronRight, GitPullRequest, ListTodo } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ProjectPriority } from "@/components/projects/project-priority"
import { ProjectStatus } from './project-status'

export function ProjectRow({ project }: { project: any }) {
  return (
    <div className="group relative rounded-lg border p-4 hover:border-blue-600">
      <Link to={`/projects/${project.id}`} className="absolute inset-0 z-10" />
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto_auto_auto_auto]">
        <div className="space-y-1">
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member: any, i: number) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-gray-100 text-xs">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProjectStatus status={project.status} />
        </div>

        <div className="flex items-center gap-2">
          <ProjectPriority priority={project.priority} />
        </div>

        <div className="w-32">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Progreso</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ListTodo className="h-4 w-4" />
            <span>{project.metrics.tasks.completed}/{project.metrics.tasks.total}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitPullRequest className="h-4 w-4" />
            <span>{project.metrics.pullRequests}</span>
          </div>
        </div>

        <div className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

