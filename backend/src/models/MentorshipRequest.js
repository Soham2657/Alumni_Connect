const mongoose = require('mongoose');
const { mentorshipRequestSchema } = require('./schemas/mentorshipRequest.schema');

const MentorshipRequest = mongoose.models.MentorshipRequest || mongoose.model('MentorshipRequest', mentorshipRequestSchema);

module.exports = { MentorshipRequest };
