import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUserPlus } from "react-icons/fa";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Fetch parcels
  const {
    data: parcels = [],
    isLoading: parcelsLoading,
    isError: parcelsError,
  } = useQuery({
    queryKey: ["paidNotCollectedParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/paid-not-collected");
      return res.data;
    },
  });

  // Fetch active riders
  const {
    data: activeRiders = [],
    isLoading: ridersLoading,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
    enabled: !!selectedParcel,
  });

  // Assign rider
  const assignRiderToParcel = async (parcelId, riderEmail) => {
    try {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
        riderEmail,
      });

      if (res.data.modifiedCount || res.data.acknowledged) {
        Swal.fire("Success", "Rider assigned!", "success");
        setSelectedParcel(null);
      } else {
        Swal.fire("Error", "Assignment failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error",error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Paid & Not Collected Parcels</h2>

      {parcelsLoading && <p>Loading parcels...</p>}
      {parcelsError && <p className="text-error">Failed to load parcels.</p>}

      {!parcelsLoading && parcels.length === 0 && (
        <p className="text-center">No parcels found.</p>
      )}

      {!parcelsLoading && parcels.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Sender</th>
                <th>Tracking ID</th>
                <th>Payment</th>
                <th>Delivery</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.title || "N/A"}</td>
                  <td>{parcel.created_by || "N/A"}</td>
                  <td>{parcel.tracking_id || "N/A"}</td>
                  <td><span className="badge badge-success">Paid</span></td>
                  <td><span >Not Collected</span></td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedParcel(parcel)}
                    >
                      <FaUserPlus className="mr-1" /> Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === Modal with Table === */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Assign Rider for Parcel: <span className="text-blue-600">{selectedParcel.tracking_id}</span>
            </h3>

            {ridersLoading ? (
              <p>Loading active riders...</p>
            ) : activeRiders.length === 0 ? (
              <p className="text-center text-gray-500">No active riders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm table-bordered w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Bike Brand</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRiders.map((rider, idx) => (
                      <tr key={rider._id}>
                        <td>{idx + 1}</td>
                        <td>{rider.name}</td>
                        <td>{rider.phone}</td>
                        <td>{rider.bikeBrand}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => assignRiderToParcel(selectedParcel._id, rider.email)}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              onClick={() => setSelectedParcel(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
