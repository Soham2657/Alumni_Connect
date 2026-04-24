const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    eventId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    registeredAt: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = { eventRegistrationSchema };
