import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import useAuth from './../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import CheckoutForm from './CheckoutForm';
import Spinner from '../../components/Shared/Spinner';


const stripePromise = loadStripe( import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY );

const CheckoutPage = () => {

    useEffect( () => {
        // Set the page title when the component mounts
        document.title = 'Checkout || AppOrbit';
    }, [] );

    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [ clientSecret, setClientSecret ] = useState( '' );
    const [ paymentAmount, setPaymentAmount ] = useState( 10 );
    const [ couponCode, setCouponCode ] = useState( '' );
    const [ appliedCoupon, setAppliedCoupon ] = useState( null );

    useEffect( () => {
        if ( authLoading || !user || paymentAmount === 0 ) return;

        const fetchClientSecret = async () => {
            setClientSecret( '' );
            toast.loading( 'Initializing payment gateway...' );

            try {
                const res = await axiosSecure.post( '/payments/create-payment-intent', {
                    amount: paymentAmount,
                    userEmail: user.email,
                    userName: user.displayName,
                } );
                setClientSecret( res.data.clientSecret );
                toast.dismiss();
                toast.success( 'Payment initialized.' );
            } catch ( error ) {
                toast.dismiss();
                toast.error( `Failed: ${ error.response?.data?.message || error.message }` );
                setClientSecret( null );
            }
        };

        fetchClientSecret();
    }, [ user, authLoading, axiosSecure, paymentAmount ] );

    const handleApplyCoupon = async () => {
        const trimmedCode = couponCode.trim();

        if ( !trimmedCode ) {
            toast.error( 'Please enter a coupon code.' );
            return;
        }
        if ( !user ) {
            toast( 'Please log in first.' );
            return;
        }

        try {
            const res = await axiosSecure.get( `/coupons/${ trimmedCode }` );
            const coupon = res.data;

            let discounted = paymentAmount - coupon.discountAmount;
            if ( discounted < 0 ) discounted = 0;

            setPaymentAmount( discounted );
            setAppliedCoupon( coupon );
            setClientSecret( '' );
            toast.success( `Coupon "${ coupon.couponCode }" applied!` );

        } catch ( error ) {
            setAppliedCoupon( null );
            setPaymentAmount( 10 );
            toast.error( `Invalid coupon: ${ error.response?.data?.message || error.message }` );
        }
    };

    if ( authLoading ) {
        return (
            <div className="text-center py-10 flex flex-col items-center justify-center text-ui-text-primary dark:text-ui-text-dark">
                <Spinner className="mb-2" />
                <p>Verifying profile... Please wait.</p>
            </div>
        );
    }

    if ( !user ) {
        return (
            <div className="text-center py-10 text-ui-text-secondary dark:text-ui-text-muted flex flex-col items-center justify-center">
                <p>You must be logged in to view this page.</p>
                <Link to="/login" className="text-link-active-light dark:text-link-active-dark underline mt-2">
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center mb-6">Membership Checkout</h2>
            <div className="max-w-md mx-auto bg-base-200 p-8 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-3">
                    Total: <span className="text-primary">${ paymentAmount.toFixed( 2 ) }</span>
                </h3>

                { appliedCoupon && (
                    <p className="text-success text-sm mb-4">
                        Coupon "{ appliedCoupon.couponCode }" applied! You save ${ appliedCoupon.discountAmount.toFixed( 2 ) }.
                    </p>
                ) }

                {/* Coupon Input */ }
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text">Have a coupon code?</span>
                    </label>
                    <div className="join w-full">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            className="input input-bordered join-item w-full"
                            value={ couponCode }
                            onChange={ ( e ) => setCouponCode( e.target.value ) }
                            disabled={ !!appliedCoupon }
                        />
                        <button
                            className="btn btn-primary join-item"
                            onClick={ handleApplyCoupon }
                            disabled={ !couponCode || !!appliedCoupon }
                        >
                            Apply
                        </button>
                    </div>
                </div>

                {/* Stripe Payment Form */ }
                { paymentAmount === 0 ? (
                    <p className="text-center text-success">
                        🎉 100% discount applied. No payment necessary.
                    </p>
                ) : clientSecret ? (
                    <Elements options={ { clientSecret } } stripe={ stripePromise }>
                        <CheckoutForm
                            paymentAmount={ paymentAmount }
                            couponCodeUsed={ appliedCoupon?.couponCode || null }
                            couponDiscount={ appliedCoupon?.discountAmount || 0 }
                            membershipPlan={ { planName: 'Monthly Subscription', planId: 'monthly_basic' } }
                            clientSecret={ clientSecret }

                        />
                    </Elements>
                ) : (
                    <div className="text-center py-4">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) }
            </div>
        </div>
    );
};

export default CheckoutPage;
