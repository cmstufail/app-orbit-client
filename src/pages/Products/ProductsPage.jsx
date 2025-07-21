import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from '../Home/FeaturedProducts/ProductCard';

const fetchProducts = async ( page, limit, search ) => {
    let url = `http://localhost:5000/api/products?page=${ page }&limit=${ limit }`;
    if ( search ) {
        url += `&search=${ search }`;
    }
    const { data } = await axios.get( url );
    return data;
};

const ProductsPage = () => {
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

    const handlePageChange = ( page ) => {
        if ( page >= 1 && page <= totalPages ) {
            setCurrentPage( page );
        }
    };


    if ( isLoading ) {
        return (
            <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading products...</p>
            </div>
        );
    }

    if ( isError ) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>Error loading products: { error.message }</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
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

            {/* Product Grid */ }
            { products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <p>No products found matching your criteria. Try a different search or clear the filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            className="join-item btn btn-primary"
                            onClick={ () => handlePageChange( currentPage - 1 ) }
                            disabled={ currentPage === 1 }
                        >
                            Previous
                        </button>
                        { [ ...Array( totalPages ) ].map( ( _, index ) => (
                            <button
                                key={ index }
                                className={ `join-item btn ${ currentPage === index + 1 ? 'btn-active' : 'btn-ghost' }` }
                                onClick={ () => handlePageChange( index + 1 ) }
                            >
                                { index + 1 }
                            </button>
                        ) ) }
                        <button
                            className="join-item btn btn-primary"
                            onClick={ () => handlePageChange( currentPage + 1 ) }
                            disabled={ currentPage === totalPages }
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) }
            {/* Display total product count */ }
            <div className="text-center text-lg text-gray-700 mb-6">
                { totalProducts > 0 ? (
                    <p>Showing { products.length } of { totalProducts } products.</p>
                ) : (
                    <p>No products found matching your criteria.</p>
                ) }
            </div>
        </div>
    );
};

export default ProductsPage;