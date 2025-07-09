
import { Link, NavLink } from 'react-router-dom';
import { VscAccount, VscSignOut, VscDashboard } from "react-icons/vsc";
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContex';


const Navbar = () => {
    const { user, logOut } = useContext( AuthContext );

    const navLinks = (
        <>
            <li><NavLink to="/" className={ ( { isActive } ) => isActive ? 'font-bold text-primary' : '' }>Home</NavLink></li>
            <li><NavLink to="/products" className={ ( { isActive } ) => isActive ? 'font-bold text-primary' : '' }>Products</NavLink></li>
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-sm container px-4 mx-auto">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={ 0 } className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={ 0 } className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        { navLinks }
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
                    AppOrbit
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    { navLinks }
                </ul>
            </div>
            <div className="navbar-end">
                { user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={ 0 } className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full" title={ user.displayName }>
                                <img alt="User profile photo" src={ user.photoURL } />
                            </div>
                        </label>
                        <div>
                            <ul tabIndex={ 0 } className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52">
                                <li className="p-2 font-medium">{ user.displayName }</li>
                                <li className="mt-0 pt-0">
                                    <div className='divider my-0'></div>
                                </li>
                                <li>
                                    <Link to="/dashboard/my-profile">
                                        <VscDashboard />
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={ logOut }>
                                        <VscSignOut />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary btn-outline">
                        <VscAccount />
                        Login / Register
                    </Link>
                ) }
            </div>
        </div>
    );
};

export default Navbar;