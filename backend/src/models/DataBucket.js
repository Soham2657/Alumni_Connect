const mongoose = require('mongoose');
const { dataBucketSchema } = require('./schemas/dataBucket.schema');

const DataBucket = mongoose.models.DataBucket || mongoose.model('DataBucket', dataBucketSchema);

module.exports = { DataBucket };
