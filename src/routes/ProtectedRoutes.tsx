import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth?.email) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
