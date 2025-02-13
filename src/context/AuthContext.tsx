import { createContext } from "react";


export interface UserInterface {
    id: string;
    email: string;
    name: string;
    lastName: string;
    company: string;
  }


interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserInterface | null;
  login: (userData: UserInterface) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});