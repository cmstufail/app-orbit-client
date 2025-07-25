import { Link, NavLink } from 'react-router-dom';
import { VscSignOut, VscDashboard } from "react-icons/vsc";
import useAuth from '../../hooks/useAuth';
import AppOrbitLogo from './AppOrbitLogo';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, loading: authLoading } = useAuth();

    const navLinks = (
        <>
            <li><NavLink to="/" className={ ( { isActive } ) => isActive ? 'font-bold text-primary' : '' }>Home</NavLink></li>
            <li><NavLink to="/products" className={ ( { isActive } ) => isActive ? 'font-bold text-primary' : '' }>Products</NavLink></li>
        </>
    );

    // Handler for user logout
    const handleLogout = async () => {
        try {
            await logout();
        } catch ( error ) {
            console.error( "Logout error:", error );
        }
    };

    const defaultAvatar = "https://i.ibb.co/r7b6M7t/user-default.png";

    return (
        <div className="avbar bg-base-100 shadow-md container px-4 mx-auto fixed top-0 left-0 right-0 z-50 flex rounded-lg">
            {/* Navbar Start Section (Logo and Mobile Menu) */ }
            <div className="navbar-start">
                {/* Mobile Dropdown Menu */ }
                <div className="dropdown">
                    <label tabIndex={ 0 } className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={ 0 } className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        { navLinks }
                        {/* Mobile Dashboard Link*/ }
                        { user && <li><NavLink to="/dashboard/my-profile" className={ ( { isActive } ) => isActive ? 'font-bold text-primary' : '' }>Dashboard</NavLink></li> }
                    </ul>
                </div>
                {/* Website Logo/Name */ }
                <Link to="/" className="hidden md:block btn btn-ghost text-2xl font-bold text-primary">
                    <AppOrbitLogo />
                </Link>
            </div>

            {/* Navbar Center Section (Desktop Menu) */ }
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    { navLinks }
                    {/* Desktop Dashboard */ }
                </ul>
            </div>

            {/* Navbar End Section (Auth Buttons / User Profile) */ }
            <div className="navbar-end">
                {/* Show spinner if authentication status is loading */ }
                { authLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    // If user is logged in, show profile picture and dropdown
                    user ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={ 0 } className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full text-base-content" title={ user.displayName || user.email }>
                                    <img
                                        alt="User profile photo"
                                        src={ user.photoURL || defaultAvatar }
                                    />
                                </div>
                            </label>
                            <div>
                                <ul tabIndex={ 0 } className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52">
                                    {/* User Name (Not clickable) */ }
                                    <li className="p-2 font-medium text-base-content">{ user.displayName || user.email }</li>
                                    <li className="mt-0 pt-0">
                                        <div className='divider my-0'></div>
                                    </li>
                                    {/* Dashboard Link - ONLY HERE IN DROPDOWN */ }
                                    <li>
                                        <Link to="/dashboard">
                                            <VscDashboard />
                                            Dashboard
                                        </Link>
                                    </li>
                                    {/* Logout Button */ }
                                    <li>
                                        <button onClick={ handleLogout } className="text-error">
                                            <VscSignOut />
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2 ml-2">
                            <Link to="/login" className="btn btn-outline btn-primary rounded-full px-4 py-2 flex items-center group overflow-hidden relative">
                                <span className="font-semibold relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Login</span>
                                <FaSignInAlt className="text-xl relative z-10 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
                                <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></span>
                            </Link>

                            <Link to="/register" className="btn btn-outline btn-secondary rounded-full px-4 py-2 flex items-center group overflow-hidden relative">
                                <FaUserPlus className="text-xl relative z-10 transition-transform duration-300 group-hover:-translate-x-1 mr-2" />
                                <span className="font-semibold relative z-10 transition-transform duration-300 group-hover:translate-x-1">Register</span>
                                <span className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></span>
                            </Link>
                        </div>
                    )
                ) }
            </div>
        </div>
    );
};

export default Navbar;