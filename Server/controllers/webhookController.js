import Stripe from 'stripe';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'invoice.paid': {
        const invoice = event.data.object;
        console.log(`Invoice ${invoice.id} paid. Subscription: ${invoice.subscription}`);
        
        if (invoice.subscription) {
            await Subscription.findOneAndUpdate(
                { stripeSubscriptionId: invoice.subscription },
                { status: 'active' }
            );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object;
        console.log(`Subscription deleted: ${stripeSubscription.id}`);
        
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: stripeSubscription.id },
          { status: 'canceled' }
        );
        break;
      }
      // You can add customer.subscription.created or customer.subscription.updated here if needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook event in DB:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
