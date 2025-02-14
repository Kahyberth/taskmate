import { TeamCard } from "@/components/teams/team-card"
import { TeamRow } from "@/components/teams/team-row"
import { useTeamsStore } from "@/lib/store"


const teams = [
  {
    id: "3",
    name: "Equipo de Marketing",
    description: "Equipo de marketing y comunicación",
    image: "/placeholder.svg",
    members: [
      {
        id: "6",
        name: "Sofia Herrera",
        email: "sofia@company.com",
        role: "owner" as const,
        image: "/placeholder.svg",
        status: "active" as const,
        joinedAt: "2024-01-01",
      },
      {
        id: "7",
        name: "Juan Pérez",
        email: "juan@company.com",
        role: "member" as const,
        image: "/placeholder.svg",
        status: "active" as const,
        joinedAt: "2024-01-02",
      },
      {
        id: "8",
        name: "Andrea López",
        email: "andrea@company.com",
        role: "member" as const,
        image: "/placeholder.svg",
        status: "active" as const,
        joinedAt: "2024-01-03",
      },
    ],
    projects: 6,
    tasks: 78,
    progress: 85,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  }  
];


export function TeamsGrid() {
  const { viewMode } = useTeamsStore()

  return (
    <div className="mt-6 space-y-6">
      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <TeamRow key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  )
}

