import express from 'express';
import {
  createCustomer,
  addPaymentMethod,
  createSubscription,
  cancelSubscription,
  getInvoices,
  getUpcomingInvoice,
  getSubscription
} from '../controllers/stripeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply authMiddleware to protect all route paths
router.post('/create-customer', authMiddleware, createCustomer);
router.post('/add-payment-method', authMiddleware, addPaymentMethod);
router.post('/create-subscription', authMiddleware, createSubscription);
router.post('/cancel-subscription', authMiddleware, cancelSubscription);
router.get('/invoices/:customerId', authMiddleware, getInvoices);
router.get('/upcoming-invoice/:customerId', authMiddleware, getUpcomingInvoice);
router.get('/subscription/:customerId', authMiddleware, getSubscription);

export default router;
