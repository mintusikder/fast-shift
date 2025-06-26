import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

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
    } else {
      console.log("Payment Method:", paymentMethod);
      // TODO: Send paymentMethod.id to backend
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md">
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="btn btn-primary w-full mt-4"
      >
        Pay for Parcel Pickup
      </button>
    </form>
  );
};

export default PaymentForm;
