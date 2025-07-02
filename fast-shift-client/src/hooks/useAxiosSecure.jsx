import axios from "axios";
import { getAuth } from "firebase/auth";
import useAuth from "./useAuth";

export const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, logOutUser } = useAuth();

  // REQUEST interceptor
  axiosSecure.interceptors.request.use(
    async (config) => {
      if (user) {
        try {
          const token = await getAuth().currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (err) {
          console.error("Failed to get Firebase token", err);
        }
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
        window.location.href = "/forbidden";
      } else if (status === 401) {
        logOutUser().then(() => {
          window.location.href = "/login";
        });
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
