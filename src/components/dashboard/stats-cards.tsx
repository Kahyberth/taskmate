import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, GitPullRequest, Star, Users } from 'lucide-react'
import { SparkAreaChart } from "@/components/dashboard/spark-area-chart"

interface Stat {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  data: number[]
  icon: React.ComponentType<{ className?: string }>
}

const stats: Stat[] = [
  {
    title: "Tareas Completadas",
    value: "248",
    change: "+12.5%",
    trend: "up",
    data: [2, 3, 4, 5, 3, 4, 5, 6, 5, 4, 5, 6],
    icon: Activity,
  },
  {
    title: "Pull Requests",
    value: "32",
    change: "+8.2%",
    trend: "up",
    data: [1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 4],
    icon: GitPullRequest,
  },
  {
    title: "Sprint Velocity",
    value: "89",
    change: "-2.3%",
    trend: "down",
    data: [5, 4, 5, 4, 3, 4, 3, 2, 3, 2, 3, 2],
    icon: Star,
  },
  {
    title: "Miembros Activos",
    value: "24",
    change: "+4.1%",
    trend: "up",
    data: [3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7, 6],
    icon: Users,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`text-xs ${
                      stat.trend === "up"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change} desde el último mes
                  </p>
                </div>
                <div className="h-12 w-24">
                  <SparkAreaChart 
                    data={stat.data} 
                    trend={stat.trend}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

