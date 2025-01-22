import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <ProjectsHeader />
      <ProjectsGrid />
    </DashboardShell>
  )
}

