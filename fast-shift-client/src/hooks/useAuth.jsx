import React, { use } from "react";
import { AuthContest } from "../context/AuthContext/AuthContext";

export const useAuth = () => {
  const authInfo = use(AuthContest);
  return authInfo;
};

export default useAuth;
