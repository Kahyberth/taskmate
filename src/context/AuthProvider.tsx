import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader } from "@mantine/core";
import { AuthContext, UserInterface } from "./AuthContext";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { UserProfile } from "@/interfaces/profile.interface";
import { apiClient } from "@/api/client-gateway";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);


  const persistUser = useCallback((userData: UserInterface | null) => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("user");
    }
  }, []);

 
  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error: unknown) {
      console.error("Error durante el logout:", error);
      notifications.show({
        title: "Error al cerrar sesión",
        message:
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          "No se pudo cerrar sesión correctamente.",
        color: "red",
      });
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      persistUser(null);
      sessionStorage.setItem("loggedOut", "true"); 
    }
  }, [persistUser]);


  const refreshTokenFn = useCallback(async () => {
    try {
      const response = await apiClient.post("/auth/refresh-token");
      return response.data;
    } catch (error: unknown) {
      console.error("Error al refrescar token:", error);
      notifications.show({
        title: "Error al refrescar la sesión",
        message:
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          "No se pudo refrescar la sesión. Por favor, inicia sesión nuevamente.",
        color: "red",
      });
      await logout();
      return null;
    }
  }, [logout]);


  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const data = await refreshTokenFn();
          if (data) {
            return apiClient(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [refreshTokenFn]);


  const verifyAuth = useCallback(async () => {
    try {
      const response = await apiClient.get("/auth/verify");
      if (response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        persistUser(response.data.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        persistUser(null);
      }
    } catch (error: unknown) {
      console.error("Error verificando autenticación:", error);
      notifications.show({
        title: "Autenticación fallida",
        message:
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          "No se pudo verificar la sesión. Por favor, inicia sesión de nuevo.",
        color: "red",
      });
      setUser(null);
      setIsAuthenticated(false);
      persistUser(null);
    } finally {
      setLoading(false);
    }
  }, [persistUser]);


  useEffect(() => {
    if (sessionStorage.getItem("loggedOut") === "true") {
      setLoading(false);
      return;
    }
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (e) {
        console.error("Error al parsear el usuario almacenado:", e);
        sessionStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      verifyAuth();
    }
  }, [verifyAuth]);


  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const response = await apiClient.post("/auth/login", credentials);
        if (response.data?.data) {
          setUser(response.data.data);
          setIsAuthenticated(true);
          persistUser(response.data.data);
          sessionStorage.removeItem("loggedOut");
          return { success: true };
        } else {
          throw new Error("Datos de usuario no válidos");
        }
      } catch (error: unknown) {
        console.error("Error en el login:", error);
        notifications.show({
          title: "Error de autenticación",
          message:
            (axios.isAxiosError(error) && error.response?.data?.message) ||
            "No se pudo iniciar sesión. Verifica tus credenciales.",
          color: "red",
        });
        const errorMessage = axios.isAxiosError(error) ? error.response?.data || error.message : "Unknown error";
        return { success: false, error: errorMessage };
      }
    },
    [persistUser]
  );

  // Función para obtener el perfil del usuario
  const fetchUserProfile = useCallback(async (user_id: string) => {
    setProfileLoading(true);
    try {
      const response = await apiClient.get(`/auth/profile/${user_id}`);
      setUserProfile(response.data);
    } catch (error: unknown) {
      console.error("Error al cargar el perfil:", error);
      notifications.show({
        title: "Error de autenticación",
        message:
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          `Ocurrió un error al cargar el perfil: ${axios.isAxiosError(error) ? error.message : 'Unknown error'}`,
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
      refreshToken: refreshTokenFn,
    }),
    [
      isAuthenticated,
      user,
      login,
      logout,
      loading,
      userProfile,
      fetchUserProfile,
      profileLoading,
      refreshTokenFn,
    ]
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
