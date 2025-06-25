import React from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
// import { useNavigate } from "react-router";

const SocialLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const from = location.state?.from || "/";
  const handleGoogleSignIn = () => {
    googleLogin()
      .then((result) => {
        console.log("Google Login Success:", result.user);
        navigate(from);
      })
      .catch((error) => {
        console.error("Google Login Error:", error.message);
      });
  };

  return (
    <div>
      {/* Divider */}
      <div className="flex items-center pt-4 mb-4 space-x-2">
        <div className="flex-1 h-px bg-gray-300"></div>
        <p className="text-sm text-gray-500">Or login with</p>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Social Login */}
      <div className="flex justify-center">
        <button
          onClick={handleGoogleSignIn}
          aria-label="Login with Google"
          className="p-2 px-4 flex items-center gap-2 border border-gray-300 w-full justify-center rounded-md hover:bg-gray-100 transition duration-200"
        >
          <svg
            className="w-5 h-5 text-primary"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
          </svg>
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
