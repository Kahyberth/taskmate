import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Progress } from "../ui/progress"

interface DashboardStat {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  progressValue: number
  progressClass: string
  changeColor: string
}

const stats: DashboardStat[] = [
  {
    title: "Total Tasks",
    value: "134",
    change: "12%",
    trend: "up",
    progressValue: 65,
    progressClass: "bg-gradient-to-r from-indigo-500 to-purple-500",
    changeColor: "text-green-500 dark:text-green-400",
  },
  {
    title: "Completed",
    value: "94",
    change: "8%",
    trend: "up",
    progressValue: 70,
    progressClass: "bg-gradient-to-r from-green-500 to-emerald-500",
    changeColor: "text-green-500 dark:text-green-400",
  },
  {
    title: "In Progress",
    value: "28",
    change: "3%",
    trend: "down",
    progressValue: 21,
    progressClass: "bg-gray-300 dark:bg-white/10",
    changeColor: "text-yellow-500 dark:text-yellow-400",
  },
  {
    title: "Overdue",
    value: "12",
    change: "15%",
    trend: "up",
    progressValue: 9,
    progressClass: "bg-gray-300 dark:bg-white/10",
    changeColor: "text-red-500 dark:text-red-400",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="bg-white border-gray-200 dark:bg-white/5 dark:border-white/10"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className={`text-sm ${stat.changeColor} flex items-center`}>
                {stat.trend === "up" ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <Progress 
              value={stat.progressValue} 
              className={`mt-2 h-1 ${stat.progressClass}`}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}