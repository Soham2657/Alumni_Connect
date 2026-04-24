const { JobApplication } = require('../../models/JobApplication');

const listMyApplications = async (req, res) => {
  const data = await JobApplication.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
};

const listApplicationsForJob = async (req, res) => {
  const { jobId } = req.params;
  const data = await JobApplication.find({ jobId }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const updated = await JobApplication.findOneAndUpdate({ id }, { status: req.body.status }, { new: true }).lean();
  if (!updated) return res.status(404).json({ success: false, error: 'Application not found' });
  res.json({ success: true, data: updated });
};

module.exports = {
  listMyApplications,
  listApplicationsForJob,
  updateApplicationStatus,
};
