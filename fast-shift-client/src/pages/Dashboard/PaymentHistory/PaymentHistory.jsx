import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../../hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["payment", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?email=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="p-4">Loading payment history...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load payment history.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Payment History</h2>
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full ">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Parcel ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Payment Time</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment.transactionId || index}>
                  <td>{index + 1}</td>
                  <td>{payment.parcelId}</td>
                  <td>{payment.transactionId}</td>
                  <td>৳ {payment.amount}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{new Date(payment.paymentTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
