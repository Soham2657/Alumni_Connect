const { Feedback } = require('../../models/Feedback');
const { generateId } = require('../../utils/id');

const sentimentFromRating = (rating) => {
  if (rating >= 4) return 'positive';
  if (rating <= 2) return 'negative';
  return 'neutral';
};

const submitFeedback = async (req, res) => {
  const { category, rating, message } = req.body;
  const data = await Feedback.create({
    id: generateId(),
    userId: req.user.id,
    category: category || 'platform',
    rating: Number(rating),
    message,
    createdAt: new Date().toISOString(),
    sentiment: sentimentFromRating(Number(rating)),
  });
  res.status(201).json({ success: true, data });
};

const listFeedback = async (_req, res) => {
  const data = await Feedback.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
};

module.exports = {
  submitFeedback,
  listFeedback,
};
