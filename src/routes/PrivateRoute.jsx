import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import Spinner from '../components/Shared/Spinner';


const PrivateRoute = ( { children } ) => {
    const { user, loading } = useContext( AuthContext );
    const location = useLocation();

    if ( loading ) {
        return (
            <div className="flex justify-center items-center h-screen text-ui-text-primary dark:text-ui-text-dark flex-col">
                <Spinner className="mb-2" />
                <p>Verifying profile... Please wait.</p>
            </div>
        );
    }

    if ( !user ) {
        return (
            <Navigate to="/login" state={ {
                from: location,
                message: 'You must be logged in to view this page.'
            } } replace />
        );
    }
    return children;
};

export default PrivateRoute;