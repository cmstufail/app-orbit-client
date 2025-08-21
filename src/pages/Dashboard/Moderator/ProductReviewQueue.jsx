import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes, FaStar } from 'react-icons/fa';

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Shared/Spinner';


const ProductReviewQueue = () => {

    useEffect( () => {
        // Set the page title when the component mounts
        document.title = 'Product Review || AppOrbit';
    }, [] );

    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const {
        data: products = [],
        isLoading,
        isError,
        error
    } = useQuery( {
        queryKey: [ 'productsReviewQueue' ],
        queryFn: async () => {
            const res = await axiosSecure.get( '/products/review-queue' );
            return res.data;
        },
        staleTime: 1000 * 30,
    } );

    const updateProductStatusMutation = useMutation( {
        mutationFn: async ( { productId, newStatus } ) => {
            const res = await axiosSecure.patch( `/products/${ productId }/${ newStatus }` );
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
            queryClient.invalidateQueries( [ 'productsReviewQueue' ] );
            queryClient.invalidateQueries( [ 'allProducts' ] );
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
            queryClient.invalidateQueries( [ 'trendingProducts' ] );
        },
        onError: ( err ) => {
            console.error( 'Error updating product status:', err.response?.data || err.message );
            Swal.fire( {
                icon: 'error',
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to update product status.',
            } );
        },
    } );

    const markProductFeaturedMutation = useMutation( {
        mutationFn: async ( productId ) => {
            const res = await axiosSecure.patch( `/products/${ productId }/mark-featured` );
            return res.data;
        },
        onSuccess: ( data ) => {
            Swal.fire( {
                icon: 'success',
                title: 'Featured!',
                text: data.message,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            } );
            queryClient.invalidateQueries( [ 'productsReviewQueue' ] );
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
        },
        onError: ( err ) => {
            console.error( 'Error marking product as featured:', err.response?.data || err.message );
            Swal.fire( {
                icon: 'error',
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to mark product as featured.',
            } );
        },
    } );

    const handleAccept = ( productId ) => {
        Swal.fire( {
            title: 'Accept this product?',
            text: "It will be visible on the website.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Accept!'
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                updateProductStatusMutation.mutate( { productId, newStatus: 'accept' } );
            }
        } );
    };

    const handleReject = ( productId ) => {
        Swal.fire( {
            title: 'Reject this product?',
            text: "It will not be visible on the website.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Reject!'
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                updateProductStatusMutation.mutate( { productId, newStatus: 'reject' } );
            }
        } );
    };

    const handleMakeFeatured = ( productId ) => {
        Swal.fire( {
            title: 'Mark as Featured?',
            text: "This product will appear on the homepage's featured section.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Make Featured!'
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                markProductFeaturedMutation.mutate( productId );
            }
        } );
    };

    if ( isLoading ) {
        return <Spinner />
    }

    if ( isError ) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>Error loading review queue: { error.message }</p>
            </div>
        );
    }

    if ( products.length === 0 ) {
        return (
            <div className="text-center py-10">
                <p>No products currently awaiting review. Great job, Moderator!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-base-200">
            <h2 className="text-3xl font-bold text-center mb-8">Product Review Queue</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    {/* Table Head */ }
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
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
                                <td>
                                    <span className={ `badge ${ product.status === 'accepted' ? 'badge-success' :
                                        product.status === 'pending' ? 'badge-warning' : 'badge-error'
                                        }` }>
                                        { product.status }
                                    </span>
                                </td>
                                <td>{ product.owner?.name || product.owner?.email || 'N/A' }</td>
                                <td className="flex gap-2 items-center">
                                    {/* View Details Button */ }
                                    <Link to={ `/product/${ product._id }` } className="btn btn-sm btn-outline btn-info">
                                        <FaEye /> View Details
                                    </Link>
                                    {/* Make Featured Button */ }
                                    <button
                                        onClick={ () => handleMakeFeatured( product._id ) }
                                        className="btn btn-sm btn-outline btn-secondary"
                                        disabled={ product.isFeatured || updateProductStatusMutation.isPending || markProductFeaturedMutation.isPending }
                                    >
                                        <FaStar /> Make Featured
                                    </button>
                                    {/* Accept Button */ }
                                    <button
                                        onClick={ () => handleAccept( product._id ) }
                                        className="btn btn-sm btn-outline btn-success"
                                        disabled={ product.status === 'accepted' || updateProductStatusMutation.isPending || markProductFeaturedMutation.isPending }
                                    >
                                        <FaCheck /> Accept
                                    </button>
                                    {/* Reject Button */ }
                                    <button
                                        onClick={ () => handleReject( product._id ) }
                                        className="btn btn-sm btn-outline btn-error"
                                        disabled={ product.status === 'rejected' || updateProductStatusMutation.isPending || markProductFeaturedMutation.isPending }
                                    >
                                        <FaTimes /> Reject
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

export default ProductReviewQueue;