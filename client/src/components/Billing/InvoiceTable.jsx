import React from 'react';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const InvoiceTable = ({ invoices, loading }) => {
    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="h-14 bg-gray-100 rounded-xl w-full"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}
            </div>
        );
    }

    if (!invoices || invoices.length === 0) {
        return (
            <motion.div
                className="text-gray-400 text-sm py-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                No invoices found.
            </motion.div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6">Invoice ID</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Download</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                    {invoices.map((invoice, index) => (
                        <motion.tr
                            key={invoice.id}
                            className="hover:bg-indigo-50/30 transition-colors"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
                        >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-mono font-medium text-gray-700 sm:pl-6">
                                {invoice.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {format(new Date(invoice.date), 'MMM dd, yyyy')}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-800">
                                ${(invoice.amount / 100).toFixed(2)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${invoice.status === 'paid'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                                {invoice.pdf && (
                                    <motion.a
                                        href={invoice.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-500 hover:text-indigo-700 inline-block"
                                        whileHover={{ scale: 1.15, y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Download className="h-4 w-4" />
                                    </motion.a>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;
