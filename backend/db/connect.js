const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the provided URI from environment variables
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // });
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log('MongoDB connected');
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;