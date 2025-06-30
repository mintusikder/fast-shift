import axios from "axios";
import useAuth from "./useAuth";

export const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxiosSecure = () => {
  const { user, logOutUser } = useAuth();

  // REQUEST interceptor
  axiosSecure.interceptors.request.use(
    (config) => {
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // RESPONSE interceptor
  axiosSecure.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      if (status === 403) {
        window.location.href = "/forbidden"; // Redirect to forbidden page
      } else if (status === 401) {
        logOutUser().then(() => {
          window.location.href = "/login"; // Redirect to login
        });
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
