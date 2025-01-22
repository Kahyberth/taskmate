import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserSession {
  id: string;
  name: string;
  email: string;
}

type ViewMode = 'grid' | 'list'

interface ProjectsStore {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}



interface UserStore {
  userSession: UserSession | null;
  setUserSession: (userData: UserSession) => void;
  clearUserSession: () => void;
}

export type TeamMember = {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  image: string
  status: 'active' | 'inactive'
  joinedAt: string
}

export type Team = {
  id: string
  name: string
  description: string
  image: string
  members: TeamMember[]
  projects: number
  tasks: number
  progress: number
  createdAt: string
  updatedAt: string
}

interface TeamsStore {
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
}


export const useTeamsStore = create<TeamsStore>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
}))



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

