import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const members = [
  {
    name: "María García",
    role: "Product Manager",
    image: "/placeholder.svg",
    initials: "MG",
    status: "online",
  },
  {
    name: "Carlos Ruiz",
    role: "Senior Developer",
    image: "/placeholder.svg",
    initials: "CR",
    status: "online",
  },
  {
    name: "Ana Martínez",
    role: "UI Designer",
    image: "/placeholder.svg",
    initials: "AM",
    status: "offline",
  },
  {
    name: "David López",
    role: "Backend Developer",
    image: "/placeholder.svg",
    initials: "DL",
    status: "online",
  },
]

export function TeamMembers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Miembros del Equipo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {members.map((member, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.image} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`h-2 w-2 rounded-full p-0 ${
                  member.status === "online" ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

