import React from "react";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router";

const ParcelTable = ({ parcels, onView, onDelete,onPay }) => {
  return (
    <div className="overflow-x-auto shadow  rounded-lg">
      <table className="table w-full">
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td>{parcel.title}</td>
              <td className="capitalize">{parcel.type}</td>
              <td>৳{parcel.cost}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-medium ${
                    parcel.payment_status === "paid"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {parcel.payment_status}
                </span>
              </td>
              <td className="capitalize">{parcel.delivery_status}</td>
              <td className="space-x-2">
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={() => onView(parcel)}
                >
                  <FaEye />
                </button>
                <button
                  className="btn btn-sm btn-error text-white"
                  onClick={() => onDelete(parcel._id)}
                >
                  <FaTrashAlt />
                </button>
                <button
                  className="btn btn-sm btn-success text-white"
                  onClick={() => onPay(parcel._id)}
                >
                  Pay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParcelTable;
