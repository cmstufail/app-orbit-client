import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import Sidebar from './../components/Dashboard/Sidebar';
import Navbar from '../components/Shared/Navbar';
import Spinner from '../components/Shared/Spinner';
import Container from '../components/Container';


const DashboardLayout = () => {
    // Set the page title when the component mounts
    useEffect( () => {
        document.title = 'Dashboard || AppOrbit';
    }, [] );

    const { loading } = useAuth();

    if ( loading ) {
        return (
            <div className="text-center py-20 text-ui-text-primary dark:text-ui-text-dark flex flex-col items-center justify-center">
                <Spinner className="mb-2" />
                <p>Loading information... Please wait.</p>
            </div>
        );
    }

    return (
        <Container>
            <div className="flex flex-col min-h-screen mt-12 lg:pl-12">
                <Navbar />
                <div className="flex flex-grow flex-col lg:flex-row">
                    <div className="lg:w-64 bg-base-300 p-1 shadow-lg">
                        <Sidebar />
                    </div>
                    <div className="flex-1 py-4 lg:p-8 bg-base-100">
                        <Outlet />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default DashboardLayout;