const mongoose = require('mongoose');
const { alumniProfileSchema } = require('./schemas/alumniProfile.schema');

const AlumniProfile = mongoose.models.AlumniProfile || mongoose.model('AlumniProfile', alumniProfileSchema);

module.exports = { AlumniProfile };
