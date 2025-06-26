import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm"; // adjust path as needed

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

const Payment = () => {
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Parcel Payment</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default Payment;
