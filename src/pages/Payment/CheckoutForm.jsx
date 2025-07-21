import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({
  paymentAmount,
  couponCodeUsed,
  couponDiscount,
  membershipPlan,
  clientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [cardError, setCardError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (!clientSecret) return;
    console.log('✅ Stripe clientSecret ready.');
  }, [clientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret || processing) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setCardError('');
    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email: user?.email || 'anonymous@example.com',
          name: user?.displayName || 'Anonymous',
        },
      },
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
      toast.error(`Payment failed: ${error.message}`);
    } else {
      setTransactionId(paymentIntent.id);

      if (paymentIntent.status === 'succeeded') {
        const payment = {
          paymentIntentId: paymentIntent.id,
          userEmail: user.email,
          userName: user.displayName,
          amount: paymentAmount,
          couponCodeUsed,
          couponDiscount,
          membershipPlan,
          currency: paymentIntent.currency,
          status: 'succeeded',
        };

        try {
          const res = await axiosSecure.post('/payments/confirm-payment', payment);
          if (res.data.message === 'Payment successful and membership updated!') {
            toast.success('✅ Payment successful! Membership activated.');
            queryClient.invalidateQueries(['dbUser', user?.email]);
            queryClient.invalidateQueries(['myProducts', user?.email]);
            navigate('/dashboard/my-profile');
          } else {
            toast.warn(res.data.message || 'Payment done, membership update unknown.');
          }
        } catch (backendError) {
          toast.error(
            `Backend error: ${backendError.response?.data?.message || backendError.message}`
          );
        } finally {
          setProcessing(false);
        }
      } else {
        setProcessing(false);
        toast.error(`Unexpected status: ${paymentIntent.status}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h4 className="text-xl font-semibold mb-4">Payment Details</h4>
      <p className="mb-4 text-gray-700">
        You will be charged:{' '}
        <span className="font-bold text-primary">${paymentAmount.toFixed(2)}</span>
      </p>

      {/* Stripe CardElement */}
      <div className="border border-gray-300 rounded-md p-4 mb-4 bg-white">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {cardError && <p className="text-red-500 text-sm mb-2">{cardError}</p>}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={!stripe || !elements || processing || !clientSecret}
      >
        {processing ? 'Processing...' : `Pay $${paymentAmount.toFixed(2)}`}
      </button>

      {transactionId && (
        <p className="text-success text-sm mt-4">
          ✅ Payment successful! Transaction ID: {transactionId}
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;
