import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { axiosSecure } from "../../../hooks/useAxiosSecure";

const fetchPendingRiders = async () => {
  const res = await axiosSecure.get("/riders/pending");
  return res.data;
};

const PendingRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: fetchPendingRiders,
  });

  const handleStatusUpdate = async (id, newStatus) => {
    let confirmText =
      newStatus === "approved"
        ? "approve"
        : newStatus === "cancelled"
        ? "cancel"
        : newStatus;

    if (newStatus === "cancelled") {
      const cancelConfirm = await Swal.fire({
        title: "Are you sure?",
        text: "This will cancel the rider application permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it!",
      });
      if (!cancelConfirm.isConfirmed) return;
    }

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${confirmText} this application.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/riders/${id}`, { status: newStatus });
      setSelectedRider(null);
      Swal.fire("Success", `Rider ${newStatus}`, "success");
      refetch(); // refresh list
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update rider status", "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

      {isLoading && <p>Loading riders...</p>}
      {isError && <p className="text-error mb-4">{error?.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>District</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No pending riders found.
                  </td>
                </tr>
              )}
              {riders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td className="flex gap-2 justify-center">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setSelectedRider(rider);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusUpdate(rider._id, "approved")}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleStatusUpdate(rider._id, "cancelled")}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedRider && (
        <dialog
          open
          className="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRider(null);
          }}
        >
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg">Rider Information</h3>
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Phone:</strong> {selectedRider.phone}</p>
              <p><strong>Age:</strong> {selectedRider.age}</p>
              <p><strong>NID:</strong> {selectedRider.nid}</p>
              <p><strong>Region:</strong> {selectedRider.region}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>Bike Brand:</strong> {selectedRider.bikeBrand}</p>
              <p><strong>Bike Reg. No:</strong> {selectedRider.bikeNumber}</p>
              <p><strong>Status:</strong> {selectedRider.status}</p>
              {selectedRider.resume && (
                <p>
                  <strong>Resume:</strong>{" "}
                  <a
                    href={selectedRider.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                </p>
              )}
              {selectedRider.description && (
                <p>
                  <strong>Description:</strong> {selectedRider.description}
                </p>
              )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedRider(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
