const mongoose = require('mongoose');
const { jobApplicationSchema } = require('./schemas/jobApplication.schema');

const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);

module.exports = { JobApplication };
