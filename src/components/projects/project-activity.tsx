import { MessageSquare, Flag, Rocket } from 'lucide-react'

const activityConfig = {
  comment: {
    icon: MessageSquare,
    className: "text-blue-500",
  },
  task_completed: {
    icon: Flag,
    className: "text-green-500",
  },
  milestone: {
    icon: Flag,
    className: "text-yellow-500",
  },
  release: {
    icon: Rocket,
    className: "text-purple-500",
  },
}

export function ProjectActivity({ activity }: { activity: any[] }) {
  return (
    <div className="space-y-2">
      {activity.slice(0, 2).map((item, i) => {
        const config = activityConfig[item.type as keyof typeof activityConfig]
        const Icon = config.icon
        
        return (
          <div key={i} className="flex items-start gap-2 text-sm">
            <Icon className={`h-4 w-4 mt-0.5 ${config.className}`} />
            <div className="flex-1">
              <p className="line-clamp-1">
                <span className="font-medium">{item.user}</span>
                {" "}
                {item.content}
              </p>
              <p className="text-xs text-gray-500">{item.timestamp}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

