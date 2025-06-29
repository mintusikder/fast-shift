import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaTrash } from "react-icons/fa";
import { axiosSecure } from "../../../hooks/useAxiosSecure";

const fetchActiveRiders = async () => {
  const res = await axiosSecure.get("/riders/active");
  return res.data;
};

const ActiveRiders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: riders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: fetchActiveRiders,
  });

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will deactivate the rider.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/riders/${id}`, { status: "deactivated" });
        Swal.fire("Success", "Rider deactivated", "success");
        refetch();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to deactivate rider", "error");
      }
    }
  };

  const filteredRiders = riders.filter((rider) =>
    [rider.name, rider.phone]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-sm"
        />
        <FaSearch className="text-gray-500" />
      </div>

      {isLoading && <p>Loading riders...</p>}
      {isError && <p className="text-error">Failed to load active riders.</p>}

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
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No matching riders found.
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider, index) => (
                  <tr key={rider._id}>
                    <td>{index + 1}</td>
                    <td>{rider.name}</td>
                    <td>{rider.email}</td>
                    <td>{rider.phone}</td>
                    <td>{rider.region}</td>
                    <td>{rider.district}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDeactivate(rider._id)}
                      >
                        <FaTrash className="mr-1" />
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
