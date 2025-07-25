import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';


const PrivateRoute = ( { children } ) => {
    const { user, loading } = useContext( AuthContext );
    const location = useLocation();

    if ( loading ) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-2 text-gray-700">Loading user session...</p>
            </div>
        );
    }

    if ( !user ) {
        return <Navigate to="/login" state={ { from: location } } replace />;
    }
    return children;
};

export default PrivateRoute;