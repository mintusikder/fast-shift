import React from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-6 rounded-xl bg-white shadow-md text-gray-800">
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div className="space-y-1 text-sm">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            type="text"
            {...register("email")}
            id="username"
            name="username"
            placeholder="Enter your username"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Password */}
        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            {...register("password", { required: true, minLength: 6 , pattern: /[0-9]/i})}
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex justify-end text-xs mt-1">
            <a href="#" className="text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn w-full bg-primary text-white  transition"
        >
          Sign in
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center pt-4 space-x-2">
        <div className="flex-1 h-px bg-gray-300"></div>
        <p className="text-sm text-gray-500">Or login with</p>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Social Buttons */}
      <div className="flex justify-center space-x-4">
        {/* Google */}
        <button
          aria-label="Login with Google"
          className="p-3 border rounded-md hover:bg-gray-100"
        >
          <svg
            className="w-full text-primary h-5 fill-current"
            viewBox="0 0 32 32"
          >
            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
          </svg>
        </button>
      </div>

      {/* Signup link */}
      <p className="text-xs text-center text-gray-500">
        Don't have an account?{" "}
        <a href="#" className="text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default Login;
