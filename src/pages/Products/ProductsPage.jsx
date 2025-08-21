import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// components
import ProductCard from '../Home/FeaturedProducts/ProductCard';
import Spinner from './../../components/Shared/Spinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if ( !API_BASE_URL ) {
    console.error( "CRITICAL ERROR: VITE_API_BASE_URL is not defined! Check your .env.local or Vercel/Firebase Environment Variables." );
}

const fetchProducts = async ( page, limit, search ) => {
    let url = `${ API_BASE_URL }/api/products?page=${ page }&limit=${ limit }`;
    if ( search ) {
        url += `&search=${ search }`;
    }
    const { data } = await axios.get( url );
    return data;
};

const ProductsPage = () => {
    useEffect( () => {
        document.title = 'Products || AppOrbit';
    }, [] );

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams( location.search );
    const initialPage = parseInt( queryParams.get( 'page' ) ) || 1;
    const initialSearch = queryParams.get( 'search' ) || '';

    const [ currentPage, setCurrentPage ] = useState( initialPage );
    const [ searchQuery, setSearchQuery ] = useState( initialSearch );
    const [ searchInput, setSearchInput ] = useState( initialSearch );

    const productsPerPage = 6;

    useEffect( () => {
        const params = new URLSearchParams();
        if ( currentPage !== 1 ) {
            params.set( 'page', currentPage );
        }
        if ( searchQuery ) {
            params.set( 'search', searchQuery );
        }
        navigate( `?${ params.toString() }`, { replace: true } );
    }, [ currentPage, searchQuery, navigate ] );

    const {
        data: productData,
        isLoading,
        isError,
        error
    } = useQuery( {
        queryKey: [ 'allProducts', currentPage, searchQuery ],
        queryFn: () => fetchProducts( currentPage, productsPerPage, searchQuery ),
        staleTime: 1000 * 60,
        keepPreviousData: true,
    } );

    const products = productData?.products || [];
    const totalPages = productData?.totalPages || 1;
    const totalProducts = productData?.totalProducts || 0;

    const handleSearchSubmit = ( e ) => {
        e.preventDefault();
        setCurrentPage( 1 );
        setSearchQuery( searchInput );
    };

    const resetFilters = () => {
        setCurrentPage( 1 );
        setSearchQuery( '' );
        setSearchInput( '' );
    };

    const handlePageChange = ( page ) => {
        if ( page >= 1 && page <= totalPages ) {
            setCurrentPage( page );
        }
    };

    if ( isLoading ) {
        return (
            <div className="text-center py-10 flex flex-col items-center justify-center text-ui-text-primary dark:text-ui-text-dark">
                <Spinner className="mb-2" />
                <p>Loading products... Please wait.</p>
            </div>
        );
    }

    if ( isError ) {
        console.error( "There was a problem loading the product.:", error );
        return (
            <div className="text-center py-10 text-error-light dark:text-error-dark flex flex-col items-center justify-center">
                <p>Sorry! Products cannot be loaded at this time.</p>
                <p className="text-sm mt-2">Please try again in a while.</p>
            </div>
        );
    }

    return (
        <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">All Accepted Products</h2>

            {/* Search Bar */ }
            <form onSubmit={ handleSearchSubmit } className="max-w-xl mx-auto mb-8">
                <div className="form-control">
                    <div className="input-group flex">
                        <input
                            type="text"
                            placeholder="Search by tag..."
                            className="input input-bordered w-full"
                            value={ searchInput }
                            onChange={ ( e ) => setSearchInput( e.target.value ) }
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </div>
                </div>
            </form>

            {/* Product Count and Reset Option */ }
            <div className="text-center mb-6" aria-live="polite">
                { totalProducts > 0 ? (
                    <p className="text-lg">
                        Showing <span className="font-semibold">{ products.length }</span> of{ " " }
                        <span className="font-semibold">{ totalProducts }</span> products
                        { products.length < totalProducts && (
                            <span className="block text-sm mt-1">
                                (Use navigation below to see more)
                            </span>
                        ) }
                    </p>
                ) : (
                    <p className="text-lg">
                        No products found matching your criteria.{ " " }
                        <button
                            onClick={ resetFilters }
                            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                        >
                            Reset filters
                        </button>
                    </p>
                ) }
            </div>

            {/* Product Grid */ }
            { products.length === 0 ? (
                <div className="text-center py-10">
                    <p>No products found matching your criteria. Try a different search or clear the filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    { products.map( product => (
                        <ProductCard
                            key={ product._id }
                            product={ product }
                            showUpvoteButton={ false }
                        />
                    ) ) }
                </div>
            ) }

            {/* Pagination */ }
            { totalPages > 1 && (
                <div className="flex justify-center mt-10">
                    <div className="join">
                        <button
                            className={ `join-item btn mr-2 ${ currentPage === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-focus text-white'
                                }` }
                            onClick={ () => handlePageChange( currentPage - 1 ) }
                            disabled={ currentPage === 1 }
                            aria-label="Previous page"
                        >
                            Previous
                        </button>
                        { [ ...Array( totalPages ) ].map( ( _, index ) => (
                            <button
                                key={ index }
                                className={ `join-item btn ${ currentPage === index + 1 ? 'btn-active' : 'btn-ghost' }` }
                                onClick={ () => handlePageChange( index + 1 ) }
                                aria-label={ `Go to page ${ index + 1 }` }
                            >
                                { index + 1 }
                            </button>
                        ) ) }
                        <button
                            className="join-item btn ml-2 bg-primary hover:bg-primary-focus text-white dark:text-white disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                            onClick={ () => handlePageChange( currentPage + 1 ) }
                            disabled={ currentPage === totalPages }
                            aria-label="Next page"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) }
        </div>
    );
};

export default ProductsPage;