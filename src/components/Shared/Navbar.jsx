import { Link, NavLink } from 'react-router-dom';
import { VscSignOut, VscDashboard } from "react-icons/vsc";
import useAuth from '../../hooks/useAuth';
import AppOrbitLogo from './AppOrbitLogo';
import { FaSignInAlt, FaUserPlus, FaSun, FaMoon, FaBars } from 'react-icons/fa';
import ThemeToggler from './ThemeToggler';
import toast from 'react-hot-toast';
import Container from '../Container';
import AboutUs from './../AboutUs';

const Navbar = () => {
    const { user, logout, loading: authLoading } = useAuth();

    const navLinks = (
        <>
            <li> 
                <NavLink to="/" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/products" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                    Products
                </NavLink>
            </li>
            <li>
                <NavLink to="/about" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                    About Us
                </NavLink>
            </li>
            { user && (
                <>
                    <li>
                        <NavLink to="/dashboard/add-product" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            Add Product
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            Dashboard
                        </NavLink>
                    </li>
                </>
            ) }
        </>
    );


    const handleLogout = async () => {
        try {
            await logout();
            toast.success( 'You have successfully logged out!' );
        } catch ( error ) {
            console.error( "Logout failed.", error );
            toast.error( 'Logout failed. Please try again.' );
        }
    };

    const defaultAvatar = "https://i.ibb.co/r7b6M7t/user-default.png";

    return (
        <nav className="bg-base-200 fixed top-0 left-0 right-0 z-50">
            <Container>
                <div className="w-full max-w-7xl mx-auto px-2 md:px-5 lg:px-0 shadow-md dark:shadow-lg flex justify-between items-center">
                    <div className="navbar-start">
                        <div className="dropdown md:hidden">
                            <label tabIndex={ 0 } className="btn btn-ghost">
                                <FaBars className="h-5 w-5 text-primary-nav-link dark:text-primary-nav-link-dark" />
                            </label>
                            <ul tabIndex={ 0 } className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 bg-light-dropdown-bg dark:bg-dark-dropdown-bg text-primary-nav-link dark:text-primary-nav-link-dark">
                                { navLinks }
                                { !user && !authLoading && (
                                    <>
                                        <li>
                                            <Link to="/login" className="flex items-center">
                                                <FaSignInAlt className="mr-2" /> Login
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/register" className="flex items-center">
                                                <FaUserPlus className="mr-2" /> Register
                                            </Link>
                                        </li>
                                    </>
                                ) }

                                { user && (
                                    <li>
                                        <button onClick={ handleLogout } className="text-error-light dark:text-error-dark flex items-center">
                                            <VscSignOut className="mr-2" />
                                            Logout
                                        </button>
                                    </li>
                                ) }
                            </ul>
                        </div>

                        {/* Website Logo/Name */ }
                        <Link to="/" className="hidden md:block text-2xl font-bold text-primary p-0">
                            <AppOrbitLogo />
                        </Link>
                    </div>

                    {/* Navbar Center Section (Desktop Menu) */ }
                    <div className="navbar-center hidden md:flex">
                        <ul className="menu menu-horizontal px-1 text-lg">
                            { navLinks }
                            {/* Desktop Dashboard */ }
                        </ul>
                    </div>


                    {/* Navbar End Section (Auth Buttons / User Profile/ Theme Toggler) */ }
                    <div className="navbar-end flex items-center">
                        <ThemeToggler />

                        { user && !authLoading && (
                            <div className="dropdown dropdown-end ml-2">
                                <label tabIndex={ 0 } className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full text-primary-nav-link dark:text-primary-nav-link-dark" title={ user.displayName || user.email }>
                                        <img
                                            alt="User profile photo"
                                            src={ user.photoURL || defaultAvatar }
                                        />
                                    </div>
                                </label>

                                <ul tabIndex={ 0 } className="menu menu-sm dropdown-content z-[50] shadow rounded-box w-52 bg-light-dropdown-bg dark:bg-dark-dropdown-bg text-primary-nav-link dark:text-primary-nav-link-dark">
                                    <li className="pt-1 font-medium text-primary-nav-link dark:text-primary-nav-link-dark">{ user.displayName || user.email }</li>
                                    <li className="mt-0 pt-0">
                                        <div className='divider my-0 bg-light-divider dark:bg-dark-divider'></div>
                                    </li>
                                    <li>
                                        <Link to="/dashboard" className="text-primary-nav-link dark:text-primary-nav-link-dark">
                                            <VscDashboard />
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={ handleLogout } className="text-error-light dark:text-error-dark">
                                            <VscSignOut />
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) }

                        { !user && !authLoading && (
                            <div className="hidden lg:flex gap-2 ml-2">
                                <Link to="/login" className="btn-custom-outline-primary rounded-full px-4 py-2 flex items-center group overflow-hidden relative">
                                    <span className="font-semibold relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Login</span>
                                    <FaSignInAlt className="text-xl relative z-10 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
                                    <span className="absolute inset-0 bg-primary-hover-overlay opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></span>
                                </Link>

                                <Link to="/register" className="btn-custom-outline-secondary rounded-full px-2 py-2 flex items-center group overflow-hidden relative">
                                    <FaUserPlus className="text-xl relative z-10 transition-transform duration-300 group-hover:-translate-x-1 mr-2" />
                                    <span className="font-semibold relative z-10 transition-transform duration-300 group-hover:translate-x-1">Register</span>
                                    <span className="absolute inset-0 bg-secondary-hover-overlay opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></span>
                                </Link>
                            </div>
                        ) }
                    </div>
                </div>
            </Container>
        </nav>
    );
};

export default Navbar;