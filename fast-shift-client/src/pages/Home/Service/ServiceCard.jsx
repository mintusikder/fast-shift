// src/components/ServiceCard.jsx
import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300 p-5">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl text-primary">
          <Icon />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
