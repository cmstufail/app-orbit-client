import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const ProductCard = ( { product } ) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const defaultImage = 'https://placehold.co/400x200?text=No+Image';

    const isOwner = user && user.uid === product.owner?.id;
    const alreadyUpvoted = user && product.upvotedBy?.includes( user.uid );

    const upvoteMutation = useMutation( {
        mutationFn: async ( productId ) => {
            const res = await axiosSecure.patch( `/products/${ productId }/upvote` );
            return res.data;
        },
        onSuccess: ( data ) => {            
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
            queryClient.invalidateQueries( [ 'trendingProducts' ] );
            queryClient.invalidateQueries( [ 'allProducts' ] );
            queryClient.invalidateQueries( [ 'productDetails', product._id ] );

            if ( data.message === 'Product upvoted successfully' ) {
                toast.success( 'Product upvoted successfully!' );
            } else if ( data.message === 'Product downvoted successfully' ) {
                toast.success( 'Product downvoted successfully!' );
            } else {
                toast.success( 'Upvote status changed!' );
            }
        },
        onError: ( err ) => {
            console.error( 'ProductCard: Upvote mutation failed:', err.response?.data || err.message );
            const errorMessage = err.response?.data?.message || 'Failed to upvote product.';
            Swal.fire( {
                icon: 'error',
                title: 'Error!',
                text: errorMessage
            } );
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
            className="card bg-base-100 shadow-xl border border-primary border-2 hover:scale-105 transition-transform duration-300"
        >
            <figure className="relative">
                <img
                    src={ product.image || defaultImage }
                    alt={ product.name || 'Product Image' }
                    className="h-48 w-full object-cover"
                    onError={ ( e ) => {
                        e.target.src = defaultImage;
                    } }
                />
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg font-bold opacity-0 transition-opacity duration-200 hover:opacity-100">
                    View Details
                </div>
            </figure>
            <div className="card-body p-4">
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