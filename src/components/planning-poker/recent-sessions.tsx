import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from 'lucide-react'

const recentSessions = [
  {
    id: "1",
    name: "Sprint 22 Planning",
    date: "15 Ene 2024",
    duration: "1h 30min",
    issues: 12,
    averageTime: "7min",
    project: "E-commerce Platform",
  },
  {
    id: "2",
    name: "API Integration Planning",
    date: "12 Ene 2024",
    duration: "45min",
    issues: 8,
    averageTime: "5min",
    project: "Inventory System",
  },
  {
    id: "3",
    name: "Mobile Features Estimation",
    date: "10 Ene 2024",
    duration: "1h",
    issues: 15,
    averageTime: "4min",
    project: "Mobile App",
  },
  {
    id: "4",
    name: "Sprint 21 Retrospective",
    date: "7 Ene 2024",
    duration: "1h 15min",
    issues: 10,
    averageTime: "6min",
    project: "E-commerce Platform",
  },
  {
    id: "5",
    name: "Sprint 21 Planning",
    date: "3 Ene 2024",
    duration: "1h 30min",
    issues: 12,
    averageTime: "7min",
    project: "E-commerce Platform",
  }
]

export function RecentSessions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesiones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-60 overflow-y-auto space-y-6 p-2">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="group flex items-center justify-between space-x-4 mr-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{session.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {session.project}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {session.date}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {session.duration}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{session.issues} issues</p>
                  <p className="text-sm text-muted-foreground">
                    ~{session.averageTime}/issue
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

