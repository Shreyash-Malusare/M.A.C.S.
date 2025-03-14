const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [1, 'Price must be greater than 0']
  },
  image: { 
    type: String, 
    required: [true, 'Image URL is required'],
    validate: {
      validator: v => {
        try {
          new URL(v);
          return true;
        } catch (err) {
          return false;
        }
      },
      message: 'Invalid URL format'
    }
  },
  category: { 
    type: String, 
    required: true,
    enum: {
      values: ['men', 'women', 'kids', 'unisex', 'accessories', 'sports', 'beauty'],
      message: 'Invalid category'
    }
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  isNew: { 
    type: Boolean, 
    default: false 
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);