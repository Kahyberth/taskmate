
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamsGrid } from "@/components/teams/teams-grid"
import { TeamsHeader } from "@/components/teams/teams-header"

export default function TeamsPage() {
  return (
    <DashboardShell>
      <TeamsHeader />
      <TeamsGrid />
    </DashboardShell>
  )
}

