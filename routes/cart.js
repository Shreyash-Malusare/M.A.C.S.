const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Get user's cart
router.get('/', async (req, res) => {
  try {
    if (!req.query.userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const cartItems = await Cart.find({ userId: req.query.userId }).populate('productId');
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, size, userId } = req.body;
    
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let cartItem = await Cart.findOne({ 
      productId,
      size,
      userId
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({
        productId,
        quantity,
        size,
        userId
      });
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update quantity
router.put('/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      { quantity: req.body.quantity },
      { new: true }
    ).populate('productId');

    if (!cartItem) return res.status(404).json({ message: 'Item not found' });
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove item
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.query.userId
    });
    
    if (!cartItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear the entire cart for a given user
router.delete('/', async (req, res) => {
  try {
    const { userId } = req.body; // Expecting userId in the request body
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }
    
    // Delete all cart items for this user
    await Cart.deleteMany({ userId });
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
