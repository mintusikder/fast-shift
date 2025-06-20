import React from "react";
import Banner from "../Banner/Banner";
import Services from "../Service/Services";
import ClientLogos from "../ClientLogos/ClientLogos";
import BenefitsSection from "../BenefitsSection/BenefitsSection";
import MerchantSection from "../MerchantSection/MerchantSection";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Services></Services>
      <ClientLogos></ClientLogos>
      <BenefitsSection></BenefitsSection>
      <MerchantSection></MerchantSection>
    </div>
  );
};

export default Home;
