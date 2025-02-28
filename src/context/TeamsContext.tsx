import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Team } from "@/lib/store";
import { AuthContext } from "@/context/AuthContext";
import useTeamService from "@/hooks/useTeamService";

interface TeamsContextType {
  teams: Team[] | null;
  loading: boolean;
  error: string | null;
  setTeams: (teams: Team[] | null) => void;
  fetchTeams: () => void;
  addTeam: (newTeam: Team) => void;
  editTeam: (updatedTeam: Team) => void;
  removeTeam: (teamId: string) => void;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: user_data } = useContext(AuthContext);
  const { fetchTeamsByUser, loading, error } = useTeamService();
  const [teams, setTeams] = useState<Team[] | null>(null);

  // Función para obtener los equipos del usuario
  const fetchTeams = useCallback(async () => {
    if (user_data?.id) {
      try {
        const teamsData = await fetchTeamsByUser(user_data.id);
        setTeams(teamsData);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    }
  }, [user_data?.id, fetchTeamsByUser]);

  // Obtener los equipos al montar el componente o cuando cambie el usuario
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);


  const addTeam = (newTeam: Team) => {
    setTeams((prevTeams) => (prevTeams ? [...prevTeams, newTeam] : [newTeam]));
  };
  
  const editTeam = (updatedTeam: Team) => {
    setTeams((prevTeams) =>
      prevTeams
        ? prevTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
        : null
    );
  };
  
  const removeTeam = (teamId: string) => {
    setTeams((prevTeams) => prevTeams?.filter((team) => team.id !== teamId) || null);
  };
  

  return (
    <TeamsContext.Provider
      value={{
        teams,
        loading,
        error,
        setTeams,
        fetchTeams,
        addTeam,
        editTeam,
        removeTeam,
      }}
      >
      {children}
    </TeamsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error("useTeams must be used within a TeamsProvider");
  }
  return context;
};