import { useEffect, useState, useCallback } from "react";
import { useSocket } from "./useSocket";

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

interface Message {
  id: string;
  roomId: string;
  text: string;
  time: string;
  fromMe: boolean;
  userName?: string;
  avatar?: string;
}

interface ChatSocketAuth {
  room: string;
  user: UserProfile;
}

export function useChatSocket(serverUrl: string, auth?: ChatSocketAuth | null) {
  const { socket, isConnected } = useSocket(serverUrl, auth || undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<UserProfile[]>([]);

  const joinChannel = useCallback(() => {
    if (!socket || !auth) {
      console.log('Cannot join channel: socket or auth not available');
      return;
    }

    console.log('Joining channel:', auth.room);
    socket.emit('join-channel');
  }, [socket, auth]);

  const sendMessage = useCallback((message: Omit<Message, 'id' | 'time' | 'fromMe'>) => {
    if (!socket || !auth) return;

    const messageData = {
      userName: auth.user.name + ' ' + auth.user.lastName,
      avatar: '',
      value: message.text,
    };

    socket.emit('send-message', messageData);
  }, [socket, auth?.user?.id, auth?.user?.name, auth?.user?.lastName]);

  useEffect(() => {
    if (!socket) return;

    socket.on('online-users', (users: UserProfile[]) => {
      console.log('Received online users:', users);
      setOnlineUsers(users);
    });

    socket.on('offline-users', (users: UserProfile[]) => {
      console.log('Received offline users:', users);
      setOfflineUsers(users);
    });

    socket.on('new-message', (message: any) => {
      console.log('New message received:', message);
    });

    return () => {
      socket.off('online-users');
      socket.off('offline-users');
      socket.off('new-message');
    };
  }, [socket]);

  return {
    socket,
    isConnected,
    messages,
    setMessages,
    onlineUsers,
    offlineUsers,
    joinChannel,
    sendMessage,
  };
}
