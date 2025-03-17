const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Product = require('../models/product'); 

// POST a new review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = new Review({
      product: product._id,
      user: userId,
      rating,
      comment,
    });
    await review.save();

    // Add review to product's reviews array
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET all reviews for a specific product
router.get('/:id/reviews', async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST mark a review as helpful
router.post('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.helpful += 1;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
