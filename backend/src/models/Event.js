const mongoose = require('mongoose');
const { eventSchema } = require('./schemas/event.schema');

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = { Event };
