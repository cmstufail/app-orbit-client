import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiArrowUp, FiFlag } from 'react-icons/fi';
import { FaStar, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios';

import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const ProductDetailsPage = () => {
    // Set the page title when the component mounts
    useEffect( () => {
        document.title = 'Product Details || AppOrbit';
    }, [] );

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [ reviewFormData, setReviewFormData ] = useState( {
        rating: 5,
        reviewDescription: '',
    } );

    const defaultAvatar = "https://i.ibb.co/1JthzCwR/character-default-avatar.png";

    const {
        data: product,
        isLoading: productLoading,
        isError: productError,
        error: productErrorObj
    } = useQuery( {
        queryKey: [ 'productDetails', id ],
        queryFn: async () => {
            if ( !id ) return null;
            console.log( `ProductDetailsPage: Attempting to fetch product details for ID: ${ id }` );
            try {
                const res = await axios.get( `${ import.meta.env.VITE_API_BASE_URL }/api/products/${ id }` );
                return res.data;
            } catch ( error ) {
                console.error( `ProductDetailsPage: Error fetching product ${ id } details:`, error.response?.data || error.message );
                throw new Error( error.response?.data?.message || error.message || 'Failed to load product details.' );
            }
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    } );

    const {
        data: reviews = [],
        isLoading: reviewsLoading,
        isError: reviewsError,
        error: reviewsErrorObj,
        refetch: refetchReviews
    } = useQuery( {
        queryKey: [ 'productReviews', id ],
        queryFn: async () => {
            if ( !id ) return [];
            console.log( `ProductDetailsPage: Attempting to fetch reviews for product ID: ${ id } from /api/reviews/product/${ id }` );
            try {
                const res = await axios.get( `${ import.meta.env.VITE_API_BASE_URL }/api/reviews/product/${ id }` );
                return res.data.reviews || res.data;
            } catch ( error ) {
                console.error( `ProductDetailsPage: Error fetching reviews for product ${ id }:`, error.response?.data || error.message );
                throw new Error( error.response?.data?.message || error.message || 'Failed to load reviews.' );
            }
        },
        enabled: !!id && !productLoading && !productError,
        staleTime: 0,
        cacheTime: 0,
        retry: 1,
    } );


    // Upvote mutation
    const upvoteMutation = useMutation( {
        mutationFn: async ( productId ) => {
            const res = await axiosSecure.patch( `/products/${ productId }/upvote` );
            return res.data;
        },
        onSuccess: ( data ) => {
            queryClient.invalidateQueries( [ 'productDetails', id ] );
            queryClient.invalidateQueries( [ 'featuredProducts' ] );
            queryClient.invalidateQueries( [ 'trendingProducts' ] );
            toast.success( data.message || 'Product upvoted successfully!' );
        },
        onError: ( err ) => {
            console.error( 'ProductDetailsPage: Upvote error:', err.response?.data || err.message );
            toast.error( err.response?.data?.message || 'Failed to upvote/downvote product.' );
        },
    } );

    // Report Product mutation
    const reportProductMutation = useMutation( {
        mutationFn: async ( { productId, reason } ) => {
            const res = await axiosSecure.post( `/products/${ productId }/report`, { reason } );
            return res.data;
        },
        onSuccess: () => {
            Swal.fire( {
                title: 'Report Submitted!',
                text: 'Thank you for reporting. Our moderators will review it soon.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            } );
            queryClient.invalidateQueries( [ 'productDetails', id ] );
        },
        onError: ( err ) => {
            console.error( 'ProductDetailsPage: Report error:', err.response?.data || err.message );
            Swal.fire( {
                title: 'Report Failed!',
                text: err.response?.data?.message || 'Failed to submit report. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                toast: true,
                position: 'top-end'
            } );
        },
    } );

    // Handle Upvote
    const handleUpvote = ( e ) => {
        e.preventDefault();
        if ( authLoading ) { toast( 'Loading user data, please wait...' ); return; }
        if ( !user ) { navigate( '/login', { state: { from: location } } ); return; }
        if ( product.owner.email === user.email ) {
            toast.error( "You cannot upvote your own product." );
            return;
        }
        upvoteMutation.mutate( id );
    };

    // Handle Report
    const handleReport = () => {
        if ( authLoading ) { toast( 'Loading user data, please wait...' ); return; }
        if ( !user ) { navigate( '/login', { state: { from: location } } ); return; }
        if ( product.owner.email === user.email ) {
            Swal.fire( {
                icon: 'info',
                title: 'Cannot Report Your Own Product',
                text: 'You cannot report your own product.',
                confirmButtonText: 'OK'
            } );
            return;
        }

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
            if ( result.isConfirmed ) {
                // Success/Error messages are handled by reportProductMutation's onSuccess/onError
                // No need for separate Swal.fire here
            }
        } );
    };

    // Review form handlers
    const handleReviewChange = ( e ) => {
        const { name, value } = e.target;
        setReviewFormData( ( prev ) => ( { ...prev, [ name ]: value } ) );
    };

    const handleRatingChange = ( newRating ) => {
        setReviewFormData( ( prev ) => ( { ...prev, rating: newRating } ) );
    };

    // Post Review mutation
    const postReviewMutation = useMutation( {
        mutationFn: async ( reviewData ) => {
            const res = await axiosSecure.post( '/reviews', reviewData );
            return res.data;
        },
        onSuccess: () => {
            Swal.fire( {
                icon: 'success',
                title: 'Review Posted!',
                text: 'Your review has been successfully submitted.',
                confirmButtonText: 'Awesome!',
                toast: true,
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false,
            } );
            setReviewFormData( { rating: 5, reviewDescription: '' } );
            queryClient.invalidateQueries( [ 'productReviews', id ] );
            queryClient.invalidateQueries( [ 'productDetails', id ] );
        },
        onError: ( err ) => {
            console.error( 'ProductDetailsPage: Error posting review (AxiosError):', err.response?.data || err.message );
            Swal.fire( {
                icon: 'error',
                title: 'Review Failed!',
                text: err.response?.data?.message || 'Failed to post review. Please try again.',
                confirmButtonText: 'OK',
                toast: true,
                position: 'top-end',
                timer: 3000,
            } );
        },
    } );

    const handleReviewSubmit = async ( e ) => {
        e.preventDefault();
        if ( authLoading ) { toast( 'Loading user data, please wait...' ); return; }
        if ( !user ) { navigate( '/login', { state: { from: location } } ); return; }

        const reviewerName = user.displayName || user.email || "Anonymous Reviewer";
        const reviewerImage = user.photoURL || defaultAvatar;

        if ( !reviewerName ) {
            toast.error( "User name is missing. Please update your profile name in Dashboard > My Profile before posting a review." );
            navigate( '/dashboard/my-profile' );
            return;
        }

        const reviewToSend = {
            productId: id,
            reviewerEmail: user.email,
            reviewerName: reviewerName,
            reviewerImage: reviewerImage,
            rating: reviewFormData.rating,
            reviewDescription: reviewFormData.reviewDescription,
        };

        postReviewMutation.mutate( reviewToSend );
    };

    if ( productLoading || authLoading ) {
        return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    if ( productError ) {
        return <div className="min-h-screen flex justify-center items-center text-red-500">Error: { productErrorObj?.message || 'Failed to fetch product details.' }</div>;
    }
    if ( !product ) {
        return <div className="min-h-screen flex justify-center items-center text-gray-500">Product not found.</div>;
    }

    const isOwner = user && product.owner && user.uid === product.owner.id;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Product Details Section */ }
            <div className="bg-base-200 text-base-content p-8 rounded-lg shadow-xl mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="md:w-1/2 py-5">
                        <img
                            src={ product.image }
                            alt={ product.name }
                            className="w-full h-96 object-contain rounded-lg shadow-md"
                            onError={ ( e ) => {
                                e.target.onerror = null;
                                e.target.src = defaultAvatar;
                                console.warn( `ProductDetailsPage: Image failed to load for product "${ product.name }". Using fallback.` );
                            } }
                        />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                        <h1 className="text-4xl font-extrabold text-base-content">{ product.name }</h1>
                        <p className="text-lg text-base-content">{ product.description }</p>
                        <div className="flex items-center gap-2 text-base-content text-opacity-70">
                            <span className="font-semibold">Tags:</span>
                            { product.tags.map( ( tag, index ) => (
                                <span key={ index } className="badge badge-outline badge-primary">{ tag }</span>
                            ) ) }
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">External Link:</span>
                            <a href={ product.externalLink } target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Visit Product
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-base-content text-opacity-70">
                            <span className="font-semibold">Owner:</span>
                            <div className="flex items-center gap-2">
                                <div className="avatar">
                                    <div className="w-8 h-8 rounded-full">
                                        <img src={ product.owner?.photoURL || defaultAvatar }
                                            alt={ product.owner?.name || "Owner" }
                                            className="object-cover" />
                                    </div>
                                </div>
                                <span>{ product.owner?.name || product.owner?.email || "Unknown" }</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-base-content text-opacity-70">
                            <span className="font-semibold">Posted On:</span>
                            <span>{ new Date( product.createdAt ).toLocaleDateString() }</span>
                        </div>
                        <div className="flex items-center gap-2 text-base-content text-opacity-70">
                            <span className="font-semibold">Upvotes:</span>
                            <span className="font-bold">{ product.upvotes }</span>
                        </div>
                        <div className="flex items-center gap-2 text-base-content text-opacity-70">
                            <span className="font-semibold">Average Rating:</span>
                            <span className="font-bold flex items-center gap-1">
                                { product.averageRating ? product.averageRating.toFixed( 1 ) : 'N/A' } <FaStar className="text-yellow-400" /> ({ product.reviewCount } reviews)
                            </span>
                        </div>

                        <div className="flex gap-4 mt-6">
                            { !isOwner && (
                                <button
                                    onClick={ handleUpvote }
                                    className="btn btn-primary btn-outline flex items-center gap-2"
                                    disabled={ upvoteMutation.isPending }
                                >
                                    <FiArrowUp /> { upvoteMutation.isPending ? 'Upvoting...' : 'Upvote' }
                                </button>
                            ) }
                            { !isOwner && (
                                <button
                                    onClick={ handleReport }
                                    className="btn btn-error btn-outline flex items-center gap-2"
                                    disabled={ reportProductMutation.isPending }
                                >
                                    <FiFlag /> { reportProductMutation.isPending ? 'Reporting...' : 'Report' }
                                </button>
                            ) }
                            { isOwner && (
                                <button className="btn btn-info" disabled>
                                    Your Product
                                </button>
                            ) }
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */ }
            <div className="bg-base-200 p-8 rounded-lg shadow-xl mb-8">
                <h3 className="text-2xl font-bold mb-6">User Reviews ({ reviews.length })</h3>
                { reviewsLoading ? (
                    <div className="text-center"><span className="loading loading-spinner loading-md"></span> Loading reviews...</div>
                ) : reviewsError ? (
                    <div className="text-center text-red-500">Error loading reviews: { reviewsErrorObj?.message }</div>
                ) : reviews.length === 0 ? (
                    <p className="text-center text-gray-500">No reviews yet. Be the first to review this product!</p>
                ) : (
                    <div className="space-y-6">
                        { reviews.map( review => (
                            <div key={ review._id } className="flex items-start gap-4 p-4 border rounded-lg shadow-sm">
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-full">
                                        <img
                                            src={ review.reviewerImage || defaultAvatar }
                                            alt={ review.reviewerName || "Reviewer" }
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">{ review.reviewerName }</h4>
                                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                        { Array.from( { length: review.rating } ).map( ( _, i ) => (
                                            <FaStar key={ i } />
                                        ) ) }
                                        { Array.from( { length: 5 - review.rating } ).map( ( _, i ) => (
                                            <FaStar key={ i } className="text-gray-300" />
                                        ) ) }
                                        <span className="text-gray-500 text-sm ml-2">{ review.rating } out of 5 stars</span>
                                    </div>
                                    <p className="text-gray-500">{ review.reviewDescription }</p>
                                    <p className="text-gray-500 text-sm mt-2">Reviewed on: { new Date( review.createdAt ).toLocaleDateString() }</p>
                                </div>
                            </div>
                        ) ) }
                    </div>
                ) }
            </div>
            <div className="text-center mt-6">
                <button
                    onClick={ () => refetchReviews() }
                    className="btn btn-sm btn-outline btn-info"
                    disabled={ reviewsLoading }
                >
                    <FaSyncAlt /> { reviewsLoading ? 'Refreshing...' : 'Refresh Reviews' }
                </button>
            </div>

            {/* Post Review Section */ }
            <div className="bg-base-200 p-8 rounded-lg shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Post Your Review</h3>
                { !user ? (
                    <p className="text-gray-500 text-center">Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to post a review.</p>
                ) : (
                    <form onSubmit={ handleReviewSubmit } className="space-y-4">
                        {/* Reviewer Name (Read-Only) */ }
                        <div className="form-control">
                            <label className="label"><span className="label-text">Reviewer Name</span></label>
                            <input
                                type="text"
                                value={ user.displayName || user.email || "Loading Name..." }
                                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                readOnly
                            />
                        </div>
                        {/* Reviewer Image (Read-Only) */ }
                        <div className="flex gap-3">
                            <label className="label"><span className="label-text">Reviewer Image</span></label>
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full">
                                    <img
                                        src={ user.photoURL || defaultAvatar }
                                        alt={ user.displayName || user.email || "Reviewer" }
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Rating */ }
                        <div className="flex gap-2 mb-7">
                            <label className="label"><span className="label-text">Rating</span></label>
                            <div className="rating">
                                { Array.from( { length: 5 } ).map( ( _, i ) => (
                                    <input key={ i } type="radio" name="rating-star" className="mask mask-star-2 w-4 h-6 bg-yellow-400" checked={ reviewFormData.rating === i + 1 } onChange={ () => handleRatingChange( i + 1 ) } />
                                ) ) }
                            </div>
                        </div>
                        {/* Review Description */ }
                        <div className="flex flex-col gap-1">
                            <label className="label"><span className="label-text">Review Description</span></label>
                            <textarea name="reviewDescription" value={ reviewFormData.reviewDescription } onChange={ handleReviewChange } className="textarea textarea-bordered h-24" placeholder="Share your thoughts about this product..." required></textarea>
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