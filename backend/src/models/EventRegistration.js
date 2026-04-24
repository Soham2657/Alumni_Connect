const mongoose = require('mongoose');
const { eventRegistrationSchema } = require('./schemas/eventRegistration.schema');

const EventRegistration = mongoose.models.EventRegistration || mongoose.model('EventRegistration', eventRegistrationSchema);

module.exports = { EventRegistration };
