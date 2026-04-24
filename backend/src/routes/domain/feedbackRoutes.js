const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/domain/feedbackController');

const router = express.Router();

router.post('/', requireAuth, asyncHandler(controller.submitFeedback));
router.get('/', requireAuth, requireRole('admin'), asyncHandler(controller.listFeedback));

module.exports = router;
