import React from 'react';
import { Navbar } from '../Components/navbar';
import CreateEditCampaign from '../pages/editCampaign';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Components/footer';

const Layout = () => {
    return (
        <div>
            <Navbar />
            <main >
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};

export default Layout;
