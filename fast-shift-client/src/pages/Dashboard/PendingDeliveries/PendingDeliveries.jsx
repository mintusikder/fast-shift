import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";
import { axiosSecure } from "../../../hooks/useAxiosSecure";

const PendingDeliveries = () => {
  const queryClient = useQueryClient();
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch assigned parcels for this rider
  const fetchParcels = async () => {
    if (!user) throw new Error("User not logged in");
    const token = await user.getIdToken();
    const { data } = await axiosSecure.get(`/rider/parcels?email=${user.email}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : [];
  };

  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["riderParcels", user?.email],
    enabled: !!user?.email,
    queryFn: fetchParcels,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      if (!user) throw new Error("User not logged in");
      const token = await user.getIdToken();
      const res = await axiosSecure.patch(
        `/parcel/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["riderParcels", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status", "error");
    },
  });

  // Confirm before status update
  const handleUpdate = (id, nextStatus) => {
    let actionText = nextStatus === "intransit" ? "mark as Picked" : "mark as Delivered";
    let confirmText = nextStatus === "intransit" ? "Yes, pick it up!" : "Yes, deliver it!";
    let successText = nextStatus === "intransit" ? "Parcel picked up!" : "Parcel delivered!";

    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${actionText}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: confirmText,
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus.mutate(
          { id, status: nextStatus },
          {
            onSuccess: () => {
              Swal.fire("Success", successText, "success");
            },
          }
        );
      }
    });
  };

  if (!user) return <div className="p-4">Please log in to see your parcels.</div>;
  if (isLoading) return <div className="p-4">Loading parcels...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load parcels.</div>;

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Pending Deliveries</h2>

      {parcels.length === 0 ? (
        <div className="text-center text-gray-500">No pending deliveries found.</div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Assigned Rider</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.tracking_id}</td>
                <td>{parcel.senderName}</td>
                <td>{parcel.receiverName}</td>
                <td>{parcel.receiverContact}</td>
                <td className="capitalize">{parcel.delivery_status}</td>
                <td>{parcel.assigned_rider || "Not Assigned"}</td>
                <td>
                  {parcel.delivery_status === "assigned" && (
                    <button
                      onClick={() => handleUpdate(parcel._id, "intransit")}
                      className="btn btn-sm btn-warning"
                      disabled={updateStatus.isLoading}
                    >
                      Mark as Picked
                    </button>
                  )}
                  {parcel.delivery_status === "intransit" && (
                    <button
                      onClick={() => handleUpdate(parcel._id, "delivered")}
                      className="btn btn-sm btn-success flex items-center gap-1"
                      disabled={updateStatus.isLoading}
                    >
                      Mark as Delivered <FaCheckCircle />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingDeliveries;
