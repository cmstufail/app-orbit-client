import React from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Sidebar from './../components/Dashboard/Sidebar';
import Navbar from '../components/Shared/Navbar';

const DashboardLayout = () => {
    const { loading } = useAuth();

    if ( loading ) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-grow flex-col lg:flex-row">
                <div className="lg:w-64 bg-base-300 p-4 shadow-lg">
                    <Sidebar />
                </div>
                <div className="flex-1 p-4 lg:p-8 bg-base-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;