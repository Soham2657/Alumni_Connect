const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/integrations/analyticsController');

const router = express.Router();

router.get('/engagement', requireAuth, requireRole('admin'), asyncHandler(controller.engagementInsights));

module.exports = router;
