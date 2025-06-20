import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div  data-aos="fade-up"  data-aos-duration="1000" className="card bg-base-100 shadow-md  hover:bg-[#caeb66] hover:shadow-xl transition duration-300 p-5 text-center flex flex-col items-center">
      <div className="flex  flex-col items-center gap-4 mb-4">
        <div className="text-4xl text-secondary ">
          <Icon />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
