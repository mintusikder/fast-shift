import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import SocialLogin from "./SocialLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log("Login data:", data);
    // Handle login logic here
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-6 rounded-xl bg-white shadow-md text-gray-800">
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            id="email"
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
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /[0-9]/,
                message: "Password must include at least one number",
              },
            })}
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {/* Toggle button */}
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

          <div className="flex justify-end text-xs mt-1">
            <a href="#" className="text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn w-full bg-primary text-white transition"
        >
          Sign in
        </button>
      </form>

      <SocialLogin></SocialLogin>

      {/* Sign up link */}
      <p className="text-xs text-center text-gray-500">
        Don’t have an account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
