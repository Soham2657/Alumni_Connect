const { MentorshipRequest } = require('../../models/MentorshipRequest');
const { AlumniProfile } = require('../../models/AlumniProfile');
const { generateId } = require('../../utils/id');
const { rankMentors } = require('../../services/integrations/aiService');

const listMentorship = async (req, res) => {
  const data = await MentorshipRequest.find({ $or: [{ mentorId: req.user.id }, { menteeId: req.user.id }] })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data });
};

const createMentorship = async (req, res) => {
  const { mentorId, message } = req.body;
  const mentor = await AlumniProfile.findOne({ userId: mentorId }).lean();
  const mentee = await AlumniProfile.findOne({ userId: req.user.id }).lean();
  const ranked = rankMentors({ querySkills: mentee?.skills || [], mentors: mentor ? [mentor] : [], limit: 1 });
  const score = ranked[0]?.score || 0;

  const data = await MentorshipRequest.create({
    id: generateId(),
    mentorId,
    menteeId: req.user.id,
    menteeName: req.user.name,
    message,
    requestedAt: new Date().toISOString(),
    status: 'pending',
    matchScore: score,
  });

  res.status(201).json({ success: true, data });
};

const updateMentorshipStatus = async (req, res) => {
  const { id } = req.params;
  const updated = await MentorshipRequest.findOneAndUpdate({ id }, { status: req.body.status }, { new: true }).lean();
  if (!updated) return res.status(404).json({ success: false, error: 'Request not found' });
  res.json({ success: true, data: updated });
};

module.exports = {
  listMentorship,
  createMentorship,
  updateMentorshipStatus,
};
