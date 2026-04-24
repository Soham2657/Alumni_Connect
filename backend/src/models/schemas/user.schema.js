const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['alumni', 'student', 'admin'], required: true },
    createdAt: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = { userSchema };
