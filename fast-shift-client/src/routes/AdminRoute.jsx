import React from "react";
import { Navigate } from "react-router"; // Corrected import
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user || role !== "admin") {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default AdminRoute;
