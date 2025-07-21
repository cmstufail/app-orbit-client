import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { VscAccount, VscSignOut, VscDashboard } from "react-icons/vsc";
import useAuth from '../../hooks/useAuth';
import AppOrbitLogo from './AppOrbitLogo';

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
            alert( 'Logged out successfully!' );
        } catch ( error ) {
            console.error( "Logout error:", error );
            alert( 'Logout failed!' );
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-sm container px-4 mx-auto">
            {/* Navbar Start Section (Logo and Mobile Menu) */ }
            <div className="navbar-start">
                {/* Mobile Dropdown Menu */ }
                <div className="dropdown">
                    <label tabIndex={ 0 } className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={ 0 } className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        { navLinks }
                        {/* Mobile Dashboard Link: Add here as it's a common pattern for mobile menus */ }
                        { user && <li><NavLink to="/dashboard/my-profile" className={ ( { isActive } ) => isActive ? 'font-bold text-primary' : '' }>Dashboard</NavLink></li> }
                    </ul>
                </div>
                {/* Website Logo/Name */ }
                <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
                    <AppOrbitLogo />
                </Link>
            </div>

            {/* Navbar Center Section (Desktop Menu) */ }
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    { navLinks }
                    {/* Desktop Dashboard Link: Removed from here as per requirement */ }
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
                                <div className="w-10 rounded-full" title={ user.displayName || user.email }>
                                    <img
                                        alt="User profile photo"
                                        src={ user.photoURL || "https://i.ibb.co/L936N1j/male-avatar-profile-picture-vector.jpg" }
                                    />
                                </div>
                            </label>
                            <div>
                                <ul tabIndex={ 0 } className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52">
                                    {/* User Name (Not clickable) */ }
                                    <li className="p-2 font-medium text-gray-800">{ user.displayName || user.email }</li>
                                    <li className="mt-0 pt-0">
                                        <div className='divider my-0'></div>
                                    </li>
                                    {/* Dashboard Link - ONLY HERE IN DROPDOWN (as per requirement) */ }
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
                        // If user is not logged in, show Login / Register button
                        <Link to="/login" className="btn btn-primary btn-outline">
                            <VscAccount />
                            Login / Register
                        </Link>
                    )
                ) }
            </div>
        </div>
    );
};

export default Navbar;