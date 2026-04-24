const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/integrations/aiController');

const router = express.Router();

router.post('/mentor-match', requireAuth, asyncHandler(controller.mentorMatch));
router.post('/job-recommendations', requireAuth, asyncHandler(controller.jobRecommendations));
router.post('/tag', requireAuth, asyncHandler(controller.tagEntity));

module.exports = router;
