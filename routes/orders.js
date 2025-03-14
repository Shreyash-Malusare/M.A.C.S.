const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
  try {
    if (!req.body.userId || !req.body.address) {
      return res.status(400).json({ message: 'userId and address are required in the request body' });
    }

    const order = new Order({
      ...req.body,
      userId: req.body.userId,
      address: req.body.address,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get orders for the current user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required as a query parameter' });
    }

    const orders = await Order.find({ userId })
      .populate('items.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders (admin only)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId')
      .populate('items.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;