import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaCrown, FaSyncAlt } from 'react-icons/fa';

import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';


const MyProfile = () => {
    // Set the page title when the component mounts
    useEffect( () => {
        document.title = 'My Profile || AppOrbit';
    }, [] );

    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        data: dbUser,
        isLoading: dbUserLoading,
        isError: dbUserError,
        error: dbUserErrorObj,
        refetch
    } = useQuery( {
        queryKey: [ 'dbUser', user?.email ],
        queryFn: async () => {
            if ( !user?.email ) {
                return null;
            }
            try {
                const response = await axiosSecure.get( `/users/profile/${ encodeURIComponent( user.email ) }` );
                const userData = response.data.user || response.data;

                if ( !userData || !userData.email ) {
                    console.error( "MyProfile queryFn: Backend returned incomplete user data (missing email).", response.data );
                    throw new Error( 'Backend returned incomplete user data.' );
                }

                return userData;

            } catch ( backendError ) {
                console.error( "MyProfile queryFn: Axios call failed or backend returned error response. Error details:", backendError.response?.data || backendError.message );
                throw new Error( backendError.response?.data?.error || backendError.response?.data?.message || backendError.message || 'Failed to load profile data.' );
            }
        },
        enabled: !authLoading && !!user?.email,
        staleTime: 0,
        cacheTime: 0,
        retry: 1,
    } );

    const handleRefetch = () => {
        refetch();
    };

    if ( authLoading || dbUserLoading ) {
        return (
            <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading profile data...</p>
            </div>
        );
    }

    if ( dbUserError ) {
        console.error( "MyProfile: Displaying error message. Error details:", dbUserErrorObj );
        return (
            <div className="text-center py-10 text-red-500">
                <p>Error loading profile: { dbUserErrorObj.message }</p>
                <p>Please check your network or try again later. <button onClick={ handleRefetch } className="btn btn-sm btn-ghost"><FaSyncAlt /> Retry</button></p>
            </div>
        );
    }

    if ( !user || !dbUser ) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No profile information available. Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link>.</p>
            </div>
        );
    }

    const isSubscribed = dbUser.membershipStatus && dbUser.membershipStatus !== 'none';
    const membershipPlanName = isSubscribed ? dbUser.membershipStatus : 'Basic';

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">My Profile</h2>
            <div className="max-w-md mx-auto bg-base-200 p-8 rounded-lg shadow-md text-center">
                <div className="avatar mb-4">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                            src={ dbUser.photoURL || "https://i.ibb.co/L936N1j/male-avatar-profile-picture-vector.jpg" }
                            alt={ dbUser.name || "User" }
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{ dbUser.name }</h3>
                <p className="text-base-content text-opacity-70 mb-4">{ dbUser.email }</p>

                <div className="mt-6 p-4 border rounded-lg bg-base-200">
                    <h4 className="text-xl font-bold mb-3">Membership Status</h4>
                    { isSubscribed ? (
                        <div className="flex items-center justify-center gap-2 text-success font-semibold text-lg">
                            <FaCrown className="text-xl" />
                            <span>Status: { membershipPlanName } (Verified)</span>
                        </div>
                    ) : (
                        <div className="text-warning font-semibold text-lg">
                            <span>Status: Basic</span>
                            <p className="text-sm text-gray-500 mt-1">Unlock unlimited product submissions and more!</p>
                            <Link to="/dashboard/checkout" className="btn btn-primary mt-4">
                                Subscribe Now ($10/month)
                            </Link>
                        </div>
                    ) }
                </div>
                <button
                    onClick={ handleRefetch }
                    className="btn btn-ghost mt-4"
                    disabled={ dbUserLoading }
                >
                    <FaSyncAlt /> Refresh Profile Data
                </button>
            </div>
        </div>
    );
};

export default MyProfile;