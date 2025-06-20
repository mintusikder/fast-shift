import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log("Register Form Data:", data);
    // handle user registration here (e.g., Firebase or API)
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

        {/* Password with toggle */}
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
          <label htmlFor="photoURL" className="block text-gray-700">
            Photo URL
          </label>
          <input
            type="text"
            id="photoURL"
            {...register("photoURL")}
            placeholder="Enter your photo URL"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="btn w-full bg-primary text-white hover:bg-primary/90 transition"
        >
          Register
        </button>
      </form>
      {/* Divider */}
      <div className="flex items-center pt-4 space-x-2">
        <div className="flex-1 h-px bg-gray-300"></div>
        <p className="text-sm text-gray-500">Or login with</p>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      {/* Social Login */}
      <div className="flex justify-center space-x-4">
        <button
          aria-label="Login with Google"
          className="p-3 border w-full rounded-md hover:bg-gray-100"
        >
          <svg
            className="w-full text-primary h-5 fill-current"
            viewBox="0 0 32 32"
          >
            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
          </svg>
        </button>
      </div>
      <p className="text-xs text-center text-gray-500">
        Already have an account?{" "}
        <Link to={"/login"} className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
