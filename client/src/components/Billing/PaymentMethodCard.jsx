import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const PaymentMethodCard = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        // Depending on what we're doing (SetupIntent or PaymentIntent)
        // Here we'll just confirm a typical payment/subscription confirmation
        const { error } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
        } else {
            toast.success('Payment method verified & successful!');
            setLoading(false);
            if (onSuccess) onSuccess();
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Payment</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <PaymentElement />
                </div>
                <button
                    disabled={!stripe || loading}
                    className={`w-full flex justify-center py-2.5 px-4 rounded-md text-white font-medium ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        } transition duration-150 ease-in-out`}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Confirm Payment'
                    )}
                </button>
            </form>
        </div>
    );
};

export default PaymentMethodCard;
