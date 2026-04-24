const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    category: { type: String, enum: ['platform', 'events', 'jobs', 'mentorship', 'donation', 'other'], default: 'platform' },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String, required: true },
    createdAt: { type: String, required: true },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'neutral' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = { feedbackSchema };
