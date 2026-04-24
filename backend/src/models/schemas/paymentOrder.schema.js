const mongoose = require('mongoose');

const paymentOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    provider: { type: String, enum: ['razorpay', 'stripe', 'manual'], required: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    purpose: { type: String, enum: ['scholarship', 'infrastructure', 'research', 'general'], required: true },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    paymentReference: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, versionKey: false }
);

module.exports = { paymentOrderSchema };
