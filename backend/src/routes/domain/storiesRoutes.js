const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/domain/storiesController');

const router = express.Router();

router.get('/', asyncHandler(controller.listStories));
router.post('/', requireAuth, requireRole('alumni', 'admin'), asyncHandler(controller.createStory));
router.patch('/:id', requireAuth, requireRole('admin'), asyncHandler(controller.updateStory));
router.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(controller.deleteStory));

module.exports = router;
