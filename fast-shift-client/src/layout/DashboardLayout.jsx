import React from "react";
import { Outlet, Link } from "react-router"; // use react-router-dom, not react-router
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaMoneyCheckAlt,
  FaSearchLocation,
  FaUserEdit,
  FaPaperPlane,
  FaMotorcycle,
  FaHourglassHalf,
} from "react-icons/fa";
import FastShiftLogo from "../pages/Home/Shared/FastShiftLogo/FastShiftLogo";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const { role,roleLoading } = useUserRole();
  console.log(role);
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="w-full navbar bg-base-300 lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 text-xl font-semibold">Dashboard</div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content space-y-2">
          <FastShiftLogo />

          {/* Dashboard Links */}
          <li>
            <Link to="/dashboard">
              <FaTachometerAlt className="mr-2" /> Dashboard Home
            </Link>
          </li>
          <li>
            <Link to="my-parcels">
              <FaBoxOpen className="mr-2" /> My Parcels
            </Link>
          </li>
          <li>
            <Link to="payment-history">
              <FaMoneyCheckAlt className="mr-2" /> Payment History
            </Link>
          </li>
          <li>
            <Link to="track">
              <FaSearchLocation className="mr-2" /> Track a Package
            </Link>
          </li>
          <li>
            <Link to="profile">
              <FaUserEdit className="mr-2" /> Update Profile
            </Link>
          </li>
          <li>
            <Link to="send-parcel">
              <FaPaperPlane className="mr-2" /> Send Parcel
            </Link>
          </li>
     {!roleLoading && role === "admin" && 
      <>
           <li>
            <Link to="make-admin">
              <FaPaperPlane className="mr-2" /> Make Admin
            </Link>
          </li>

          <li>
            <Link to="active-riders">
              <FaMotorcycle className="mr-2" /> Active Riders
            </Link>
          </li>
          <li>
            <Link to="pending-riders">
              <FaHourglassHalf className="mr-2" /> Pending Riders
            </Link>
          </li>
      </>
     }
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
