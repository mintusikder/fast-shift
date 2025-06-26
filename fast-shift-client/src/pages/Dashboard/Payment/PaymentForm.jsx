import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/parcels/${parcelId}`
      );
      return res.data;
    },
  });
  if (isPending) {
    return <p>Loading....</p>;
  }

  console.log(parcelInfo);
  const amount = parcelInfo.cost
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.error("Stripe Error:", error.message);
      toast.error(error.message);
    } else {
      console.log("Payment Method:", paymentMethod);
      toast.success("Payment method created successfully.");
      // TODO: Send paymentMethod.id to backend
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md"
    >
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="btn btn-primary w-full mt-4"
      >
        Pay ${amount}
      </button>
    </form>
  );
};

export default PaymentForm;
