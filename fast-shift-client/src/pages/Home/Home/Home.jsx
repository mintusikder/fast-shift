import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Service/Services';
import ClientLogos from '../ClientLogos/ClientLogos';
import BenefitsSection from '../BenefitsSection/BenefitsSection';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Services></Services>
            <ClientLogos></ClientLogos>
            <BenefitsSection></BenefitsSection>
        </div>
    );
};

export default Home;