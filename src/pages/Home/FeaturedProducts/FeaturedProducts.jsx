import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from './ProductCard';

const fetchFeaturedProducts = async () => {
    const { data } = await axios.get( `${ import.meta.env.VITE_API_BASE_URL }/api/products/featured` );
    return data;
};

const FeaturedProducts = () => {
    const {
        data: products = [],
        isLoading,
        isError,
        error
    } = useQuery( {
        queryKey: [ 'featuredProducts' ],
        queryFn: fetchFeaturedProducts,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
    } );

    if ( isLoading ) {
        return (
            <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading featured products...</p>
            </div>
        );
    }

    if ( isError ) {
        console.error( "FeaturedProducts: Displaying error message. Full error object:", error );
        return (
            <div className="text-center py-10 text-red-500">
                <p>Error loading featured products: { error.message }</p>
                <p>Please check your backend server's `/api/products/featured` endpoint and network connection.</p>
            </div>
        );
    }

    if ( !products || products.length === 0 ) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No featured products to display at the moment.</p>
                <p>Please ensure products have `isFeatured: true` and `status: "accepted"` in your database.</p>
            </div>
        );
    }

    return (
        <div className="py-12 bg-base-200">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    { products.map( product => (
                        <ProductCard
                            key={ product._id }
                            product={ product }
                            showUpvoteButton={ true }
                        />
                    ) ) }
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;