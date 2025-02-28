import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserSession {
  id: string;
  name: string;
  email: string;
}

type ViewMode = 'grid' | 'list'

export type CreateTeamDTO = {
  name: string;
  description: string;
  leaderId: string;
  image?: string | null;
};


export type TeamMember = {
  member: {
    id: string
    name: string;
    lastName: string;
    email: string
    image: string
    isActive: boolean
    joinedAt: string
  },
  role: string 
}

export type Team = {
  id: string
  name: string
  description: string
  image: string | null
  members: TeamMember[]
  tasks: number
  createdAt: string
  updatedAt: string
  role: string
}

export type UpdateTeamDto = {
  teamId: string;
  name?: string;
  description?: string;
  image?: string | null;
};


interface ProjectsStore {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}


interface UserStore {
  userSession: UserSession | null;
  setUserSession: (userData: UserSession) => void;
  clearUserSession: () => void;
}

interface TeamsStore {
  teams: Team[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  addTeam: (team: Team) => void;
}


export const useTeamsStore = create<TeamsStore>((set) => ({
  teams: [],
  viewMode: "grid",
  setViewMode: (mode) => set({ viewMode: mode }),
  addTeam: (team: Team) => set((state) => ({ teams: [...state.teams, team] })),
}));



export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userSession: null,
      setUserSession: (userData: UserSession) => set({ userSession: userData }),
      clearUserSession: () => set({ userSession: null }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useProjectsStore = create<ProjectsStore>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
}))

