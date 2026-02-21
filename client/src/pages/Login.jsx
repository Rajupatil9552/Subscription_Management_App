import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const res = await login(email, password);
        setLoading(false);

        if (res && res.success) {
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } else {
            setErrorMsg(res?.message || 'Invalid Credentials');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Subtle background blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <motion.div
                className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/60"
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Brand */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">SubApp</span>
                    <h2 className="mt-3 text-2xl font-bold text-gray-900">Welcome back</h2>
                    <p className="mt-1 text-sm text-gray-500">Sign in to your account to continue</p>
                </motion.div>

                {errorMsg && (
                    <motion.div
                        className="bg-red-50 p-3 rounded-lg text-sm text-red-600 border border-red-200"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {errorMsg}
                    </motion.div>
                )}

                <motion.form
                    className="mt-6 space-y-5"
                    onSubmit={handleSubmit}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-4 py-2.5 border border-gray-200 text-gray-900 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent sm:text-sm transition-all"
                            placeholder="you@example.com"
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-4 py-2.5 border border-gray-200 text-gray-900 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent sm:text-sm transition-all"
                            placeholder="••••••••"
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`relative w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-200`}
                            whileTap={!loading ? { scale: 0.97 } : {}}
                            whileHover={!loading ? { scale: 1.01 } : {}}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </motion.button>
                    </motion.div>
                </motion.form>

                <motion.div
                    className="text-center text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-gray-500">Don't have an account? </span>
                    <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign up</Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
