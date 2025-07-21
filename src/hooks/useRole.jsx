import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: role, isLoading: roleLoading, isError: roleError, error: roleErrorObj } = useQuery( {
        queryKey: [ 'userRole', user?.email ],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => {
            if ( !user?.email ) {
                console.log( "useRole hook: No user email available (user object is null/undefined), defaulting role to 'user'." );
                return 'user';
            }
            try {
                const res = await axiosSecure.get( `/users/role/${ user.email }` );
                return res.data.role;
            } catch ( err ) {
                console.error( "useRole hook: Error fetching user role:", err.response?.data || err.message );
                if ( err.response && err.response.status === 404 ) {
                    console.warn( `useRole hook: User ${ user.email } not found in DB, defaulting to 'user'.` );
                    return 'user';
                }
                console.error( "useRole hook: Non-404 error, defaulting role to 'user'. Full error object:", err );
                return 'user';
            }
        },
        staleTime: 0,
        cacheTime: 0,
        initialData: 'user',
    } );

    return { role, isLoading: authLoading || roleLoading, isError: roleError, error: roleErrorObj };
};

export default useRole;