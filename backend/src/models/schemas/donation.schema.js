const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, enum: ['scholarship', 'infrastructure', 'research', 'general'], required: true },
    message: { type: String, default: '' },
    donatedAt: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    paymentProvider: { type: String, enum: ['razorpay', 'stripe', 'manual'], default: 'manual' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = { donationSchema };
