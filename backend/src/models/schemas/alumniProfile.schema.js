const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    branch: { type: String, required: true },
    currentCompany: { type: String, default: '' },
    role: { type: String, default: '' },
    skills: [{ type: String }],
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    industry: { type: String, default: '' },
    aiTags: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = { alumniProfileSchema };
