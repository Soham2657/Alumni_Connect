const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    alumniName: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    branch: { type: String, required: true },
    title: { type: String, required: true },
    story: { type: String, required: true },
    achievement: { type: String, required: true },
    image: { type: String, default: '' },
    createdAt: { type: String, required: true },
    featured: { type: Boolean, default: false },
    aiTags: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = { successStorySchema };
