import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SessionContext } from "@/context/SessionContext";
import { notifications } from "@mantine/notifications";

interface PlanningPokerRoomGuardProps {
  children: JSX.Element;
}

const PlanningPokerRoomGuard: React.FC<PlanningPokerRoomGuardProps> = ({
  children,
}) => {
  const { id: roomId } = useParams();
  const { validateSession, isInSession, loading } = useContext(SessionContext);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (roomId) {
        await validateSession();
        setVerified(true);
      }
    };
    verify();
  }, [roomId, validateSession]);


  if (loading || !verified) {
    return <div>Verificando sesión, por favor espere...</div>;
  }

  if (!isInSession) {
    notifications.show({
      title: "Sesión no válida",
      message: "La sesión no es válida o ha expirado. Por favor, inicie una nueva sesión.",
      color: "red",
    })
    return <Navigate to="/dashboard/planning-poker" replace />;
  }


  return children;
};

export default PlanningPokerRoomGuard;
