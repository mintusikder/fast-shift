import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router"; //  import useNavigate
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate(); //  initialize navigator
  const [processing, setProcessing] = useState(false);

  // Fetch parcel data
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/parcels/${parcelId}`
      );
      return res.data;
    },
  });

  if (isPending) return <p>Loading...</p>;

  const amount = parcelInfo.cost;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        { amount }
      );

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        console.error("Payment failed:", result.error.message);
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        const paymentInfo = {
          parcelId,
          email: user.email,
          transactionId: result.paymentIntent.id,
          amount,
          paymentMethod: result.paymentIntent.payment_method_types[0],
          paymentTime: new Date(),
        };
        await axios.post(
          `${import.meta.env.VITE_API_URL}/payments`,
          paymentInfo
        );

        //  Redirect after successful payment
        navigate("/dashboard/my-parcels");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Something went wrong while processing payment.");
    } finally {
      setProcessing(false);
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
        disabled={!stripe || processing}
        className={`btn btn-primary w-full mt-4 ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default PaymentForm;
