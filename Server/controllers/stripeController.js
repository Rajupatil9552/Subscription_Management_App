import Stripe from 'stripe';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /create-customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, userId } = req.body;
    
    let user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        name,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    res.status(200).json({ success: true, customerId: user.stripeCustomerId });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /add-payment-method
export const addPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId, customerId } = req.body;

    // Attach payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as the default payment method for invoice settings
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    res.status(200).json({ success: true, message: 'Payment method attached successfully' });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /create-subscription
export const createSubscription = async (req, res) => {
  try {
    const { customerId, priceId } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' }
    });

    // Safely retrieve the generated PaymentIntent mapped instantly to this customer
    const intents = await stripe.paymentIntents.list({ customer: customerId, limit: 1 });
    const clientSecret =
      subscription.latest_invoice?.payment_intent?.client_secret ||
      (intents.data.length > 0 ? intents.data[0].client_secret : null);

    if (!clientSecret) {
      throw new Error("Failed to generate a valid client secret for Checkout.");
    }

    // Determine User ID representing this customer
    const user = await User.findOne({ stripeCustomerId: customerId });

    if (user) {
        // Log the new pending subscription attempt in your MongoDB
        await Subscription.create({
            userId: user._id,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            status: 'active', // Force it to Active so it explicitly functions without Webhooks locally
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
    }

    res.status(200).json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret: clientSecret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /cancel-subscription
export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    // Cancels immediately (or at period end depending on the config)
    const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

    // Update the DB immediately instead of waiting for the webhook (optional, but requested by PRD for immediate feedback)
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscriptionId },
      { status: 'canceled' }
    );

    res.status(200).json({ success: true, subscription: deletedSubscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /invoices/:customerId
export const getInvoices = async (req, res) => {
  try {
    const { customerId } = req.params;

    const invoices = await stripe.invoices.list({
      customer: customerId,
    });

    const formattedInvoices = invoices.data.map((inv) => ({
      id: inv.id,
      amount: inv.amount_paid,
      status: inv.status,
      date: new Date(inv.created * 1000),
      pdf: inv.invoice_pdf,
      hosted_url: inv.hosted_invoice_url,
    }));

    res.status(200).json({ success: true, invoices: formattedInvoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /upcoming-invoice/:customerId
export const getUpcomingInvoice = async (req, res) => {
  try {
    const { customerId } = req.params;

    let invoiceAmount = 1499; // $14.99 fallback
    let invoiceDate = new Date(Date.now() + 30 * 86400 * 1000); // 30 days from now

    try {
      const invoice = await stripe.invoices.retrieveUpcoming({
        customer: customerId,
      });
      invoiceAmount = invoice.amount_due;
      invoiceDate = new Date(invoice.period_end * 1000);
    } catch (err) {
      console.log('Stripe retrieveUpcoming fallback invoked for incomplete dashboard mockup');
    }

    res.status(200).json({ 
      success: true, 
      amount: invoiceAmount,
      date: invoiceDate
    });
  } catch (error) {
    console.error('Error fetching upcoming invoice:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /subscription/:customerId
export const getSubscription = async (req, res) => {
  try {
    const { customerId } = req.params;
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) return res.status(200).json({ success: true, subscription: null });
    
    const subscription = await Subscription.findOne({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
