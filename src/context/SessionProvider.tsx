import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { SessionContext } from "./SessionContext";

interface SessionProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProps> = ({ children }) => {
  const [isInSession, setIsInSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user: user_data } = useContext(AuthContext);
  const [session_id, setSessionId] = useState<string | null>(null);

  const validateSession = async (session_id: string) => {
    console.log("validateSession llamada con session_id:", session_id);
    console.log("user_id:", user_data?.id);
    try {

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/poker/validate-session`, {
        session_id,
        user_id: user_data?.id
      }
    )

      console.log(response);
      console.log(response.data.isInSession)


      if (!response.data.isInSession) {
        setSessionId(session_id);
        setIsInSession(false);
        return;
      }

      setSessionId(session_id);
      setIsInSession(true);

      return;

    } catch (error) {
      console.error(error);
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
