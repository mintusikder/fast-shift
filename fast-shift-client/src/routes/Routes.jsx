import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/AUthentication/Login";
import Register from "../pages/AUthentication/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoutes from "./PrivateRoutes";
import SendParcel from "../pages/sendParcel/SendParcel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/coverage",
        Component: Coverage,
        loader: () => fetch(`/districts.json`),
      },
      {
        path: "/send-parcel",
        loader: () => fetch(`/districts.json`),
        element: (
          <PrivateRoutes>
            <SendParcel></SendParcel>
            
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: Login,
      },

      {
        path: "/register",
        Component: Register,
      },
    ],
  },
]);
