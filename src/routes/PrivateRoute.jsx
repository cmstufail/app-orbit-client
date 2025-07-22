import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ( { children } ) => {
    const { user, loading } = useContext( AuthContext );
    const location = useLocation();

    if ( loading ) {
        console.log( "PrivateRoute: Auth is LOADING. Showing spinner. User:", user, "Loading state:", loading );
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-2 text-gray-700">Loading user session...</p>
            </div>
        );
    }

    if ( !user ) {
        console.log( "PrivateRoute: Auth loading finished, NO user found. Redirecting to /login.", { user: user, loading: loading } );
        return <Navigate to="/login" state={ { from: location } } replace />;
    }

    console.log( "PrivateRoute: Auth loading finished, user FOUND. Rendering children.", { user: user, loading: loading } );
    return children;
};

export default PrivateRoute;