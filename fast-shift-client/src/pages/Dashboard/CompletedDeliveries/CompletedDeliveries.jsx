import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

import moment from "moment"; // Optional for formatting timestamps
import { axiosSecure } from "../../../hooks/useAxiosSecure";

const CompletedDeliveries = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchCompletedParcels = async () => {
    const token = await user.getIdToken();
    const { data } = await axiosSecure.get(`/rider/completed-parcels?email=${user.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };

  const {
    data: completedParcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completedParcels", user?.email],
    enabled: !!user?.email,
    queryFn: fetchCompletedParcels,
  });

  const totalEarning = completedParcels.reduce((sum, parcel) => sum + parcel.earning, 0);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to fetch completed deliveries.</div>;

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Completed Deliveries</h2>

      {completedParcels.length === 0 ? (
        <p className="text-gray-500 text-center">No completed deliveries found.</p>
      ) : (
        <>
          <div className="mb-4 font-medium text-lg text-green-700">
            Total Earnings: <span className="font-bold">${totalEarning.toFixed(2)}</span>
          </div>

          <table className="table w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Cost</th>
                <th>Earning</th>
                <th>Picked At</th>
                <th>Delivered At</th>
              </tr>
            </thead>
            <tbody>
              {completedParcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.senderName}</td>
                  <td>{parcel.receiverName}</td>
                  <td>${parcel.cost}</td>
                  <td className="text-green-600">${parcel.earning}</td>
                  <td>{parcel.picked_at ? moment(parcel.picked_at).format("LLL") : "—"}</td>
                  <td>{parcel.delivered_at ? moment(parcel.delivered_at).format("LLL") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CompletedDeliveries;
