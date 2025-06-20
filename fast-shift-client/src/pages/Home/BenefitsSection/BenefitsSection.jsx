import React from "react";
import safeDelivery from "../../../assets/assets/safe-delivery/safe-delivery.png"
import customerTop from "../../../assets/assets/safe-delivery/customer-top.png"
import liveTracking from "../../../assets/assets/safe-delivery/live-tracking.png"
const benefits = [
  {
    id: 1,
    title: "Fast Delivery",
    description: "We ensure your parcels are delivered quickly without compromising safety.",
    image: safeDelivery
  },
  {
    id: 2,
    title: "Secure Packaging",
    description: "Every shipment is securely packed to prevent any damage during transit.",
    image: customerTop
  },
  {
    id: 3,
    title: "Real-Time Tracking",
    description: "Track your parcels live from pickup to delivery with instant status updates.",
    image: liveTracking
  }
];

const BenefitsSection = () => {
  return (
    <section  data-aos="fade-up"  data-aos-duration="1000"  className="max-w-6xl mx-auto px-4  py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Benefits</h2>
      <div className="space-y-6 ">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="card card-side bg-base-100 shadow-md  py-12 flex-col md:flex-row items-center gap-4">
            <figure className="w-full md:w-1/3">
              <img src={benefit.image} alt={benefit.title} className="w-full h-40 object-contain" />
            </figure>

            <div className="hidden md:block h-24 w-px bg-gray-300"></div>

            <div className="card-body md:w-2/3 p-0 items-center md:items-start">
              <h3 className="card-title text-xl">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
