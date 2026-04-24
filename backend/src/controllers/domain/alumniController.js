const { AlumniProfile } = require('../../models/AlumniProfile');
const { extractTags } = require('../../services/integrations/aiService');

const listAlumni = async (req, res) => {
  const { q = '', branch = '', industry = '' } = req.query;
  const query = {};
  if (branch) query.branch = branch;
  if (industry) query.industry = industry;

  let data = await AlumniProfile.find(query).lean();
  if (q) {
    const text = String(q).toLowerCase();
    data = data.filter((p) =>
      [p.name, p.currentCompany, p.role, p.industry, ...(p.skills || []), ...(p.aiTags || [])]
        .join(' ')
        .toLowerCase()
        .includes(text)
    );
  }

  res.json({ success: true, data });
};

const upsertMyProfile = async (req, res) => {
  const payload = { ...req.body, userId: req.user.id, email: req.user.email, name: req.user.name };
  const data = await AlumniProfile.findOneAndUpdate({ userId: req.user.id }, payload, { new: true, upsert: true }).lean();
  res.json({ success: true, data });
};

const tagProfile = async (req, res) => {
  const profile = await AlumniProfile.findOne({ userId: req.params.userId }).lean();
  if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

  const tags = await extractTags(`${profile.bio || ''} ${profile.skills?.join(' ') || ''} ${profile.role || ''}`);
  const data = await AlumniProfile.findOneAndUpdate({ userId: req.params.userId }, { aiTags: tags }, { new: true }).lean();
  res.json({ success: true, data });
};

module.exports = {
  listAlumni,
  upsertMyProfile,
  tagProfile,
};
