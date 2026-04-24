const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    mentorId: { type: String, required: true, index: true },
    menteeId: { type: String, required: true, index: true },
    menteeName: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    requestedAt: { type: String, required: true },
    matchScore: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = { mentorshipRequestSchema };
