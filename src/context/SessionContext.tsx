import { createContext } from "react";

interface SessionContextProps {
  isInSession: boolean;
  loading: boolean;
  session_id: string | null;
  leaveSession: () => void;
  validateSession: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextProps>({
  isInSession: false,
  loading: true,
  validateSession: async () => {},
  session_id: "",
  leaveSession: () => {},
});
