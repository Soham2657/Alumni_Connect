const { SuccessStory } = require('../../models/SuccessStory');
const { generateId } = require('../../utils/id');
const { extractTags } = require('../../services/integrations/aiService');

const listStories = async (_req, res) => {
  const data = await SuccessStory.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
};

const createStory = async (req, res) => {
  const aiTags = await extractTags(`${req.body.title || ''}. ${req.body.story || ''}`);
  const data = await SuccessStory.create({
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    aiTags,
  });
  res.status(201).json({ success: true, data });
};

const updateStory = async (req, res) => {
  const data = await SuccessStory.findOneAndUpdate({ id: req.params.id }, req.body, { new: true }).lean();
  if (!data) return res.status(404).json({ success: false, error: 'Story not found' });
  res.json({ success: true, data });
};

const deleteStory = async (req, res) => {
  const data = await SuccessStory.findOneAndDelete({ id: req.params.id }).lean();
  if (!data) return res.status(404).json({ success: false, error: 'Story not found' });
  res.json({ success: true, data });
};

module.exports = {
  listStories,
  createStory,
  updateStory,
  deleteStory,
};
