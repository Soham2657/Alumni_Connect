const mongoose = require('mongoose');
const { jobSchema } = require('./schemas/job.schema');

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

module.exports = { Job };
