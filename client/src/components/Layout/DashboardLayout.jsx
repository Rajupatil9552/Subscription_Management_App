import React, { useState } from 'react';
import { Home, CreditCard, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Billing', icon: CreditCard, href: '/pricing' },
    { name: 'Profile', icon: UserIcon, href: '/profile' },
];

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const NavLink = ({ item, mobile = false }) => {
        const isActive = location.pathname === item.href;
        return (
            <motion.a
                href={item.href}
                onClick={(e) => { e.preventDefault(); navigate(item.href); if (mobile) setSidebarOpen(false); }}
                className={`group flex items-center ${mobile ? 'px-2 py-2 text-base' : 'px-3 py-2 text-sm'} font-medium rounded-xl transition-colors relative ${isActive
                        ? 'text-indigo-700 bg-indigo-50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
                {isActive && (
                    <motion.span
                        layoutId="nav-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                )}
                <item.icon className={`${mobile ? 'mr-4 h-6 w-6' : 'mr-3 h-5 w-5'} flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {item.name}
            </motion.a>
        );
    };

    return (
        <div className="h-screen flex bg-gray-50/80 overflow-hidden">
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm sm:hidden"
                        onClick={() => setSidebarOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>

            {/* Mobile slide-over */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl sm:hidden"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                    >
                        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                            <span className="text-xl font-black text-indigo-600 tracking-tight">SubApp</span>
                            <button type="button" className="text-gray-400 hover:text-gray-700 transition-colors" onClick={() => setSidebarOpen(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="mt-4 px-2 space-y-1">
                            {navigation.map((item) => (
                                <NavLink key={item.name} item={item} mobile />
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <div className="hidden sm:flex sm:flex-shrink-0">
                <div className="flex flex-col w-60 bg-white border-r border-gray-100">
                    <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-5 mb-6">
                            <span className="text-2xl font-black text-indigo-600 tracking-tight">SubApp</span>
                        </div>
                        <nav className="flex-1 px-3 space-y-1">
                            {navigation.map((item) => (
                                <NavLink key={item.name} item={item} />
                            ))}
                        </nav>
                    </div>

                    {/* User / logout */}
                    <div className="flex-shrink-0 border-t border-gray-100 p-4">
                        <motion.button
                            onClick={logout}
                            className="flex-shrink-0 w-full group block text-left rounded-xl hover:bg-gray-50 p-2 transition-colors"
                            whileHover={{ x: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-indigo-700 text-sm">{user?.name?.charAt(0) || 'U'}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                                    <p className="flex items-center text-xs text-gray-400 group-hover:text-gray-600 mt-0.5 transition-colors">
                                        <LogOut className="h-3 w-3 mr-1" /> Sign out
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Mobile topbar */}
                <div className="sm:hidden flex justify-between items-center px-3 bg-white border-b border-gray-100 h-14 shadow-sm">
                    <button
                        type="button"
                        className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 focus:outline-none transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="font-black text-indigo-600 text-lg tracking-tight">SubApp</span>
                    <div className="w-10" />
                </div>

                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
