import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function seed() {
  try {
      const product = await stripe.products.create({name: 'Basic Plan'});
      const price = await stripe.prices.create({product: product.id, unit_amount: 900, currency: 'usd', recurring: {interval: 'month'}});
      console.log('BASIC_PRICE_ID=' + price.id);
      
      const product2 = await stripe.products.create({name: 'Pro Plan'});
      const price2 = await stripe.prices.create({product: product2.id, unit_amount: 2900, currency: 'usd', recurring: {interval: 'month'}});
      console.log('PRO_PRICE_ID=' + price2.id);
  } catch (err) {
      console.error(err);
  }
}
seed();
