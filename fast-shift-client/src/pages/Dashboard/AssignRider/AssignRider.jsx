import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUserPlus } from "react-icons/fa";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["unpaidNotCollectedParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/unpaid-not-collected");
      return res.data;
    },
  });

  const handleAssign = (parcelId) => {
    Swal.fire({
      title: "Assign Rider?",
      text: `Assign a rider for parcel ID: ${parcelId}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Assign",
    }).then((result) => {
      if (result.isConfirmed) {
        // Your rider assignment logic here
        Swal.fire("Assigned!", "Rider assigned successfully.", "success");
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Unpaid & Not Collected Parcels</h2>

      {isLoading && <p>Loading parcels...</p>}
      {isError && <p className="text-error">Failed to load parcels.</p>}

      {!isLoading && parcels.length === 0 && (
        <p className="text-center">No parcels found.</p>
      )}

      {!isLoading && parcels.length > 0 && (
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
                  <td>
                    <span className="badge badge-error">Unpaid</span>
                  </td>
                  <td>
                    <span>Not Collected</span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-primary text-black"
                      onClick={() => handleAssign(parcel._id)}
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
    </div>
  );
};

export default AssignRider;
