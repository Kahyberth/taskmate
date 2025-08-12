import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: null;
  company: string;
  isActive: boolean;
  isAvailable: boolean;
  profile: {
    id: string;
    userId: string;
    profile_picture: string;
    profile_banner: string;
    bio: string;
    updatedAt: Date;
    availabilityStatus: string;
    isVerified: boolean;
    isBlocked: boolean;
    skills: string;
    location: string;
    social_links: string;
    experience: string;
    education: string;
    timezone: null;
  };
}

interface SocketAuth {
  room: string;
  user: UserProfile;
}

export function useSocket(serverUrl: string, auth?: SocketAuth) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!auth) return;

        if (socketRef.current?.connected) {
            return;
        }

        socketRef.current = io(serverUrl, {
            transports: ["websocket"], 
            autoConnect: true,
            auth: auth,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setIsConnected(false);
        });

        return () => {
            if (socket?.connected) {
                socket.disconnect();
            }
        };
    }, [serverUrl, auth?.room, auth?.user?.id]);

    return { socket: socketRef.current, isConnected };
}
