import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaTag, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// components
import Spinner from '../../../components/Shared/Spinner';
import { useTheme } from '../../../contexts/ThemeContext';
import Container from '../../../components/Container';


const fetchValidCoupons = async () => {
    const { data } = await axios.get( `${ import.meta.env.VITE_API_BASE_URL }/api/coupons/valid` );
    return data;
};

const CouponSlider = () => {

    const { theme } = useTheme();

    const [ currentIndex, setCurrentIndex ] = useState( 0 );
    const sectionRef = useRef( null );

    const {
        data: coupons = [],
        isLoading,
        isError
    } = useQuery( {
        queryKey: [ 'validCoupons' ],
        queryFn: fetchValidCoupons,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: true,
    } );

    useEffect( () => {
        if ( coupons.length > 1 ) {
            const interval = setInterval( () => {
                setCurrentIndex( ( prevIndex ) => ( prevIndex + 1 ) % coupons.length );
            }, 5000 );
            return () => clearInterval( interval );
        }
    }, [ coupons ] );

    if ( isLoading ) {
        return <Spinner />
    }

    if ( isError ) {
        return (
            <div className="text-center py-8 text-error-light dark:text-error-dark">
                <p>Sorry! The coupons cannot be loaded.</p>
                <p className="text-sm mt-2">Please try again in a while.</p>
            </div>
        );
    }

    if ( !coupons || coupons.length === 0 ) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No active coupons at the moment. Check back soon!</p>
            </div>
        );
    }

    const formatDate = ( dateString ) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date( dateString ).toLocaleDateString( undefined, options );
    };

    return (
        <Container>
            <div ref={ sectionRef }
                className={ `py-12 my-12 ${ theme === 'dark'
                    ? 'bg-gradient-to-r from-gray-800 to-gray-900'
                    : 'bg-gradient-to-r from-purple-600 to-pink-400'
                    } text-white overflow-hidden rounded-lg` }>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-ui-text-on-gradient dark:text-ui-text-on-gradient-dark">Exclusive Offers!</h2>

                    <div className="relative w-full max-w-xl mx-auto py-4 h-48 sm:h-64 md:h-64 lg:h-72">
                        { coupons.map( ( coupon, index ) => (
                            <div
                                key={ coupon._id }
                                className={ `absolute top-0 left-0 w-full h-full p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center
                        transition-opacity duration-1000 ease-in-out ${ index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }` }
                            >
                                <div className="bg-coupon-card-light dark:bg-coupon-card-dark text-base-content-light dark:text-base-content-dark rounded-lg shadow-xl p-4 sm:p-6 md:p-8 w-full h-full flex flex-col justify-center items-center">
                                    <FaTag className="text-3xl sm:text-4xl text-coupon-icon-light dark:text-coupon-icon-dark mb-2 sm:mb-3" />
                                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-coupon-discount-light dark:text-coupon-discount-dark mb-2">
                                        { coupon.discountAmount }% OFF!
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-bold text-coupon-text-muted-light dark:text-coupon-text-muted-dark text-opacity-70 mb-2"> { coupon.couponCode }</p>
                                    <p className="text-base sm:text-lg text-coupon-text-muted-light dark:text-coupon-text-muted-dark text-opacity-70 mb-2"> { coupon.couponDescription }</p>
                                    <div className="flex items-center text-sm sm:text-base text-coupon-text-muted-light dark:text-coupon-text-muted-dark text-opacity-70 mb-1">
                                        <FaCalendarAlt className="mr-1" /> Expires: { formatDate( coupon.expiryDate ) }
                                    </div>
                                    <button
                                        onClick={ () => { navigator.clipboard.writeText( coupon.couponCode ); toast.success( 'Coupon code copied!' ); } }
                                        className="btn btn-outline btn-xs sm:btn-sm"
                                    >
                                        Copy code
                                    </button>
                                </div>
                            </div>
                        ) ) }
                    </div>

                    { coupons.length > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            { coupons.map( ( _, index ) => (
                                <button
                                    key={ index }
                                    onClick={ () => setCurrentIndex( index ) }
                                    className={ `h-3 w-3 rounded-full -mt-8 ${ index === currentIndex ? 'bg-coupon-dot-active' : 'bg-coupon-dot-inactive' }` }
                                    aria-label={ `Go to slide ${ index + 1 }` }
                                />
                            ) ) }
                        </div>
                    ) }

                    <div className="text-center mt-8">
                        <Link to="/dashboard/checkout" className="btn btn-outline">Get a membership</Link>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default CouponSlider;