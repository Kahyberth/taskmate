import { useState, useEffect, useContext } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Users } from "lucide-react"
import { TeamsHeader } from "@/components/teams/TeamHeader"
import { TeamsFilters } from "@/components/teams/TeamsFilters"
import { TeamCard } from "@/components/teams/TeamCard"
import { Team, TeamMember } from "@/lib/store"
import { AuthContext } from "@/context/AuthContext"
import { notifications } from "@mantine/notifications"
import { EditTeamComponent } from "@/components/teams/EditTeam"
import { LoadingSkeleton } from "@/components/teams/TeamSkeleton"
import useTeamService from "@/hooks/useTeamService"
import { useTeams } from "@/context/TeamsContext"
import { useNavigate } from "react-router-dom";


export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null)

  const { user: user_data } = useContext(AuthContext)
  const { fetchTeamsByUser, loading, error } = useTeamService()
  const { teams } = useTeams()
  const navigate = useNavigate()

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
  
    // Validar que user_data.id esté definido
    if (!user_data?.id) {
      notifications.show({
        title: "Error",
        message: "User ID not found.",
        color: "red",
      });
      return;
    }

    try {
      // Obtener los equipos del usuario con sus roles
      const teamsData = await fetchTeamsByUser(user_data.id);
      console.log("Equipos cargados:", teamsData);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Error loading teams.",
        color: "red",
      });
    }
  };
  
  console.log("Equipos en estado:", teams);
  
  console.log('Equipos en estado:', teams);



  console.log('filter', filterValue)
  const filteredTeams = (teams ?? [])
    .filter(
      (team) => {
        const query = searchQuery.toLowerCase()
        const matchesTeamName = team.name.toLowerCase().includes(query)

        const matchesMember = team.members?.some((member: TeamMember) =>
          member.member.name.toLowerCase().includes(query)
        )

        return (matchesTeamName || matchesMember) && 
              (filterValue === "all" || team.role.toLowerCase() === filterValue || (filterValue === "member" && team.role.toLowerCase() !== "leader"))
        // (filterValue === "all" || team.role === filterValue),
      }
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "members") return b.members.length - a.members.length
      //if (sortBy === "activity") return a.lastActive.localeCompare(b.lastActive)
      return 0
    })

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <TeamsHeader />
      <TeamsFilters filterValue={filterValue} setFilterValue={setFilterValue} sortBy={sortBy} setSortBy={setSortBy} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No teams found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              setTeamToEdit={setTeamToEdit}
              onClick={(team) => { navigate(`${team.id}`); }}
            />
          ))}
        </div>
      )}
      <EditTeamComponent teamToEdit={teamToEdit} setTeamToEdit={setTeamToEdit} />
      <Toaster />
    </div>
  )
}

