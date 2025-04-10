import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { notifications } from "@mantine/notifications";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const socketIo: Socket = io("http://localhost:4009", {
      autoConnect: false, 
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user?.id) {
      socket.io.opts.query = {
        userId: user.id,
      };

      socket.connect();

      socket.emit("user_connected", { user });

      socket.on("team_connected", () => {
        notifications.show({
          title: "User connected",
          message: `User ${user.name} connected`,
          color: "blue",
        });
      });
    }
  }, [user, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
