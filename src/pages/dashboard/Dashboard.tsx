import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProjectsGrid } from "@/components/dashboard/projects-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { ProjectActivity } from "@/components/dashboard/project-activity"
import { TeamWorkload } from "@/components/dashboard/team-workload"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <StatsCards />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 space-y-8">
            <QuickActions />
            <ProjectsGrid />
            <ProjectActivity />
          </div>
          <div className="col-span-3 space-y-8">
            <TeamWorkload />
            <UpcomingMeetings />
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

