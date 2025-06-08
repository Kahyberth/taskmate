import { useState, useEffect, ReactNode, useCallback, useMemo } from "react";

import { AuthContext, UserInterface } from "./AuthContext";
import {
  loginRequest,
  logoutRequest,
  verifyToken,
  fetchProfile,
  registerRequest,
  updateProfile as updateProfileService,
} from "@/service/authService";
import { notifications } from "@mantine/notifications";
import { UserProfile } from "@/interfaces/profile.interface";
import { Loader } from "@mantine/core";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const verifyUser = async () => {
    try {
      const res = await verifyToken();
      if (!res) {
        setUser(null);
        return;
      }
      setUser(res.user);
      setIsAuthenticated(true);
      await fetchUserProfile(res.user.id);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await loginRequest(credentials);
      const { data: user } = res;

      notifications.show({
        title: "Welcome back!",
        message: `Hello ${user.name} 🌟`,
        color: "green",
        autoClose: 2000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      notifications.show({
        title: "Login failed",
        message: error.response.data.message,
        color: "red",
        autoClose: 2000,
      });
      return { success: false, error: error.response.data.message };
    }
  };

  const register = async (credentials: any) => {
    const id = notifications.show({
      loading: true,
      title: "Creating your account...",
      message: "Please wait while we create your account.",
      color: "green",
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const res = await registerRequest(credentials).finally(() => {
        notifications.update({
          id,
          title: "Account created!",
          message: "Your account has been created successfully.",
          color: "green",
          autoClose: 2000,
          withCloseButton: true,
        });
      });

      const { data: user } = res;

      return { success: true, user };
    } catch (error: any) {
      console.error("Registration error:", error);
      notifications.update({
        id,
        title: "Registration failed",
        message: error.response.data.message,
        color: "red",
        autoClose: 2000,
        withCloseButton: true,
      });
      return { success: false, error: error.response.data.message };
    }
  };

  const fetchUserProfile = useCallback(async (user_id: string) => {
    try {
      setProfileLoading(true);
      const response = await fetchProfile(user_id);
      if (response.error) {
        setUserProfile(null);
        return;
      }
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const updateProfile = async (profileData: any) => {
    try {
      const response = await updateProfileService(profileData);
      if (response.error) {
        return { success: false, error: "Failed to update profile" };
      }
      await fetchUserProfile(user?.id || "");
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: "An error occurred while updating profile" };
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      logout,
      login,
      register,
      fetchUserProfile,
      updateProfile,
      userProfile,
      profileLoading,
      isAuthenticated,
    }),
    [
      user,
      loading,
      logout,
      login,
      register,
      fetchUserProfile,
      userProfile,
      profileLoading,
      isAuthenticated,
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
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
