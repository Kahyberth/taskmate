import React, { createContext, useContext, useEffect, useState } from 'react';
import { NotificationsService, Notification } from '../services/notifications.service';

const notificationsService = new NotificationsService();

interface NotificationsContextType {
  notifications: Notification[];
  register: (userId: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const subscription = notificationsService.notifications$.subscribe(
      (newNotifications) => {
        setNotifications(newNotifications);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = (userId: string) => {
    notificationsService.register(userId);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, register }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}; 