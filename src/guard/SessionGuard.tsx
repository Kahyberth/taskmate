import { SessionContext } from "@/context/SessionContext";
import { Loader } from "@mantine/core";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";


interface SessionGuardProps {
  children: JSX.Element;
}

const SessionGuard: React.FC<SessionGuardProps> = ({ children }) => {
  const { isInSession, loading, session_id } = useContext(SessionContext);
  const location = useLocation();

  
  if (loading) {
    return <Loader color="grape" type="dots" />
  }


  if (isInSession && !location.pathname.includes("/dashboard/planning-poker/room")) {
    return <Navigate to={`/dashboard/planning-poker/room/${session_id}`} replace />;
  }

  return children;
};

export default SessionGuard;
