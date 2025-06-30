import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth"; // your custom auth hook
import { axiosSecure } from "./useAxiosSecure"; // your secured axios instance

const getUserRole = async (email) => {
  const res = await axiosSecure.get(`/users/role?email=${email}`);
  return res.data.role;
};

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();

  const {
    data: role,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: () => getUserRole(user.email),
    enabled: !!user?.email && !authLoading,
  });

  return {
    role,
    roleLoading: authLoading || isLoading,
    isError,
    error,
    isAdmin: role === "admin",
    isRider: role === "rider",
    isUser: role === "user",
  };
};

export default useUserRole;
