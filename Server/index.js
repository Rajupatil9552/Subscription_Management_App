import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/config.js';
import stripeRoutes from './routes/stripeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { handleWebhook } from './controllers/webhookController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// -------------------------------------------------------------
// WEBHOOK (Must be mounted before express.json parsing)
// -------------------------------------------------------------
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// -------------------------------------------------------------
// STANDARD MIDDLEWARE FOR OTHER ROUTES
// -------------------------------------------------------------
app.use(cors({
  origin: [
    '*',
    
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());       // Parses standard JSON payloads
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------
app.use('/api/stripe', stripeRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Subscription App API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
