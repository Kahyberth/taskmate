import { createContext } from "react";
import { UserProfile } from '../interfaces/profile.interface';


export interface UserInterface {
  id: string;
  email: string;
  name: string;
  lastName: string;
  company: string;
}



export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInterface | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string | null }>;
  logout: () => Promise<void>;
  loading: boolean;
  profileLoading: boolean;
  userProfile: UserProfile | null;
  fetchUserProfile: (user_id: string) => Promise<void>
}



export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => Promise.resolve(),
  login: async () => ({ success: false }),
  fetchUserProfile: async () => {},
  isAuthenticated: false,
  profileLoading: true,
  userProfile: null,
});