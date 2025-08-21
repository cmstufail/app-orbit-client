import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';


const ProductCard = ( { product } ) => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [ showDefaultAvatar, setShowDefaultAvatar ] = useState( false );

    const defaultImage = 'https://i.ibb.co/1JthzCwR/character-default-avatar.png';

    const defaultProductImagePlaceholder = 'https://via.placeholder.com/400x250?text=No+Product+Image';

    const isOwner = user && user.uid === product.owner?.id;
    const alreadyUpvoted = user && product.upvotedBy?.includes( user.uid );

    const upvoteMutation = useMutation( {
        mutationFn: async ( productId ) => {
            const res = await axiosSecure.patch( `/products/${ productId }/upvote` );
            return res.data;
        },
        onSuccess: ( data ) => {
            toast.success( data.message || 'Product upvoted successfully!' );
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
            queryClient.invalidateQueries( [ 'trendingProducts' ] );
            queryClient.invalidateQueries( [ 'allProducts' ] );
            queryClient.invalidateQueries( [ 'productDetails', product._id ] );
        },
        onError: ( err ) => {
            console.error( 'ProductCard: Upvote failed:', err.response?.data || err.message );
            toast.error( err.response?.data?.message || 'Failed to upvote/downvote product.' );
        },
    } );

    const handleUpvote = async ( e ) => {
        e.preventDefault();
        e.stopPropagation();

        if ( !user ) {
            Swal.fire( {
                icon: 'info',
                title: 'Login Required',
                text: 'Please log in to upvote a product.',
                confirmButtonText: 'Go to Login',
                showCancelButton: true
            } ).then( ( result ) => {
                if ( result.isConfirmed ) {
                    navigate( '/login' );
                }
            } );
            return;
        }

        if ( isOwner ) {
            toast.info( "You cannot upvote your own product." );
            return;
        }

        upvoteMutation.mutate( product._id );
    };

    return (
        <Link
            to={ `/product/${ product._id }` }
            className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300"
        >
            <figure className="relative">
                <img
                    src={ product.image || defaultProductImagePlaceholder }
                    alt={ product.name || 'Product Image' }
                    className={ `
                        ${ showDefaultAvatar ? 'w-48 h-48 rounded-full object-contain mx-auto mt-4' : 'w-full h-48 object-contain rounded-t-lg p-3' }
                        ${ !showDefaultAvatar ? 'hover:scale-105 transition-transform duration-300' : '' }
                    `}
                    onError={ ( e ) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                        setShowDefaultAvatar( true );
                        console.warn( `ProductCard: Image failed to load for product "${ product.name }". Using fallback to avatar.` );
                    } }
                />
                <Link to={ `/product/${ product._id }` } className="absolute inset-0 z-10 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center bg-[#3825C1] bg-opacity-40 text-white text-lg font-bold">
                    View Details
                </Link>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{ product.name }</h2>
                <p className="text-sm line-clamp-2">{ product.description }</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    { product.tags?.slice( 0, 3 ).map( ( tag, index ) => (
                        <span key={ index } className="badge badge-outline">
                            { tag }
                        </span>
                    ) ) }
                </div>
                <div className="card-actions justify-end mt-4">
                    <button
                        onClick={ handleUpvote }
                        disabled={ isOwner || upvoteMutation.isPending }
                        className={ `btn btn-outline btn-primary btn-sm ${ alreadyUpvoted ? 'btn-success' : '' }` }
                    >
                        <FiArrowUp className="h-4 w-4" />
                        { alreadyUpvoted ? "Downvote" : "Upvote" } ({ product.upvotes || 0 })
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;