import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { User, Mail, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full min-h-[50vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                        <p className="text-gray-400 text-sm font-medium">Loading profile...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <motion.div
                className="py-6 max-w-3xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Page heading */}
                <motion.div variants={itemVariants}>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
                    <p className="mt-1 text-sm text-gray-400">Manage your account information.</p>
                </motion.div>

                {/* Avatar + name card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="relative px-6 py-8 sm:p-10 bg-gradient-to-br from-indigo-50 via-violet-50 to-blue-50">
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 opacity-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 opacity-40 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />

                        <div className="relative flex items-center space-x-6">
                            <motion.div
                                className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-xl ring-4 ring-white"
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
                            >
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{user.name}</h2>
                                <p className="mt-1 text-sm text-indigo-600 font-medium flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                                    Active Member
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Details card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden"
                >
                    {[
                        {
                            icon: User,
                            label: 'Full Name',
                            value: user.name,
                            mono: false,
                        },
                        {
                            icon: Mail,
                            label: 'Email Address',
                            value: user.email,
                            mono: false,
                        },
                        {
                            icon: CreditCard,
                            label: 'Stripe Customer ID',
                            value: user.stripeCustomerId || 'No payment method attached',
                            mono: !!user.stripeCustomerId,
                        },
                    ].map(({ icon: Icon, label, value, mono }, index) => (
                        <motion.div
                            key={label}
                            className="flex items-center gap-5 px-6 py-5 group hover:bg-indigo-50/40 transition-colors cursor-default"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + index * 0.1, duration: 0.35, ease: 'easeOut' }}
                        >
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                                <p className={`mt-0.5 text-sm font-semibold text-gray-800 ${mono ? 'font-mono bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200 inline-block' : ''}`}>
                                    {value}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
};

export default Profile;
