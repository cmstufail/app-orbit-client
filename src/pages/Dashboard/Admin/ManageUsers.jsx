import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2'; //
import { FaUserShield, FaUserTie } from 'react-icons/fa';
import useAxiosSecure from './../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Shared/Spinner';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // 1. Fetch all users
    const {
        data: users = [],
        isLoading,
        isError,
    } = useQuery( {
        queryKey: [ 'allUsers' ],
        queryFn: async () => {
            const res = await axiosSecure.get( '/users/all-users' ); // Backend endpoint to get all users
            return res.data;
        },
        staleTime: 1000 * 60,
    } );

    // 2. Mutation for updating user role
    const updateUserRoleMutation = useMutation( {
        mutationFn: async ( { userId, newRole } ) => {
            const res = await axiosSecure.patch( `/users/make-${ newRole }/${ userId }` ); // Backend endpoint
            return res.data;
        },
        onSuccess: ( data ) => {
            Swal.fire( {
                icon: 'success',
                title: 'Success!',
                text: data.message,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            } );
            queryClient.invalidateQueries( [ 'allUsers' ] );

            queryClient.invalidateQueries( [ 'userRole' ] );
        },
        onError: ( err ) => {
            console.error( 'Error updating user role:', err.response?.data || err.message );
            Swal.fire( {
                icon: 'error',
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to update user role.',
            } );
        },
    } );

    // Handler for "Make Moderator" or "Make Admin" button click
    const handleMakeRole = ( userId, currentRole, targetRole, userName ) => {

        if ( currentRole === targetRole ) {
            toast.info( `${ userName } is already a ${ targetRole }.` );
            return;
        }

        Swal.fire( {
            title: `Change ${ userName }'s role to ${ targetRole }?`,
            text: "This action will update their permissions.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, make ${ targetRole }!`,
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                updateUserRoleMutation.mutate( { userId, newRole: targetRole } );
            }
        } );
    };

    // Loading and Error states
    if ( isLoading ) {
        return <Spinner />
    }

    if ( isError ) {
        return (
            <div className="text-center py-10 text-red-500">
                <Spinner />
            </div>
        );
    }

    if ( users.length === 0 ) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No users found in the system.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    {/* Table Head */ }
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Current Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Table Body */ }
                        { users.map( ( user, index ) => (
                            <tr key={ user._id }>
                                <th>{ index + 1 }</th>
                                <td>{ user.name }</td>
                                <td>{ user.email }</td>
                                <td>
                                    <span className={ `badge ${ user.role === 'admin' ? 'badge-error' :
                                        user.role === 'moderator' ? 'badge-warning' : 'badge-info'
                                        }` }>
                                        { user.role }
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    {/* Make Moderator Button */ }
                                    <button
                                        onClick={ () => handleMakeRole( user._id, user.role, 'moderator', user.name ) }
                                        className="btn btn-sm btn-outline btn-warning"
                                        disabled={ user.role === 'moderator' || user.role === 'admin' || updateUserRoleMutation.isPending }
                                    >
                                        <FaUserTie /> Make Moderator
                                    </button>
                                    {/* Make Admin Button */ }
                                    <button
                                        onClick={ () => handleMakeRole( user._id, user.role, 'admin', user.name ) }
                                        className="btn btn-sm btn-outline btn-error"
                                        disabled={ user.role === 'admin' || updateUserRoleMutation.isPending }
                                    >
                                        <FaUserShield /> Make Admin
                                    </button>
                                </td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;