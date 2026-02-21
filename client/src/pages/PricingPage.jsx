import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { initiateSubscription, createCustomer } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PricingCard from '../components/Billing/PricingCard';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { motion } from 'framer-motion';

const PricingPage = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useAuth();
    const [loadingPriceId, setLoadingPriceId] = useState(null);

    const handleSubscribe = async (priceId) => {
        if (!user) {
            toast.error('Please log in first.');
            return;
        }

        setLoadingPriceId(priceId);
        try {
            let customerId = user.stripeCustomerId;

            if (!customerId) {
                const customerData = await createCustomer({
                    name: user.name,
                    email: user.email,
                    userId: user.id
                });

                if (customerData && customerData.customerId) {
                    customerId = customerData.customerId;

                    if (dispatch) {
                        dispatch({
                            type: 'USER_LOADED',
                            payload: {
                                user: { ...user, stripeCustomerId: customerId }
                            }
                        });
                    }
                } else {
                    throw new Error('Could not create Stripe customer.');
                }
            }

            const data = await initiateSubscription(priceId, customerId);

            if (data && data.clientSecret) {
                navigate('/checkout', { state: { clientSecret: data.clientSecret } });
            } else {
                toast.error('Failed to retrieve client secret');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to initiate subscription');
            console.error(error);
        } finally {
            setLoadingPriceId(null);
        }
    };

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
                >
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Subscription Plans</h1>
                    <p className="mt-1 text-sm text-gray-400">Choose a plan that works best for you</p>
                </motion.div>
                <PricingCard onSelectPlan={handleSubscribe} loadingPriceId={loadingPriceId} />
            </motion.div>
        </DashboardLayout>
    );
};

export default PricingPage;
