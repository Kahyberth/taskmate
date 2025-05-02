import { apiClient } from "@/api/client-gateway";
import { CreateTeamDTO, Team, TeamMember, UpdateTeamDto } from "@/lib/store";
import { useCallback, useState } from "react";

interface UseTeamServiceResponse {
  fetchTeamsByUser: (userId: string) => Promise<Team[]>;
  createTeam: (team: CreateTeamDTO) => Promise<void>;
  updateTeam: (team: UpdateTeamDto) => Promise<void>;
  deleteTeam: (teamId: string, requesterId: string) => Promise<void>;
  leaveTeam: (teamId: string, userId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom Hook para manejar operaciones CRUD de equipos.
 * 
 * @returns {UseTeamServiceResponse} Funciones para crear, actualizar y eliminar equipos.
 */
export default function useTeamService(): UseTeamServiceResponse {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función genérica para manejar las solicitudes
  const sendRequest = useCallback(async (callback: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await callback();
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Error desconocido"
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
    setLoading(false);
    }
  }, []);


  // Obtener los equipos de un usuario
  const fetchTeamsByUser = useCallback(async (userId: string, page?: number): Promise<Team[]> => {
    try {

      if(!page) page = 1;

      setLoading(true);
      const teamsResponse = await apiClient.get(`/teams/get-team-by-user/${userId}?page=${page}`, {
        timeout: 10000,
      });
      const teamsData = teamsResponse.data;

      console.log("Teams data desde el servicio ", teamsData);

      const teamsWithMembers = await Promise.all(
        teamsData.map(async (team: Team) => {

          console.log("Teams Information ", team);

          const membersResponse = await apiClient.get(`/teams/get-members-by-team/${team.id}`);
          const members = membersResponse.data;
          
          const userRole = members.find((member: TeamMember) => member.member.id === userId)?.role;

          return {
            ...team,
            role: userRole,
            members,
          };
        })
      );

      return teamsWithMembers;
    } catch (error: any) {
      throw new Error(
        (error.response?.data?.message) || "An error occurred while fetching teams."
      );
    } finally {
      setLoading(false);
    }
  }, []);


  // Crear un equipo
  const createTeam = useCallback(
    async (team: CreateTeamDTO) => {
      await sendRequest(() => apiClient.post("/teams/create-team", team))
    },
    [sendRequest]
  );

  // Actualizar un equipo
  const updateTeam = useCallback(
    async (team: UpdateTeamDto) => {
      await sendRequest(() => apiClient.patch(`/teams/update-team`, team))
    },
    [sendRequest]
  );

  // Eliminar un equipo
  const deleteTeam = useCallback(
    async (teamId: string, requesterId: string) => {
      console.log("Deleting team with id: ", teamId);
      await sendRequest(() => apiClient.delete(`/teams/delete-team/${teamId}`, 
        { data: 
          { requesterId } 
        }
      ))
    },
    [sendRequest]
  );

  // Abandonar un equipo
  const leaveTeam = useCallback(
    async (teamId: string, userId: string) => {
      await sendRequest(() => apiClient.post(`/teams/leave-team/${teamId}`, 
        { teamId, userId }
      ))
    },
    [sendRequest]
  );

  return { fetchTeamsByUser, createTeam, updateTeam, deleteTeam, leaveTeam, loading, error };
}