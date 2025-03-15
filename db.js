const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace this URL with your actual MongoDB connection string
    const mongoURI = 'mongodb+srv://malusareshreyash01:shreyash2378@cluster.shve6pu.mongodb.net/test';  // Use your database name here
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
