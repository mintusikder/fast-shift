import React from "react";
import merchantImage from "../../../assets/assets/Merchant/location-merchant.png";
import bgImage from "../../../assets/assets/Merchant/be-a-merchant-bg.png";

const MerchantSection = () => {
  return (
    <div className="py-12 p-4">
      <section
        className="bg-[#09383b] bg-cover bg-center rounded-2xl "
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10">
          {/* Left Side Content */}
          <div className="md:w-1/2 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Merchant and Customer Satisfaction is Our First Priority
            </h2>
            <p className="mb-6 text-lg leading-relaxed">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>
            <button className="btn btn-outline text-[#caeb66] hover:text-black hover:bg-[#caeb66] mr-3 rounded-3xl">
              {" "}
              Become a Merchant{" "}
            </button>
            <button className="btn btn-outline text-[#caeb66] hover:text-black hover:bg-[#caeb66] rounded-3xl">
              Earn with Profast Courier{" "}
            </button>
          </div>

          {/* Right Side Image */}
          <div className="md:w-1/2">
            <img
              src={merchantImage}
              alt="Merchant"
              className="w-full h-auto max-h-[400px] object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MerchantSection;
