const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db'); // Adjust path based on your project structure
const dotenv = require('dotenv');

dotenv.config();


// Import routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/review');
const messageRoutes = require('./routes/message');
const PORT = 3001; // Directly use port 3001
const app = express();

// Configure CORS
const corsOptions = {
  origin: 'https://m-a-c-s-frontend.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Add this before your routes
app.use(express.json());


// Connect to MongoDB
connectDB(); // Call connectDB to establish the database connection

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/payment', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Ensure amount is a number and convert to paise
    const rupees = Number(amount);
    console.log(rupees);
    if (isNaN(rupees)) {
      return res.status(400).json({ error: 'Invalid amount value' });
    }
    const options = {
      amount: rupees, // This value must be an integer
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error in /api/payment:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});




// Protected Routes
app.use('/api/products', productRoutes);
app.use('/api/cart',  cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
