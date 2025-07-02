import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const RiderRoute = ({children}) => {
const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user || role !== "rider") {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RiderRoute;