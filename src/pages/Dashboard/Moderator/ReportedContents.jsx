import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaEye, FaTrashAlt } from 'react-icons/fa';
import { useEffect } from 'react';

import useAxiosSecure from './../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Shared/Spinner';

const ReportedContents = () => {


    useEffect( () => {
        // Set the page title when the component mounts
        document.title = 'Reported Contents || AppOrbit';
    }, [] );

    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const {
        data: products = [],
        isLoading,
        isError,
        error
    } = useQuery( {
        queryKey: [ 'reportedProducts' ],
        queryFn: async () => {
            const res = await axiosSecure.get( '/products/reported' );
            return res.data;
        },
        staleTime: 1000 * 30,
    } );

    const deleteProductMutation = useMutation( {
        mutationFn: async ( productId ) => {
            const res = await axiosSecure.delete( `/products/admin-delete/${ productId }` );
            return res.data;
        },
        onSuccess: () => {
            Swal.fire( {
                icon: 'success',
                title: 'Deleted!',
                text: 'The reported product has been permanently deleted.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            } );
            queryClient.invalidateQueries( [ 'reportedProducts' ] );
            queryClient.invalidateQueries( [ 'productsReviewQueue' ] );
            queryClient.invalidateQueries( [ 'allProducts' ] );
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
            queryClient.invalidateQueries( [ 'trendingProducts' ] );
        },
        onError: ( err ) => {
            console.error( 'Error deleting product:', err.response?.data || err.message );
            Swal.fire( {
                icon: 'error',
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to delete product.',
            } );
        },
    } );

    const handleDelete = ( productId ) => {
        Swal.fire( {
            title: 'Are you sure?',
            text: "You are about to delete this reported product permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                deleteProductMutation.mutate( productId );
            }
        } );
    };

    if ( isLoading ) {
        return <Spinner />
    }

    if ( isError ) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>Error loading reported contents: { error.message }</p>
            </div>
        );
    }

    if ( products.length === 0 ) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No products currently reported. The community is clean!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-base-200">
            <h2 className="text-3xl font-bold text-center mb-8">Reported Contents</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    {/* Table Head */ }
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Reports</th>
                            <th>Status</th>
                            <th>Submitted By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Table Body */ }
                        { products.map( ( product, index ) => (
                            <tr key={ product._id }>
                                <th>{ index + 1 }</th>
                                <td>{ product.name }</td>
                                <td>{ product.reportCount || 0 }</td>
                                <td>
                                    <span className={ `badge ${ product.status === 'accepted' ? 'badge-success' :
                                        product.status === 'pending' ? 'badge-warning' : 'badge-error'
                                        }` }>
                                        { product.status }
                                    </span>
                                </td>
                                <td>{ product.owner?.name || product.owner?.email || 'N/A' }</td>
                                <td className="flex gap-2 items-center">

                                    {/* Delete Button */ }
                                    <button
                                        onClick={ () => handleDelete( product._id ) }
                                        className="btn btn-sm btn-outline btn-error"
                                        disabled={ deleteProductMutation.isPending }
                                    >
                                        <FaTrashAlt /> Delete
                                    </button>
                                    {/* View Details Button */ }
                                    <Link to={ `/product/${ product._id }` } className="btn btn-sm btn-outline btn-info">
                                        <FaEye /> View Details
                                    </Link>
                                </td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportedContents;