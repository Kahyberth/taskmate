import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { ReactNode } from "react";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
