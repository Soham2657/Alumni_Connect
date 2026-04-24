const { getEngagementInsights } = require('../../services/domain/analyticsService');

const engagementInsights = async (_req, res) => {
  const data = await getEngagementInsights();
  res.json({ success: true, data });
};

module.exports = { engagementInsights };
