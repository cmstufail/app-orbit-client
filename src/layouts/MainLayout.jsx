import React from 'react'
import Navbar from './../components/common/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/common/Footer/Footer';

const MainLayout = () => {
    return (
        <div>

            <Navbar />
            <Outlet />
            <Footer />

        </div>
    )
}

export default MainLayout
