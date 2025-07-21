import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';

const ModeratorRoute = ( { children } ) => {
    const { user, loading: authLoading } = useAuth();
    const { role, isLoading: roleLoading } = useRole();
    const location = useLocation();

    if ( authLoading || roleLoading ) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if ( user && ( role === 'moderator' || role === 'admin' ) ) {
        return children;
    }

    return <Navigate to="/" state={ { from: location } } replace />;
};

export default ModeratorRoute;