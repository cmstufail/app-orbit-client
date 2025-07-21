import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';

const AdminRoute = ( { children } ) => {
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();
    const { role, isLoading: roleLoading } = useRole( user?.email );

    if ( authLoading || roleLoading ) {
        return <div className="text-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    if ( !user || role !== 'admin' ) {
        return <Navigate to="/" state={ {
            from: location,
            message: 'Admin privileges required'
        } } replace />;
    }

    return children;
};

export default AdminRoute;