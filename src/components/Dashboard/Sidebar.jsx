import { NavLink } from 'react-router-dom';
import { FaUser, FaPlus, FaProductHunt, FaCheckCircle, FaExclamationTriangle, FaChartBar, FaUsers, FaTag, FaHome, FaSignOutAlt } from 'react-icons/fa';
import useRole from './../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const { logout } = useAuth();
    const { role, isLoading: roleLoading } = useRole();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success( 'User logged out successfully!!' );

        } catch ( error ) {
            console.error( "Logout failed:", error );
            // Optionally, add a SweetAlert notification here
        }
    };

    if ( roleLoading ) {
        return <div className="p-4"><span className="loading loading-spinner loading-md"></span> Loading roles...</div>;
    }

    return (
        <ul className="menu p-4 w-full bg-base-200 text-base-content min-h-full">
            {/* Common Links for all logged-in users */ }

            <li>
                <NavLink
                    to="/dashboard"
                    end
                    className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }
                >
                    🏠 Dashboard Home
                </NavLink>
            </li>
            { role !== 'admin' && (
                <>
                    <li>
                        <NavLink to="/dashboard/my-profile" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            <FaUser /> My Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/add-product" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            <FaPlus /> Add Product
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/my-products" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            <FaProductHunt /> My Products
                        </NavLink>
                    </li>
                    <div className="divider"></div>
                </>
            ) }

            {/* Moderator Specific Links */ }
            { ( role === 'moderator' || role === 'admin' ) && (
                <>
                    <li className="menu-title">Moderator Panel</li>
                    <li>
                        <NavLink to="/dashboard/product-review-queue" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            <FaCheckCircle /> Product Review Queue
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/reported-contents" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            <FaExclamationTriangle /> Reported Contents
                        </NavLink>
                    </li>
                    <div className="divider"></div>
                </>
            ) }

            {/* Admin Specific Links */ }
            { role === 'admin' && (
                <>
                    <li className="menu-title">Admin Panel</li>
                    <li>
                        <NavLink to="/dashboard/statistics" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            <FaChartBar /> Statistics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/manage-users" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            <FaUsers /> Manage Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/manage-coupons" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                            <FaTag /> Manage Coupons
                        </NavLink>
                    </li>
                    <div className="divider"></div>
                </>
            ) }

            {/* General Links (Back to Home / Logout) */ }
            <li>
                <NavLink to="/" className={ ( { isActive } ) => isActive ? "font-bold text-primary" : "" }>
                    <FaHome /> Back to Home
                </NavLink>
            </li>
            <li>
                <a onClick={ handleLogout } className="text-error">
                    <FaSignOutAlt /> Logout
                </a>
            </li>
        </ul>
    );
};

export default Sidebar;