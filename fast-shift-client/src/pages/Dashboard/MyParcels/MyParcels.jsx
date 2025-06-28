import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

import Swal from "sweetalert2";
import ParcelTable from "../ParcelTable/ParcelTable";
import { useNavigate } from "react-router";
import { axiosSecure } from "../../../hooks/useAxiosSecure";

const MyParcels = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: parcels = [],
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["my_parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const onPay = (parcelId) => {
    navigate(`/dashboard/payment/${parcelId}`);
  };

  const handleView = (parcel) => {
    Swal.fire({
      title: parcel.title,
      html: `
        <p><strong>Type:</strong> ${parcel.type}</p>
        <p><strong>Cost:</strong> ৳${parcel.cost}</p>
        <p><strong>Status:</strong> ${parcel.delivery_status}</p>
        <p><strong>Tracking ID:</strong> ${parcel.tracking_id}</p>
      `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${id}`);

        if (res.data.deletedCount === 1) {
          Swal.fire("Deleted!", "Parcel deleted successfully.", "success");
          refetch();
        } else {
          Swal.fire("Not Found!", "Parcel not found in database.", "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Something went wrong during deletion.", "error");
      }
    }
  };

  if (isPending) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Parcels</h2>
      <ParcelTable
        parcels={parcels}
        onPay={onPay}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MyParcels;
