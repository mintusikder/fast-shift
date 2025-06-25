import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router"; // make sure this is from 'react-router-dom'

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoutes;
