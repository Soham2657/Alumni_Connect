const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/domain/mentorshipController');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(controller.listMentorship));
router.post('/', requireAuth, asyncHandler(controller.createMentorship));
router.patch('/:id/status', requireAuth, requireRole('admin', 'alumni'), asyncHandler(controller.updateMentorshipStatus));

module.exports = router;
