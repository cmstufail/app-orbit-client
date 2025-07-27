import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import useAuth from './../../hooks/useAuth';
import useAxiosSecure from './../../hooks/useAxiosSecure';
import Spinner from './../../components/Shared/Spinner';


const ProductUpdate = () => {

    useEffect( () => {
        // Set the page title when the component mounts
        document.title = 'Product Update || AppOrbit';
    }, [] );


    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [ formData, setFormData ] = useState( {
        name: '',
        image: '',
        description: '',
        tags: '',
        upvotes: 0,
    } );

    const { data: product, isLoading, isError, error } = useQuery( {
        queryKey: [ 'product', id ],
        queryFn: async () => {
            if ( !id ) return null;
            const res = await axiosSecure.get( `/products/${ id }` );
            return res.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60,
    } );

    useEffect( () => {
        if ( product ) {
            if ( user && product.owner.id !== user.uid ) {
                toast.error( "You are not authorized to update this product." );
                navigate( '/dashboard/my-products' );
                return;
            }

            setFormData( {
                name: product.name || '',
                image: product.image || '',
                description: product.description || '',
                tags: product.tags ? product.tags.join( ', ' ) : '',
                upvotes: product.upvotes || 0,
            } );
        }
    }, [ product, user, navigate ] );

    const updateProductMutation = useMutation( {
        mutationFn: async ( updatedProductData ) => {
            const res = await axiosSecure.patch( `/products/${ id }`, updatedProductData );
            return res.data;
        },
        onSuccess: () => {
            toast.success( 'Product updated successfully!' );
            queryClient.invalidateQueries( [ 'product', id ] );
            queryClient.invalidateQueries( [ 'myProducts', user?.email ] );
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
            queryClient.invalidateQueries( [ 'trendingProducts' ] );
            navigate( '/dashboard/my-products' );
        },
        onError: ( err ) => {
            console.error( 'Error updating product:', err.response?.data || err.message );
            toast.error( `Failed to update product: ${ err.response?.data?.message || err.message }` );
        },
    } );

    const handleChange = ( e ) => {
        const { name, value } = e.target;
        setFormData( ( prev ) => ( { ...prev, [ name ]: value } ) );
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault();

        if ( authLoading || isLoading || !user ) {
            toast( 'Please wait while data loads or log in.' );
            return;
        }
        if ( product && product.owner.id !== user.uid ) {
            toast.error( "Security check failed: You are not the product owner." );
            return;
        }

        const productToUpdate = {
            ...formData,
            upvotes: parseInt( formData.upvotes, 10 ),
            tags: formData.tags.split( ',' ).map( tag => tag.trim() ).filter( tag => tag !== '' ),
        };

        updateProductMutation.mutate( productToUpdate );
    };

    if ( isLoading || authLoading ) {
        return (
            <div className="text-center py-10 flex flex-col items-center justify-center text-ui-text-primary dark:text-ui-text-dark">
                <Spinner className="mb-2" />
                <p>Loading product details... Please wait.</p>
            </div>
        );
    }

    if ( isError ) {
        console.error( "There was a problem loading product details.", error );

        return (
            <div className="text-center py-10 text-error-light dark:text-error-dark flex flex-col items-center justify-center">
                <p>Sorry! Unable to load product details.</p>
                <p className="text-sm mt-2">Please try again in a while.</p>
            </div>
        );
    }

    if ( !product ) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>Product not found. Invalid ID or product does not exist.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-base-content mb-8">Update Product: { product.name }</h2>
            <form onSubmit={ handleSubmit } className="max-w-xl mx-auto bg-base-200 p-8 rounded-lg shadow-md">
                {/* Owner Info (Read-Only) */ }
                <div className="mb-4 bg-base-200 text-base-content p-4 rounded">
                    <p className="text-sm font-bold mb-2">Product Owner Info:</p>
                    <p><strong>Name:</strong> { product.owner?.name }</p>
                    <p><strong>Email:</strong> { product.owner?.email }</p>
                    <p className="text-xs mt-2">Owner information cannot be changed.</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-bold mb-2">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={ formData.name }
                        onChange={ handleChange }
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-bold mb-2">Image URL</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={ formData.image }
                        onChange={ handleChange }
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-bold mb-2">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={ formData.description }
                        onChange={ handleChange }
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="tags" className="block text-sm font-bold mb-2">Tags (comma-separated)</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={ formData.tags }
                        onChange={ handleChange }
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="e.g., AI, productivity, web-app"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="upvotes" className="block text-sm font-bold mb-2">Current Upvotes</label>
                    <input
                        type="number"
                        id="upvotes"
                        name="upvotes"
                        value={ product.upvotes || 0 }
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        readOnly
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={ updateProductMutation.isPending }
                    >
                        { updateProductMutation.isPending ? 'Updating Product...' : 'Update Product' }
                    </button>
                    <button
                        type="button"
                        onClick={ () => navigate( '/dashboard/my-products' ) }
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductUpdate;