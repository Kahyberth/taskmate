import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { SessionContext } from "@/context/SessionContext";
import PlanningPokerPage from "@/pages/planning-poker/planning-poker";

const PlanningPokerPageGuard: React.FC = () => {
  const { isInSession, session_id, validateSession } = useContext(SessionContext);

    useEffect(() => {
        const verify = async () => {
            await validateSession();
        }
        verify();
    }, [validateSession]);

  if (isInSession && session_id) {
    return (
      <Navigate to={`/dashboard/planning-poker/room/${session_id}`} replace />
    );
  }

  return <PlanningPokerPage />;
};

export default PlanningPokerPageGuard;
