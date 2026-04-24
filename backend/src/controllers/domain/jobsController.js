const { Job } = require('../../models/Job');
const { JobApplication } = require('../../models/JobApplication');
const { AlumniProfile } = require('../../models/AlumniProfile');
const { generateId } = require('../../utils/id');
const { recommendJobs } = require('../../services/integrations/aiService');

const listJobs = async (req, res) => {
  const active = req.query.active;
  const filter = active === undefined ? {} : { isActive: active === 'true' };
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: jobs });
};

const createJob = async (req, res) => {
  const payload = req.body;
  const job = await Job.create({
    id: generateId(),
    ...payload,
    postedBy: req.user.id,
    postedAt: new Date().toISOString(),
    isActive: true,
  });
  res.status(201).json({ success: true, data: job });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const updated = await Job.findOneAndUpdate({ id }, req.body, { new: true }).lean();
  if (!updated) return res.status(404).json({ success: false, error: 'Job not found' });
  res.json({ success: true, data: updated });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const updated = await Job.findOneAndUpdate({ id }, { isActive: false }, { new: true }).lean();
  if (!updated) return res.status(404).json({ success: false, error: 'Job not found' });
  res.json({ success: true, data: updated });
};

const applyJob = async (req, res) => {
  const { id } = req.params;
  const existing = await JobApplication.findOne({ jobId: id, userId: req.user.id }).lean();
  if (existing) return res.status(409).json({ success: false, error: 'Already applied' });

  const application = await JobApplication.create({
    id: generateId(),
    jobId: id,
    userId: req.user.id,
    appliedAt: new Date().toISOString(),
    status: 'pending',
    coverLetter: req.body.coverLetter || '',
  });
  res.status(201).json({ success: true, data: application });
};

const recommendForUser = async (req, res) => {
  const profile = await AlumniProfile.findOne({ userId: req.user.id }).lean();
  const jobs = await Job.find().lean();
  const ranked = recommendJobs({ profileSkills: profile?.skills || [], jobs, limit: Number(req.query.limit || 5) });
  res.json({ success: true, data: ranked });
};

module.exports = {
  listJobs,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  recommendForUser,
};
