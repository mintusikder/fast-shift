import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router"; // fixed router import
import useAuth from "../../hooks/useAuth";
import SocialLogin from "./SocialLogin";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const { createUser, updateUserProfile } = useAuth();

const onSubmit = async (data) => {
  try {
    const imageFile = data.photo[0];
    const formData = new FormData();
    formData.append("image", imageFile); //  Key must be 'image'

    // Use your VITE environment variable or fallback for testing
    const apiKey = import.meta.env.VITE_IMAGE_UPLOAD_KEY;

    const uploadRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    //  Correct way to get the image URL
    const photoURL = uploadRes.data.data.url;

    // Create user
    const result = await createUser(data.email, data.password);

    // Update user profile
    await updateUserProfile({
      displayName: data.username,
      photoURL,
    });

    console.log("User created:", result.user);
    navigate(from);
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
  }
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
          {errors.username && <p className="text-red-600">{errors.username.message}</p>}
        </div>

        {/* Profile Photo Upload */}
        <div className="space-y-1 text-sm">
          <label htmlFor="photo" className="block text-gray-700">
            Profile Photo
          </label>
          <input
            type="file"
            accept="image/*"
            id="photo"
            {...register("photo", { required: "Profile photo is required" })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.photo && <p className="text-red-600">{errors.photo.message}</p>}
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
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
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
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </span>
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
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
