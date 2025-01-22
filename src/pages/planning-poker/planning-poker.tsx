import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ActiveRooms } from "@/components/planning-poker/active-rooms"
import { PlanningPokerHeader } from "@/components/planning-poker/planning-poker-header"
import { QuickJoin } from "@/components/planning-poker/quick-join"
import { RecentSessions } from "@/components/planning-poker/recent-sessions"


export default function PlanningPokerPage() {
  return (
    <DashboardShell>
      <PlanningPokerHeader />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ActiveRooms />
          <RecentSessions />
        </div>
        <div>
          <QuickJoin />
        </div>
      </div>
    </DashboardShell>
  )
}

