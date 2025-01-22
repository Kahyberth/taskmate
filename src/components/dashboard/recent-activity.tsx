import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: {
      name: "María García",
      image: "/placeholder.svg",
      initials: "MG",
    },
    action: "comentó en",
    target: "API Documentation",
    time: "hace 5 minutos",
  },
  {
    user: {
      name: "Carlos Ruiz",
      image: "/placeholder.svg",
      initials: "CR",
    },
    action: "creó la tarea",
    target: "Implementar autenticación",
    time: "hace 15 minutos",
  },
  {
    user: {
      name: "Ana Martínez",
      image: "/placeholder.svg",
      initials: "AM",
    },
    action: "completó",
    target: "Diseño de la landing page",
    time: "hace 1 hora",
  },
  {
    user: {
      name: "David López",
      image: "/placeholder.svg",
      initials: "DL",
    },
    action: "actualizó",
    target: "Plan de desarrollo Q2",
    time: "hace 2 horas",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={activity.user.image} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

