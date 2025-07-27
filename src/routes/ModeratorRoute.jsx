import { Navigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Spinner from '../components/Shared/Spinner';


const ModeratorRoute = ( { children } ) => {
    const { user, loading: authLoading } = useAuth();
    const { role, isLoading: roleLoading } = useRole();
    const location = useLocation();

    if ( authLoading || roleLoading ) {
        return (
            <div className="text-center py-20 flex flex-col items-center justify-center text-ui-text-primary dark:text-ui-text-dark min-h-screen">
                <Spinner className="mb-2" />
                <p>Verifying profile and role... Please wait.</p>
            </div>
        );
    }

    if ( user && ( role === 'moderator' || role === 'admin' ) ) {
        return children;
    }

    return <Navigate to="/" state={ {
        from: location,
        message: 'No access: Only for moderators or administrators.'
    } } replace />;
};

export default ModeratorRoute;