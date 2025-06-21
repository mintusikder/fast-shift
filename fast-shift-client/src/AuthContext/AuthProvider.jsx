import React, { useEffect, useState } from "react";
import { AuthContest } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

//  Google provider
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login user
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout user
  const logOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update user profile
  const updateUserProfile = (profile) => {
    setLoading(true);
    return updateProfile(auth.currentUser, profile);
  };

  // Google login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  // Password reset
  const resetUser = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // Monitor auth state
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("user", currentUser);
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    loginUser,
    logOutUser,
    updateUserProfile,
    googleLogin,
    resetUser,
  };

  //  Provide context
  return (
    <AuthContest.Provider value={authInfo}>{children}</AuthContest.Provider>
  );
};

export default AuthProvider;
