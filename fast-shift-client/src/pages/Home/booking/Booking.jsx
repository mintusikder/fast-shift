import React from "react";
import bookingIcon from "../../../assets/assets/booking/bookingIcon.png"
const services = [
  {
    id: 1,
    image: bookingIcon,
    title: "Booking Pick & Drop",
    description: "From personal packages to business shipments — we deliver on time, every time."
  },
  {
    id: 2,
    image: bookingIcon,
    title: "Cash On Delivery",
    description: "From personal packages to business shipments — we deliver on time, every time."
  },
  {
    id: 3,
    image: bookingIcon,
    title: "Delivery Hub",
    description: "From personal packages to business shipments — we deliver on time, every time."
  },
  {
    id: 4,
    image:bookingIcon,
    title: "Booking SME & Corporate",
    description: "From personal packages to business shipments — we deliver on time, every time."
  }
];

const Booking = () => {
  return (
    <section data-aos="fade-up"  data-aos-duration="1000" className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-left mb-10">How it Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(service => (
          <div key={service.id} className="card bg-base-100 shadow-md p-4 text-left">
            <figure className="h-12 flex justify-start">
              <img src={service.image} alt={service.title} className="h-full object-contain" />
            </figure>
            <div className="card-body text-left">
              <h3 className="card-title text-lg">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Booking;
