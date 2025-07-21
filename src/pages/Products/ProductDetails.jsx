import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiArrowUp, FiFlag } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [ reviewFormData, setReviewFormData ] = useState( {
        rating: 5,
        reviewDescription: '',
    } );

    const {
        data: product,
        isLoading: productLoading,
        isError: productError,
        error: productErrorObj
    } = useQuery( {
        queryKey: [ 'productDetails', id ],
        queryFn: async () => {
            if ( !id ) return null;
            const res = await axiosSecure.get( `/products/${ id }` );
            return res.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60,
    } );

    const {
        data: reviews = [],
        isLoading: reviewsLoading,
        isError: reviewsError
    } = useQuery( {
        queryKey: [ 'productReviews', id ],
        queryFn: async () => {
            if ( !id ) return [];
            const res = await axiosSecure.get( `/reviews/product/${ id }` );
            return res.data;
        },
        enabled: !!id,
        staleTime: 1000 * 30,
    } );

    const upvoteMutation = useMutation( {
        mutationFn: async ( productId ) => {
            const res = await axiosSecure.patch( `/products/${ productId }/upvote` );
            return res.data;
        },
        onSuccess: ( data ) => {
            toast.success( data.message );
            queryClient.invalidateQueries( [ 'productDetails', id ] );
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
            queryClient.invalidateQueries( [ 'trendingProducts' ] );
        },
        onError: ( err ) => {
            console.error( 'Error upvoting product:', err.response?.data || err.message );
            toast.error( err.response?.data?.message || 'Failed to upvote/downvote product.' );
        },
    } );

    const reportProductMutation = useMutation( {
        mutationFn: async ( { productId, reason } ) => {
            const res = await axiosSecure.post( `/products/${ productId }/report`, { reason } );
            return res.data;
        },
        onSuccess: () => {
            Swal.fire( {
                title: 'Reported!',
                text: 'Product has been reported for moderator review.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            } );
            queryClient.invalidateQueries( [ 'productDetails', id ] );
        },
        onError: ( err ) => {
            console.error( 'Error reporting product:', err.response?.data || err.message );
            Swal.fire( {
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to report product.',
                icon: 'error',
            } );
        },
    } );

    const handleUpvote = ( e ) => {
        e.preventDefault();
        if ( authLoading ) { toast( 'Loading user data, please wait...' ); return; }
        if ( !user ) { navigate( '/login', { state: { from: location } } ); return; }
        upvoteMutation.mutate( id );
    };

    const handleReport = () => {
        if ( authLoading ) { toast( 'Loading user data, please wait...' ); return; }
        if ( !user ) { navigate( '/login', { state: { from: location } } ); return; }

        Swal.fire( {
            title: 'Report this product?',
            input: 'text',
            inputLabel: 'Reason for reporting (optional)',
            inputPlaceholder: 'Enter reason...',
            showCancelButton: true,
            confirmButtonText: 'Report',
            showLoaderOnConfirm: true,
            preConfirm: ( reason ) => {
                return reportProductMutation.mutateAsync( { productId: id, reason: reason || 'No reason provided' } )
                    .catch( error => {
                        Swal.showValidationMessage( `Request failed: ${ error.response?.data?.message || error.message }` );
                        return false;
                    } );
            },
            allowOutsideClick: () => !Swal.isLoading()
        } ).then( ( result ) => {
            if ( result.isConfirmed && result.value ) {
                // Success message handled by onSucces of reportProductMutation
            }
        } );
    };

    const handleReviewChange = ( e ) => {
        const { name, value } = e.target;
        setReviewFormData( ( prev ) => ( { ...prev, [ name ]: value } ) );
    };

    const handleRatingChange = ( newRating ) => {
        setReviewFormData( ( prev ) => ( { ...prev, rating: newRating } ) );
    };

    const postReviewMutation = useMutation( {
        mutationFn: async ( reviewData ) => {
            const res = await axiosSecure.post( '/reviews', reviewData );
            return res.data;
        },
        onSuccess: () => {
            toast.success( 'Your review has been posted!' );
            setReviewFormData( { rating: 5, reviewDescription: '' } );
            queryClient.invalidateQueries( [ 'productReviews', id ] );
            queryClient.invalidateQueries( [ 'productDetails', id ] );
        },
        onError: ( err ) => {
            console.error( 'Error posting review:', err.response?.data || err.message );
            toast.error( err.response?.data?.message || 'Failed to post review.' );
        },
    } );

    const handleReviewSubmit = async ( e ) => {
        e.preventDefault();
        if ( authLoading ) { toast( 'Loading user data, please wait...' ); return; }
        if ( !user ) { navigate( '/login', { state: { from: location } } ); return; }

        if ( !user.displayName || !user.photoURL ) {
            toast.error( "Please update your profile name and photo in Dashboard > My Profile before posting a review." );
            navigate( '/dashboard/my-profile' );
            return;
        }

        const reviewToSend = {
            productId: id,
            reviewerEmail: user.email,
            reviewerName: user.displayName,
            reviewerImage: user.photoURL,
            rating: reviewFormData.rating,
            reviewDescription: reviewFormData.reviewDescription,
        };

        postReviewMutation.mutate( reviewToSend );
    };

    if ( productLoading || authLoading ) {
        return (
            <div className="text-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading product details...</p>
            </div>
        );
    }

    if ( productError ) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>Error loading product: { productErrorObj.message }</p>
                <p>Please check the product ID or your network connection.</p>
            </div>
        );
    }

    if ( !product ) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p>Product not found. Invalid ID or product does not exist.</p>
                <Link to="/products" className="btn btn-primary mt-4">Back to All Products</Link>
            </div>
        );
    }

    const isOwner = user && product.owner && user.uid === product.owner.id;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Product Image */ }
                    <div className="md:col-span-1">
                        <img
                            src={ product.image }
                            alt={ product.name }
                            className="w-full h-96 object-cover rounded-lg shadow-md"
                        />
                    </div>
                    {/* Product Info */ }
                    <div className="md:col-span-1">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">{ product.name }</h1>
                        <p className="text-lg text-gray-700 mb-4">{ product.description }</p>

                        <div className="flex items-center gap-4 mb-4">
                            {/* Upvote Button */ }
                            <button
                                onClick={ handleUpvote }
                                disabled={ isOwner || upvoteMutation.isPending }
                                className={ `btn btn-primary btn-outline btn-lg rounded-full flex items-center gap-2
                                            ${ isOwner ? 'btn-disabled opacity-70 cursor-not-allowed' : '' }
                                            ${ upvoteMutation.isPending ? 'loading loading-spinner' : '' }` }
                            >
                                <FiArrowUp className="w-5 h-5" />
                                Upvote ({ product.upvotes || 0 })
                            </button>
                            {/* Report Button */ }
                            <button
                                onClick={ handleReport }
                                disabled={ isOwner || reportProductMutation.isPending }
                                className={ `btn btn-error btn-outline btn-lg rounded-full flex items-center gap-2
                                            ${ isOwner ? 'btn-disabled opacity-70 cursor-not-allowed' : '' }
                                            ${ reportProductMutation.isPending ? 'loading loading-spinner' : '' }` }
                            >
                                <FiFlag className="w-5 h-5" />
                                Report
                            </button>
                        </div>

                        {/* Tags */ }
                        <div className="flex flex-wrap gap-2 mb-4">
                            { product.tags && product.tags.map( ( tag, index ) => (
                                <span key={ index } className="badge badge-lg badge-info text-white">
                                    #{ tag }
                                </span>
                            ) ) }
                        </div>

                        {/* External Link */ }
                        { product.externalLink && (
                            <div className="mb-4">
                                <a
                                    href={ product.externalLink }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary btn-outline"
                                >
                                    Visit Website
                                </a>
                            </div>
                        ) }

                        {/* Average Rating */ }
                        <div className="flex items-center gap-2 text-xl text-yellow-500 font-bold">
                            <FaStar /> { product.averageRating?.toFixed( 1 ) || '0.0' } ({ product.reviewCount || 0 } reviews)
                        </div>

                        {/* Owner Info (Optional: if you want to display owner details) */ }
                        <div className="mt-6 p-4 bg-base-200 rounded-lg">
                            <h4 className="text-lg font-semibold mb-2">Submitted By:</h4>
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-full">
                                        <img src={ product.owner?.photoURL || "https://i.ibb.co/L936N1j/male-avatar-profile-picture-vector.jpg" } alt={ product.owner?.name } />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold">{ product.owner?.name || "Unknown User" }</p>
                                    <p className="text-sm text-gray-500">{ product.owner?.email }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */ }
            <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <h3 className="text-2xl font-bold mb-6">User Reviews ({ reviews.length })</h3>
                { reviewsLoading ? (
                    <div className="text-center"><span className="loading loading-spinner"></span> Loading reviews...</div>
                ) : reviewsError ? (
                    <p className="text-red-500">Error loading reviews.</p>
                ) : reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                ) : (
                    <div className="space-y-6">
                        { reviews.map( review => (
                            <div key={ review._id } className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full">
                                            <img src={ review.reviewerImage || "https://i.ibb.co/L936N1j/male-avatar-profile-picture-vector.jpg" } alt={ review.reviewerName } />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{ review.reviewerName }</p>
                                        <div className="flex items-center text-yellow-500">
                                            { Array.from( { length: review.rating } ).map( ( _, i ) => <FaStar key={ i } /> ) }
                                            <span className="ml-1 text-gray-600">({ review.rating }.0)</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700">{ review.reviewDescription }</p>
                                <p className="text-xs text-gray-500 mt-2">Reviewed on: { new Date( review.createdAt ).toLocaleDateString() }</p>
                            </div>
                        ) ) }
                    </div>
                ) }
            </div>

            {/* Post Review Section */ }
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Post Your Review</h3>
                { !user ? (
                    <p className="text-gray-500 text-center">Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to post a review.</p>
                ) : (
                    <form onSubmit={ handleReviewSubmit } className="space-y-4">
                        {/* Reviewer Name (Read-Only) */ }
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Reviewer Name</span>
                            </label>
                            <input
                                type="text"
                                value={ user.displayName || "Loading Name..." }
                                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                                readOnly
                            />
                        </div>
                        {/* Reviewer Image (Read-Only) */ }
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Reviewer Image</span>
                            </label>
                            <img
                                src={ user.photoURL || "https://i.ibb.co/L936N1j/male-avatar-profile-picture-vector.jpg" }
                                alt="Reviewer"
                                className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 object-cover"
                            />
                        </div>
                        {/* Rating */ }
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Rating</span>
                            </label>
                            <div className="rating">
                                { [ 1, 2, 3, 4, 5 ].map( ( star ) => (
                                    <input
                                        key={ star }
                                        type="radio"
                                        name="rating-star"
                                        className="mask mask-star-2 bg-yellow-400"
                                        checked={ reviewFormData.rating === star }
                                        onChange={ () => handleRatingChange( star ) }
                                    />
                                ) ) }
                            </div>
                        </div>
                        {/* Review Description */ }
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Review Description</span>
                            </label>
                            <textarea
                                name="reviewDescription"
                                value={ reviewFormData.reviewDescription }
                                onChange={ handleReviewChange }
                                className="textarea textarea-bordered h-24"
                                placeholder="Share your thoughts about this product..."
                                required
                            ></textarea>
                        </div>
                        {/* Submit Button */ }
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary" disabled={ postReviewMutation.isPending }>
                                { postReviewMutation.isPending ? 'Posting Review...' : 'Submit Review' }
                            </button>
                        </div>
                    </form>
                ) }
            </div>
        </div>
    );
};

export default ProductDetailsPage;