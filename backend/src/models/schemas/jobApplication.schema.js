const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    jobId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    appliedAt: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
    coverLetter: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = { jobApplicationSchema };
