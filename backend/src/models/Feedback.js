const mongoose = require('mongoose');
const { feedbackSchema } = require('./schemas/feedback.schema');

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

module.exports = { Feedback };
