import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';

import Navbar from './../components/Shared/Navbar';
import Footer from './../components/Shared/Footer';


const MainLayout = () => {

    const location = useLocation();

    useEffect( () => {
        window.scrollTo( 0, 0 );
    }, [ location.pathname ] );

    const navbarHeightClass = 'pt-20 md:pt-24';

    return (
        <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
            <Navbar />
            <div className={ `flex-grow ${ navbarHeightClass }` }>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout
