const express = require('express');
const router = express.Router();
const Product = require('../models/product');


// Create product endpoint (remove multer middleware)
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.image) return res.status(400).json({ message: 'Image URL is required' });
    if (!req.body.name || !req.body.price || !req.body.category) {
      return res.status(400).json({ message: 'Name, price, category, and image URL are required' });
    }

    const product = new Product({
      name: req.body.name,
      price: Number(req.body.price),
      category: req.body.category,
      description: req.body.description,
      isNew: req.body.isNew === 'true',
      image: req.body.image // Use URL directly
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ 
      message: error.message.includes('validation failed') 
        ? 'Validation error: Check your input data'
        : 'Server error' 
    });
  }
});

// Update product endpoint
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updates = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      isNew: req.body.isNew === 'true',
      image: req.body.image // Use URL directly
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { 
      category = 'all', 
      search = '', 
      minPrice = 0, 
      maxPrice = 100000, 
      sort = '', 
      page = 1, 
      limit = 9,
    } = req.query;

    const query = {};
    if (category && category !== 'all') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };

    const sortOptions = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    if (sort === 'price-desc') sortOptions.price = -1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
