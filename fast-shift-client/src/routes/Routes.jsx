import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Register from "../pages/AUthentication/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoutes from "./PrivateRoutes";
import SendParcel from "../pages/sendParcel/SendParcel";
import DashboardLayout from "../layout/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Login from "../pages/Authentication/Login";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import ActiveRider from "../pages/Dashboard/BeARider/ActiveRider";
import PendingRider from "../pages/Dashboard/BeARider/PendingRider";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../pages/Dashboard/Forbidden/Forbidden";
import AdminRoute from "./AdminRoute";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import PendingDeliveries from "../pages/Dashboard/PendingDeliveries/PendingDeliveries";
import RiderRoute from "./RiderRoute";

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
        path: "/forbidden",
        Component: Forbidden,
      },
      {
        path: "/rider",
        loader: () => fetch(`/districts.json`),
        element: (
          <PrivateRoutes>
            <BeARider></BeARider>
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
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: "my-parcels",
        Component: MyParcels,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },

      {
        path: "send-parcel",
        loader: () => fetch(`/districts.json`),
        element: (
          <PrivateRoutes>
            <SendParcel></SendParcel>
          </PrivateRoutes>
        ),
      },
      //rider route
      {
        path: "pending-deliveries",
        element: (
          <RiderRoute>
            <PendingDeliveries></PendingDeliveries>
          </RiderRoute>
        ),
      },
      // admin route
      {
        path: "assign-rider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
      {
        path: "active-riders",
        element: (
          <AdminRoute>
            <ActiveRider></ActiveRider>
          </AdminRoute>
        ),
      },
      {
        path: "pending-riders",
        element: (
          <AdminRoute>
            <PendingRider></PendingRider>
          </AdminRoute>
        ),
      },
      {
        path: "make-admin",
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>
          </AdminRoute>
        ),
      },
    ],
  },
]);
