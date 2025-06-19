import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Service/Services';
import ClientLogos from '../ClientLogos/ClientLogos';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Services></Services>
            <ClientLogos></ClientLogos>
        </div>
    );
};

export default Home;