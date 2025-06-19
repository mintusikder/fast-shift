import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../pages/Home/Shared/NavBar/NavBAr';
import Footer from '../pages/Home/Shared/Footer/Footer';


const MainLayout = () => {
    return (
        <div>
            <NavBar></NavBar>
     
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;