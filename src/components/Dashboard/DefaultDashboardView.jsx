import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const DefaultDashboardView = () => {

    useEffect( () => {
        document.title = 'Dashboard || AppOrbit';
    }, [] );

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: dbUser = {}, isLoading, isError } = useQuery( {
        queryKey: [ 'dbUser', user?.email ],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get( `/users/profile/${ user.email }` );
            return res.data;
        },
    } );

    if ( isLoading ) return <p>Loading...</p>;
    if ( isError ) return <p>Error loading user profile</p>;

    return (
        <div className="text-center py-20 text-gray-500">
            <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)]">
                <h2 className="text-4xl font-bold mb-4">Welcome, { dbUser.name } ! 👋</h2>
                <p className='text-2xl border p-2 rounded-md mb-5'>Role: { dbUser.role }</p>
                <p className="text-lg mb-2">Please select an option from the sidebar to get started.</p>
            </div>
        </div>
    );
};

export default DefaultDashboardView;
