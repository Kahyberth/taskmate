import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader } from "@mantine/core";
import { AuthContext, UserInterface } from "./AuthContext";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { UserProfile } from "@/interfaces/profile.interface";



interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);


  const persistUser = useCallback((userData: UserInterface | null) => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("user");
    }
  }, []);


  const verifyAuth = useCallback(
    async (signal: AbortSignal) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify`,
          {
            method: "GET",
            credentials: "include",
            signal,
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            persistUser(data.user);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            persistUser(null);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          persistUser(null);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error verificando autenticación:", error);
          setUser(null);
          setIsAuthenticated(false);
          persistUser(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [persistUser]
  );

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error al parsear el usuario almacenado:", e);
        sessionStorage.removeItem("user");
      }
      setLoading(false);
    } else {
      const abortController = new AbortController();
      verifyAuth(abortController.signal);
      return () => {
        abortController.abort();
      };
    }
  }, [verifyAuth]);

  const login = useCallback((userData: UserInterface) => {
    setUser(userData);
    setIsAuthenticated(true);
    persistUser(userData);
  }, [persistUser]);


  const logout = useCallback(async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error durante el logout:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      persistUser(null);
    }
  }, [persistUser]);


  const fetchUserProfile = useCallback(async (user_id: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/profile/${user_id}`,
        { withCredentials: true }
      );
      setUserProfile(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notifications.show({
        title: "Error de autenticación",
        message: `Ocurrió un error al cargar el perfil: ${error}`,
        color: "red",
      });
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      loading,
      profileLoading,
      userProfile,
      fetchUserProfile,
    }),
    [isAuthenticated, user, login, logout, loading, userProfile, fetchUserProfile, profileLoading]
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader color="grape" type="dots" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
