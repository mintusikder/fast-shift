import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SocialLogin from "./SocialLogin";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth(); //  include profile update

  const onSubmit = (data) => {
    console.log("Register Form Data:", data);

    createUser(data.email, data.password)
      .then((result) => {
        console.log("User created:", result.user);

        //  Update user's displayName and photoURL
        return updateUserProfile({
          displayName: data.username,
          photoURL: data.url,
        });
      })
      .then(() => {
        console.log("Profile updated");
        // Navigate to homepage or show success toast here
      })
      .catch((error) => {
        console.error("Registration Error:", error.message);
      });
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-6 rounded-xl bg-white shadow-md text-gray-800">
      <h1 className="text-2xl font-bold text-center">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div className="space-y-1 text-sm">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.username && (
            <p className="text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1 text-sm relative">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
              pattern: {
                value: /[0-9]/,
                message: "Must include at least one number",
              },
            })}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </span>
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Photo URL */}
        <div className="space-y-1 text-sm">
          <label htmlFor="url" className="block text-gray-700">
            Photo URL
          </label>
          <input
            type="url"
            id="url"
            {...register("url")}
            placeholder="Enter your photo URL"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-md transition"
        >
          Register
        </button>
      </form>

      <SocialLogin />

      <p className="text-xs text-center text-gray-500">
        Already have an account?{" "}
        <Link to={"/login"} className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
