import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from './../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyProducts = () => {

    useEffect( () => {
        document.title = 'My Products || AppOrbit';
    }, [] );

    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: products = [], isLoading, isError, error } = useQuery( {
        queryKey: [ 'myProducts', user?.email ],
        queryFn: async () => {
            if ( !user?.email ) return [];
            const res = await axiosSecure.get( `/products/my-products/${ user.email }` );
            return res.data;
        },
        enabled: !authLoading && !!user?.email,
        staleTime: 1000 * 60,
    } );

    const deleteProductMutation = useMutation( {
        mutationFn: async ( productId ) => {
            const res = await axiosSecure.delete( `/products/${ productId }` );
            return res.data;
        },
        onSuccess: () => {
            Swal.fire( {
                title: 'Deleted!',
                text: 'Your product has been deleted.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            } );
            queryClient.invalidateQueries( [ 'myProducts', user?.email ] );
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
            queryClient.invalidateQueries( [ 'trendingProducts' ] );
        },
        onError: ( err ) => {
            console.error( 'Error deleting product:', err );
            Swal.fire( {
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to delete product.',
                icon: 'error',
            } );
        },
    } );

    const handleDelete = ( productId ) => {
        Swal.fire( {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                deleteProductMutation.mutate( productId );
            }
        } );
    };

    const handleUpdate = ( productId ) => {
        navigate( `/dashboard/update-product/${ productId }` );
    };

    if ( isLoading || authLoading ) {
        return (
            <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading your products...</p>
            </div>
        );
    }

    if ( isError ) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>Error fetching your products: { error.message }</p>
            </div>
        );
    }

    if ( !products || products.length === 0 ) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>You haven't added any products yet. Go to <Link to="/dashboard/add-product" className="text-blue-600 hover:underline">Add Product</Link> to add your first one!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">My Products</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    {/* Table Head */ }
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Upvotes</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Table Body */ }
                        { products.map( ( product, index ) => (
                            <tr key={ product._id }>
                                <th>{ index + 1 }</th>
                                <td>{ product.name }</td>
                                <td>{ product.upvotes }</td>
                                <td>
                                    <span className={ `badge ${ product.status === 'accepted' ? 'badge-success' :
                                        product.status === 'pending' ? 'badge-warning' : 'badge-error'
                                        }` }>
                                        { product.status }
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={ () => handleUpdate( product._id ) }
                                        className="btn btn-sm btn-info text-white"
                                    >
                                        <FaEdit /> Update
                                    </button>
                                    <button
                                        onClick={ () => handleDelete( product._id ) }
                                        className="btn btn-sm btn-error text-white"
                                        disabled={ deleteProductMutation.isPending }
                                    >
                                        <FaTrashAlt /> Delete
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

export default MyProducts;