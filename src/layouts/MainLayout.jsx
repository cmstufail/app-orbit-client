import { Outlet } from 'react-router';
import Navbar from './../components/Shared/Navbar';
import Footer from './../components/Shared/Footer';

const MainLayout = () => {

    const navbarHeightClass = 'pt-20';

    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />
            <div className={ `flex-grow ${ navbarHeightClass }` }>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout
