import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import ProductCard from '../FeaturedProducts/ProductCard';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("CRITICAL ERROR: VITE_API_BASE_URL is not defined! Check your .env.local or Vercel/Firebase Environment Variables.");
}

const fetchTrendingProducts = async () => {
    const { data } = await axios.get( `${API_BASE_URL}/api/products/trending` );
    return data;
};



const TrendingProductsSection = () => {
    const {
        data: products = [],
        isLoading,
        isError,
        error
    } = useQuery( {
        queryKey: [ 'trendingProducts' ],
        queryFn: fetchTrendingProducts,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    } );

    if ( isLoading ) {
        return (
            <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading trending products...</p>
            </div>
        );
    }

    if ( isError ) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>Error loading trending products: { error.message }</p>
                <p>Please check your backend server and network connection.</p>
            </div>
        );
    }

    if ( !products || products.length === 0 ) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No trending products to display at the moment.</p>
                <p>Ensure products have `status: "accepted"` and some `upvotes` in your database.</p>
            </div>
        );
    }

    return (
        <div className="py-12 bg-base-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Trending Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    { products.map( product => (
                        <ProductCard key={ product._id } product={ product } />
                    ) ) }
                </div>
            </div>
        </div>
    );
};

export default TrendingProductsSection;