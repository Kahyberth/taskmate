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
        await validateSession(roomId);
        setVerified(true);
      }
    };
    verify();
  }, [roomId, validateSession]);

  // Mientras se está verificando, mostramos un indicador de carga.


  if (loading || !verified) {
    return <div>Verificando sesión, por favor espere...</div>;
  }

  // Si la sesión no es válida, redirigimos a la página de Planning Poker
  if (!isInSession) {
    notifications.show({
      title: "Sesión no válida",
      message: "La sesión no es válida o ha expirado. Por favor, inicie una nueva sesión.",
      color: "red",
    })
    return <Navigate to="/dashboard/planning-poker" replace />;
  }

  // Si la sesión es válida, renderizamos el contenido de la sala.
  return children;
};

export default PlanningPokerRoomGuard;
