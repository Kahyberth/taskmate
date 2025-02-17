import { UserProfile } from "@/interfaces/profile.interface";
import { createContext } from "react";


export interface UserInterface {
    id: string;
    email: string;
    name: string;
    lastName: string;
    company: string;
  }

  export interface AuthContextProps {
    isAuthenticated: boolean;
    user: UserInterface | null;
    login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string | null }>;
    logout: () => void;
    loading: boolean;
    profileLoading: boolean;
    userProfile: UserProfile | null;
    fetchUserProfile: (user_id: string) => Promise<void>;
  }


  export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    user: null,
    login: async () => ({ success: false }),
    logout: () => {},
    loading: true,
    profileLoading: true,
    userProfile: null,
    fetchUserProfile: async () => {},
  });