const mongoose = require('mongoose');
const { successStorySchema } = require('./schemas/successStory.schema');

const SuccessStory = mongoose.models.SuccessStory || mongoose.model('SuccessStory', successStorySchema);

module.exports = { SuccessStory };
