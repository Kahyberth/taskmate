import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader } from "@mantine/core";
import { AuthContext, UserInterface } from "./AuthContext";
import { notifications } from "@mantine/notifications";



interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
          notifications.show({
            title: "Error de autenticación",
            message: "Ocurrió un error al verificar la autenticación.",
            color: "red",
          })
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
        notifications.show({
          title: "Error de autenticación",
          message: `Ocurrió un error al cargar la sesión: ${e}`,
          color: "red",
        });
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
      notifications.show({
        title: "Error de autenticación",
        message: `Ocurrió un error al cerrar la sesión: ${error}`,
        color: "red",
      });
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      persistUser(null);
    }
  }, [persistUser]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      loading,
    }),
    [isAuthenticated, user, login, logout, loading]
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
