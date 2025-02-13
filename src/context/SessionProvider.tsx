import axios from "axios";
import { useContext, useState } from "react";
import { SessionContext } from "./SessionContext";
import { AuthContext } from "./AuthContext";

interface SessionProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProps> = ({ children }) => {
  const [isInSession, setIsInSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user: user_data } = useContext(AuthContext);
  const [session_id, setSessionId] = useState<string | null>(null);

  const validateSession = async () => {
    try {

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/poker/validate-session`, {
        user_id: user_data?.id
      }
    )

      if (!response.data.isInSession) {
        setIsInSession(false);
        return;
      }

      setSessionId(response.data.session_id);
      setIsInSession(true);

      return;

    } catch {
      setSessionId(null);
      setIsInSession(false);

    } finally {
      setLoading(false);
    }
  };

  const leaveSession = () => {
    setIsInSession(false);
  }

  return (
    <SessionContext.Provider value={{ isInSession, loading, validateSession, session_id, leaveSession }}>
      {children}
    </SessionContext.Provider>
  );
};
