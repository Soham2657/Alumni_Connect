const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], required: true },
    salary: { type: String, default: '' },
    postedBy: { type: String, required: true },
    postedAt: { type: String, required: true },
    requirements: [{ type: String }],
    isActive: { type: Boolean, default: true },
    aiTags: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = { jobSchema };
