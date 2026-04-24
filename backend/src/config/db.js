const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDatabase = async () => {
  await mongoose.connect(MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = { connectDatabase };
