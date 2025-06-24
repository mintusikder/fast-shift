import React, { useState } from "react";
import { Link, NavLink } from "react-router"; // fixed: was "react-router"
import useAuth from "../../../../hooks/useAuth";
import FastShiftLogo from "../FastShiftLogo/FastShiftLogo";

const NavBar = () => {
  const { user, logOutUser } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logOutUser().catch((err) => console.error(err));
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* Logo */}
      <div>
        <FastShiftLogo></FastShiftLogo>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-6">
        <NavLink to="/" className="hover:underline">
          Home
        </NavLink>
        <NavLink to="/about" className="hover:underline">
          About
        </NavLink>
        <NavLink to="/coverage" className="hover:underline">
          Coverage
        </NavLink>
        <NavLink to="/send-parcel" className="hover:underline">
          send-parcel
        </NavLink>
        {user && (
          <>
            <NavLink to="/dashboard" className=" hover:underline">
              Dashboard
            </NavLink>
          </>
        )}

        {user ? (
          <div className="flex items-center gap-4 relative group">
            <img
              src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt="User"
              className="w-9 h-9 rounded-full border cursor-pointer"
            />
            {/* Hover user name */}
            <span className="absolute top-full mt-2 left-0 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-all z-10">
              {user.displayName || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-primary text-white rounded-full  text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2 bg-primary transition text-white rounded-full"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-3 px-5 text-sm md:hidden z-50`}
      >
        <NavLink to="/" className="block w-full hover:underline">
          Home
        </NavLink>
        <NavLink to="/about" className="block w-full hover:underline">
          About
        </NavLink>
        <NavLink to="/send-parcel" className="block w-full hover:underline">
          Send Parcel
        </NavLink>
        <NavLink to="/coverage" className="block w-full hover:underline">
          Coverage
        </NavLink>

        {user ? (
          <div className="flex items-center gap-3 mt-2 relative group w-full">
            <img
              src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt="User"
              className="w-9 h-9 rounded-full border cursor-pointer"
            />
            <span className="text-gray-700 text-sm group-hover:underline">
              {user.displayName || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="ml-auto px-4 py-1 bg-primary  text-white rounded-full text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2 mt-2 bg-primary transition text-white rounded-full text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
