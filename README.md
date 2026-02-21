# Subscription Management App

A modern, full-stack subscription management application built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with **Stripe Billing**. 

This application allows users to register, log in, view pricing plans, subscribe to premium tiers using credit card payments, upgrade/cancel their plans, and view their subscription billing history. The entire UI uses **Tailwind CSS** and **Framer Motion** for a sleek, highly animated, minimalist aesthetic.

## Features
- **User Authentication:** Secure JWT-based registration and login system.
- **Modern UI:** Built with Vite + React + Tailwind CSS with glassmorphism components and fluid animations via Framer Motion.
- **Stripe Subscriptions:** 
    - Full recurring billing integration via Stripe Checkout Elements.
    - Test cards support.
    - Interactive pricing cards with Monthly / Yearly toggle.
    - Automatically displays an Upcoming Invoice gradient card for active users.
- **Stripe Webhooks:** Backend real-time synchronization with Stripe to instantly capture `invoice.paid` and `customer.subscription.deleted` events.
- **Billing History:** Displays a data table showing all generated Stripe invoices, their payment status, and a download link to PDF receipts.

## Project Structure

This project is a monorepo separated into two main directories:
- `/client` - The Vite React frontend application.
- `/Server` - The Node.js / Express backend API connecting to MongoDB and Stripe.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- A [Stripe Developer Account](https://dashboard.stripe.com/register)

### 2. Environment Variables Configuration

To run this application, you must set up Environment Variables for both the Client and Server.

#### Backend (`/Server/.env`)
Create a `.env` file in the `/Server` folder and populate it with your specific keys:

```bash
PORT=5000
MONGO_URI=mongodb+srv://patilraj1718_db_user:3isBaZLB3zoM1pnt@cluster0.anrtypj.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key

# ----------------- STRIPE CONFIGURATION ----------------- #
# 1. Your Stripe Secret Key (Found in Stripe Dashboard -> Developers -> API Keys)
STRIPE_SECRET_KEY=sk_test_...

# 2. Your Stripe Webhook Secret
# To get this locally, install the Stripe CLI and run: stripe listen --forward-to localhost:5000/api/stripe/webhook
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Frontend (`/client/.env`)
Create a `.env` file in the `/client` folder and add your specific keys:

```bash
# Your Stripe Publishable Key (Found in Stripe Dashboard -> Developers -> API Keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Local Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### 3. Stripe Product & Pricing Configuration

Since this application offers different tiers (e.g. "Basic" and "Pro", monthly/yearly), you need to create these products inside your Stripe Dashboard so the backend can generate checkout sessions for them.

**To automatically create your products in Stripe:**
1. Go to your Stripe Dashboard -> **Products** -> **Add Product**.
2. Create a "Basic Plan" and add standard pricing (e.g., $9/month and $99/year).
3. Create a "Pro Plan" and add standard pricing (e.g., $29/month and $299/year).
4. For each pricing option you create, Stripe generates an **API ID** (which looks like `price_1T2w...`).
5. Open the `/client/src/components/Billing/PricingCard.jsx` file.
6. Replace the hardcoded `id` values in the `tiers` array with the **Price IDs** you just copied from your Stripe Dashboard!

### 4. Running the App

Open two terminal windows.

**Terminal 1 (Backend):**
```bash
cd Server
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```

Your app will be running at `http://localhost:5173`.

### 5. Local Stripe Webhooks Server
For features like canceling your subscription and viewing real-time invoice updates locally, Stripe needs a way to send events to your `localhost` backend.

1. Download the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Login to your Stripe account via CLI:
```bash
stripe login
```
3. Forward webhook events to your backend:
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```
4. Copy the Webhook Signing Secret (`whsec_...`) printed in your terminal and paste it into `/Server/.env` under `STRIPE_WEBHOOK_SECRET`.

### 6. Testing Payments

While running your application in test mode (using `pk_test_...` and `sk_test_...` keys), real credit cards will not work. 

To test the payment checkout flow, use the following **Stripe Test Card**:

| Type | Card Number | Expiration | CVC | ZIP/Postal Code |
|------|-------------|------------|-----|-----------------|
| Visa (Success) | `4242 4242 4242 4242` | Any future date | Any 3 digits | Any ZIP code |

*For testing declined cards or other scenarios, see the [Stripe Test Card Documentation](https://stripe.com/docs/testing).*

---

## 🎨 Built With
- React 19 + Vite
- Tailwind CSS 4 + Lucide React (Icons)
- Framer Motion (Interactions & Animations)
- Node.js + Express.js + Axios
- MongoDB + Mongoose
- Stripe Node / React Stripe.js
