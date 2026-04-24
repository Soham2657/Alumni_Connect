const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['reunion', 'workshop', 'seminar', 'networking', 'cultural'], required: true },
    createdBy: { type: String, required: true },
    maxAttendees: { type: Number, default: 0 },
    image: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = { eventSchema };
