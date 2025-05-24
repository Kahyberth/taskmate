import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Team } from "@/lib/store";
import { AuthContext } from "@/context/AuthContext";
import { useTeamsByUser } from "@/api/queries";

interface TeamsContextType {
  teams: Team[] | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Debug current page changes
  useEffect(() => {
    console.log("Current page changed to:", currentPage);
  }, [currentPage]);

  // Handle page change with explicit page parameter
  const handlePageChange = useCallback((page: number) => {
    console.log("Setting page to:", page);
    setCurrentPage(page);
  }, []);

  // Usar React Query para obtener los equipos con paginación
  const { 
    data: teamsData, 
    isLoading: loading, 
    error: queryError,
    refetch
  } = useTeamsByUser(user_data?.id, currentPage);

  // Log when query data changes
  useEffect(() => {
    console.log("Query data updated:", teamsData);
  }, [teamsData]);

  // Actualizar el estado local cuando cambian los datos de React Query
  const error = queryError ? (queryError as Error).message : null;

  // Sincronizar el estado local con los datos de la consulta
  useEffect(() => {
    if (teamsData) {
      if (teamsData.teams && JSON.stringify(teamsData.teams) !== JSON.stringify(teams)) {
        setTeams(teamsData.teams);
      }
      if (teamsData.totalPages !== totalPages) {
        setTotalPages(teamsData.totalPages);
  }
    }
  }, [teamsData, teams, totalPages]);

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
        currentPage,
        totalPages,
        setCurrentPage: handlePageChange, // Use the wrapped handler
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