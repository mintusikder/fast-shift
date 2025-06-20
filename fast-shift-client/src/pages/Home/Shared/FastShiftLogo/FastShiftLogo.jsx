import React from "react";
import logo from "../../../../assets/assets/logo/logo.png";
import { Link } from "react-router";
const FastShiftLogo = () => {
  return (
    <Link to={"/"} className="flex items-end">
      <img  src={logo} alt="" />
      <p className="text-3xl font-bold mt-2 -ml-2">FastShift</p>
    </Link>
  );
};

export default FastShiftLogo;
