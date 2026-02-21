import React, { useState } from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cx(...args) {
    return twMerge(clsx(...args));
}

const PricingCard = ({ onSelectPlan, loadingPriceId }) => {
    const [isYearly, setIsYearly] = useState(false);

    const tiers = [
        {
            id: 'price_1T2wskGmD8z01ZRMkbABeHg4',
            name: 'Basic',
            price: isYearly ? '$99' : '$9',
            period: isYearly ? '/year' : '/month',
            description: 'Ideal for individuals starting out.',
            features: ['1 Project', 'Basic Support', '10GB Storage'],
            mostPopular: false,
        },
        {
            id: 'price_1T2wslGmD8z01ZRMPpFXmZkj',
            name: 'Pro',
            price: isYearly ? '$299' : '$29',
            period: isYearly ? '/year' : '/month',
            description: 'Perfect for small teams and growing businesses.',
            features: ['Unlimited Projects', 'Priority Support', '100GB Storage', 'Advanced Analytics'],
            mostPopular: true,
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-0">
            <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Simple, transparent pricing
                </h2>
                <p className="mt-2 text-sm text-gray-400">No hidden fees. Cancel anytime.</p>

                {/* Toggle */}
                <div className="mt-6 flex justify-center">
                    <div className="inline-flex items-center bg-gray-100 rounded-full p-1 gap-1">
                        {['Monthly', 'Yearly'].map((period) => {
                            const active = period === 'Yearly' ? isYearly : !isYearly;
                            return (
                                <motion.button
                                    key={period}
                                    type="button"
                                    className={cx(
                                        'relative px-5 py-1.5 text-sm font-semibold rounded-full transition-colors focus:outline-none',
                                        active ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                                    )}
                                    onClick={() => setIsYearly(period === 'Yearly')}
                                    layout
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="toggle-pill"
                                            className="absolute inset-0 bg-indigo-600 rounded-full shadow"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{period}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {tiers.map((tier) => (
                    <motion.div
                        key={tier.id}
                        variants={cardVariants}
                        whileHover={{ y: -4, boxShadow: '0 12px 32px -8px rgba(99,102,241,0.18)' }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        className={cx(
                            'relative rounded-2xl p-7 flex flex-col border transition-colors',
                            tier.mostPopular
                                ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-lg shadow-indigo-100'
                                : 'border-gray-200 bg-white shadow-sm'
                        )}
                    >
                        {tier.mostPopular && (
                            <motion.span
                                className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                            >
                                Most Popular
                            </motion.span>
                        )}

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <motion.span
                                    className="text-5xl font-black text-gray-900"
                                    key={tier.price}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {tier.price}
                                </motion.span>
                                <span className="text-gray-400 font-medium">{tier.period}</span>
                            </div>
                            <p className="mt-3 text-sm text-gray-500">{tier.description}</p>

                            <ul className="mt-6 space-y-3">
                                {tier.features.map((feature, i) => (
                                    <motion.li
                                        key={feature}
                                        className="flex items-center gap-2.5"
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
                                    >
                                        <div className="flex-shrink-0 h-4.5 w-4.5 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-green-600" />
                                        </div>
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8">
                            <motion.button
                                disabled={loadingPriceId === tier.id}
                                onClick={() => onSelectPlan(tier.id)}
                                className={cx(
                                    'w-full flex justify-center items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-md',
                                    tier.mostPopular ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-gray-800 hover:bg-gray-900 shadow-gray-200',
                                    loadingPriceId === tier.id && 'opacity-70 cursor-not-allowed'
                                )}
                                whileTap={loadingPriceId !== tier.id ? { scale: 0.97 } : {}}
                                whileHover={loadingPriceId !== tier.id ? { scale: 1.02 } : {}}
                            >
                                {loadingPriceId === tier.id ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Get started'
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default PricingCard;
