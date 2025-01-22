"use client"

import { TeamCard } from "@/components/teams/team-card"
import { TeamRow } from "@/components/teams/team-row"
import { useTeamsStore } from "@/lib/store"


const teams = [
  {
    id: "1",
    name: "Equipo de Desarrollo",
    description: "Equipo principal de desarrollo de software",
    image: "/placeholder.svg",
    members: [
      {
        id: "1",
        name: "María García",
        email: "maria@company.com",
        role: "owner",
        image: "/placeholder.svg",
        status: "active",
        joinedAt: "2024-01-01",
      },
      {
        id: "2",
        name: "Carlos Ruiz",
        email: "carlos@company.com",
        role: "admin",
        image: "/placeholder.svg",
        status: "active",
        joinedAt: "2024-01-02",
      },
      {
        id: "3",
        name: "Ana Martínez",
        email: "ana@company.com",
        role: "member",
        image: "/placeholder.svg",
        status: "active",
        joinedAt: "2024-01-03",
      },
    ],
    projects: 12,
    tasks: 156,
    progress: 75,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Equipo de Diseño",
    description: "Equipo de diseño UI/UX",
    image: "/placeholder.svg",
    members: [
      {
        id: "4",
        name: "Laura Torres",
        email: "laura@company.com",
        role: "owner",
        image: "/placeholder.svg",
        status: "active",
        joinedAt: "2024-01-01",
      },
      {
        id: "5",
        name: "David López",
        email: "david@company.com",
        role: "member",
        image: "/placeholder.svg",
        status: "active",
        joinedAt: "2024-01-02",
      },
    ],
    projects: 8,
    tasks: 94,
    progress: 60,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
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
        role: "owner",
        image: "/placeholder.svg",
        status: "active",
        joinedAt: "2024-01-01",
      },
      {
        id: "7",
        name: "Juan Pérez",
        email: "juan@company.com",
        role: "member",
        image: "/placeholder.svg",
        status: "active",
        joinedAt: "2024-01-02",
      },
      {
        id: "8",
        name: "Andrea López",
        email: "andrea@company.com",
        role: "member",
        image: "/placeholder.svg",
        status: "active",
        joinedAt: "2024-01-03",
      },
    ],
    projects: 6,
    tasks: 78,
    progress: 85,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
] as const

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

