import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from '@mantine/core';
import { ReactNode } from "react";
import { AuthContext } from "@/context/AuthProvider";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useContext(AuthContext);


  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Loader color="grape" type="dots" className=""/>
  </div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  
  return <>{children}</>;
}
