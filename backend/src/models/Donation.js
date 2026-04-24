const mongoose = require('mongoose');
const { donationSchema } = require('./schemas/donation.schema');

const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

module.exports = { Donation };
