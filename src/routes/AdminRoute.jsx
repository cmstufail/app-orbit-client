import { Navigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Spinner from '../components/Shared/Spinner';


const AdminRoute = ( { children } ) => {
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();
    const { role, isLoading: roleLoading } = useRole( user?.email );


    if ( authLoading || roleLoading ) {
        return (
            <div className="text-center py-10 flex flex-col items-center justify-center text-ui-text-primary dark:text-ui-text-dark min-h-screen">
                <Spinner className="mb-2" />
                <p>Verifying profile and role... Please wait.</p>
            </div>
        );
    }

    if ( !user || role !== 'admin' ) {
        console.warn( "Unauthorized access attempt:", { user: user?.email, role: role, attemptedPath: location.pathname } );

        return (
            <Navigate to="/" state={ {
                from: location,
                message: 'No access: For administrators only.'
            } } replace />
        );
    }

    return children;
};

export default AdminRoute;