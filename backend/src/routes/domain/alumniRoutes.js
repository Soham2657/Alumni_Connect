const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/domain/alumniController');

const router = express.Router();

router.get('/', asyncHandler(controller.listAlumni));
router.put('/me', requireAuth, asyncHandler(controller.upsertMyProfile));
router.post('/:userId/tag', requireAuth, requireRole('admin'), asyncHandler(controller.tagProfile));

module.exports = router;
