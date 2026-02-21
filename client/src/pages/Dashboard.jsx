import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchInvoices, cancelUserSubscription, fetchActiveSubscription, fetchUpcomingInvoice } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import InvoiceTable from '../components/Billing/InvoiceTable';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.12 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const Dashboard = () => {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [upcomingInvoice, setUpcomingInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const customerId = user?.stripeCustomerId;

                if (!customerId) {
                    setInvoices([]);
                    setLoading(false);
                    return;
                }

                const [invoicesData, subData] = await Promise.all([
                    fetchInvoices(customerId),
                    fetchActiveSubscription(customerId)
                ]);

                if (invoicesData && invoicesData.invoices) {
                    setInvoices(invoicesData.invoices);
                }

                if (subData && subData.subscription) {
                    setSubscription(subData.subscription);

                    if (subData.subscription.status === 'active' || subData.subscription.status === 'trialing') {
                        try {
                            const upcomingData = await fetchUpcomingInvoice(customerId);
                            setUpcomingInvoice(upcomingData);
                        } catch (err) {
                            console.error("Could not fetch upcoming invoice data", err);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load billing dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        loadInvoices();
    }, [user]);

    const handleCancelPlan = async () => {
        setCancelLoading(true);
        try {
            const subId = subscription?.stripeSubscriptionId;
            if (!subId) throw new Error("Could not find subscription ID");

            await cancelUserSubscription(subId);
            toast.success('Subscription cancelled successfully.');
            setSubscription({ ...subscription, status: 'canceled' });
            setShowModal(false);
        } catch (error) {
            toast.error(error.message || 'Failed to cancel subscription.');
        } finally {
            setCancelLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <motion.div
                className="py-6 space-y-8"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header row */}
                <motion.div variants={cardVariants} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="mt-0.5 text-sm text-gray-400">Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</p>
                    </div>

                    {subscription?.status === 'active' && (
                        <motion.button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Cancel Plan
                        </motion.button>
                    )}
                </motion.div>

                {/* Canceled banner */}
                <AnimatePresence>
                    {subscription?.status === 'canceled' && (
                        <motion.div
                            className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-xl"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-sm text-amber-700 font-medium">
                                Your subscription has been canceled. You will continue to have access until the end of your billing cycle.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Upcoming Invoice */}
                <AnimatePresence>
                    {!loading && subscription && upcomingInvoice && subscription.status === 'active' && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="bg-gradient-to-br from-indigo-500 to-violet-600 p-6 rounded-2xl shadow-lg shadow-indigo-100 text-white"
                        >
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-3">Upcoming Invoice</p>
                            <div className="flex flex-col sm:flex-row sm:space-x-16">
                                <div>
                                    <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Amount Due</p>
                                    <p className="text-4xl font-black mt-1">${(upcomingInvoice.amount / 100).toFixed(2)}</p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Next Billing Date</p>
                                    <p className="text-xl font-semibold mt-1">
                                        {upcomingInvoice.date ? new Date(upcomingInvoice.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Billing History */}
                <motion.section
                    variants={cardVariants}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Billing History</h2>
                    <InvoiceTable invoices={invoices} loading={loading} />
                </motion.section>

                {/* Confirmation Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center px-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Backdrop */}
                            <motion.div
                                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
                                onClick={() => setShowModal(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />

                            {/* Modal card */}
                            <motion.div
                                className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                                        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Cancel Subscription</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Are you sure you want to cancel your plan? You will still be billed for the current cycle.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-row-reverse gap-3">
                                    <motion.button
                                        type="button"
                                        disabled={cancelLoading}
                                        className="inline-flex justify-center rounded-xl border border-transparent px-4 py-2 bg-red-600 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none disabled:opacity-50 transition-colors"
                                        onClick={handleCancelPlan}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        {cancelLoading ? 'Canceling...' : 'Yes, cancel'}
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        className="inline-flex justify-center rounded-xl border border-gray-200 px-4 py-2 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                                        onClick={() => setShowModal(false)}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Go back
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </DashboardLayout>
    );
};

export default Dashboard;
