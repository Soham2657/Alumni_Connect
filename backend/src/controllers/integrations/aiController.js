const { AlumniProfile } = require('../../models/AlumniProfile');
const { Job } = require('../../models/Job');
const { SuccessStory } = require('../../models/SuccessStory');
const { rankMentors, recommendJobs, extractTags } = require('../../services/integrations/aiService');

const mentorMatch = async (req, res) => {
  const { skills = [], query = '', limit = 5 } = req.body;
  const profiles = await AlumniProfile.find().lean();
  const querySkills = skills.length ? skills : query.split(/[,\s]+/).filter(Boolean);
  const data = rankMentors({ querySkills, mentors: profiles, limit: Number(limit) });
  res.json({ success: true, data });
};

const jobRecommendations = async (req, res) => {
  const { skills = [], limit = 5 } = req.body;
  const jobs = await Job.find().lean();
  const data = recommendJobs({ profileSkills: skills, jobs, limit: Number(limit) });
  res.json({ success: true, data });
};

const tagEntity = async (req, res) => {
  const { type, id, text } = req.body;
  const tags = await extractTags(text || '');

  if (type === 'alumni') {
    const updated = await AlumniProfile.findOneAndUpdate({ userId: id }, { aiTags: tags }, { new: true }).lean();
    return res.json({ success: true, data: { tags, updated } });
  }

  if (type === 'story') {
    const updated = await SuccessStory.findOneAndUpdate({ id }, { aiTags: tags }, { new: true }).lean();
    return res.json({ success: true, data: { tags, updated } });
  }

  return res.status(400).json({ success: false, error: 'Unsupported type for tagging' });
};

module.exports = {
  mentorMatch,
  jobRecommendations,
  tagEntity,
};
