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


  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const { 
    data: teamsData, 
    isLoading: loading, 
    error: queryError,
    refetch
  } = useTeamsByUser(user_data?.id, currentPage);

  const error = queryError ? (queryError as Error).message : null;

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
        setCurrentPage: handlePageChange,
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

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error("useTeams must be used within a TeamsProvider");
  }
  return context;
};