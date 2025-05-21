import { createContext, useContext, useState, useCallback } from "react";
import { Team } from "@/lib/store";
import { AuthContext } from "@/context/AuthContext";
import { useTeamsByUser } from "@/api/queries";

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
  const [teams, setTeams] = useState<Team[] | null>(null);

  // Usar React Query para obtener los equipos
  const { 
    data: teamsData, 
    isLoading: loading, 
    error: queryError,
    refetch
  } = useTeamsByUser(user_data?.id);

  // Actualizar el estado local cuando cambian los datos de React Query
  const error = queryError ? (queryError as Error).message : null;

  // Sincronizar el estado local con los datos de la consulta
  if (teamsData && JSON.stringify(teamsData) !== JSON.stringify(teams)) {
        setTeams(teamsData);
  }

  // Función para obtener los equipos del usuario (ahora usa refetch de React Query)
  const fetchTeams = useCallback(() => {
    refetch();
  }, [refetch]);

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