import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import ProductCard from './ProductCard';
import Spinner from '../../../components/Shared/Spinner'
import Container from '../../../components/Container';


const fetchFeaturedProducts = async () => {
    const { data } = await axios.get( `${ import.meta.env.VITE_API_BASE_URL }/api/products/featured` );
    return data;
};

const FeaturedProducts = () => {
    const {
        data: products = [],
        isLoading,
        isError
    } = useQuery( {
        queryKey: [ 'featuredProducts' ],
        queryFn: fetchFeaturedProducts,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
    } );

    if ( isLoading ) {
        return <Spinner />
    }

    if ( isError ) {
        return (
            <div className="text-center py-10 text-error-light dark:text-error-dark">
                <p>Sorry! Featured products cannot be loaded.</p>
                <p className="text-sm mt-2">Please try again in a while.</p>
            </div>
        );
    }

    if ( !products || products.length === 0 ) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No featured products to display at the moment.</p>
            </div>
        );
    }

    return (
        <Container>
            <div className="py-12 mt-12 bg-light-section-bg dark:bg-dark-section-bg shadow-md">
                <div>
                    <h2 className="text-3xl font-bold text-center mb-8 text-ui-text-primary dark:text-ui-text-dark">Featured Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </Container>
    );
};

export default FeaturedProducts;