import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users } from 'lucide-react'

const meetings = [
  {
    title: "Daily Standup",
    time: "10:00 AM",
    date: "Hoy",
    attendees: 8,
  },
  {
    title: "Sprint Planning",
    time: "2:00 PM",
    date: "Hoy",
    attendees: 12,
  },
  {
    title: "Design Review",
    time: "11:00 AM",
    date: "Mañana",
    attendees: 6,
  },
]

export function UpcomingMeetings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Reuniones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {meetings.map((meeting, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{meeting.title}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{meeting.attendees} participantes</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

