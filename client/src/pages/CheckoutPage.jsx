import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { motion } from 'framer-motion';

// Initialize Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
        } else {
            toast.success('Payment successful!');
            navigate('/dashboard');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Complete your payment</h3>
            <p className="text-sm text-gray-400 mb-6">Secure checkout powered by Stripe</p>
            <div className="mb-6">
                <PaymentElement />
            </div>
            <motion.button
                disabled={!stripe || loading}
                className={`w-full flex justify-center py-2.5 px-4 rounded-xl text-white font-semibold text-sm transition-colors ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} shadow-md shadow-indigo-100`}
                whileTap={!loading ? { scale: 0.98 } : {}}
                whileHover={!loading ? { scale: 1.01 } : {}}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Processing...
                    </span>
                ) : (
                    'Confirm Payment'
                )}
            </motion.button>
        </form>
    );
};

const CheckoutPage = () => {
    const location = useLocation();
    const clientSecret = location.state?.clientSecret;

    if (!clientSecret) {
        return <Navigate to="/pricing" replace />;
    }

    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance };

    return (
        <DashboardLayout>
            <motion.div
                className="py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
                    <p className="mt-1 text-sm text-gray-400">One last step to get started</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
                >
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
};

export default CheckoutPage;
