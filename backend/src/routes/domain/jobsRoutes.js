const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/domain/jobsController');

const router = express.Router();

router.get('/', asyncHandler(controller.listJobs));
router.post('/', requireAuth, requireRole('alumni', 'admin'), asyncHandler(controller.createJob));
router.patch('/:id', requireAuth, requireRole('alumni', 'admin'), asyncHandler(controller.updateJob));
router.delete('/:id', requireAuth, requireRole('admin', 'alumni'), asyncHandler(controller.deleteJob));
router.post('/:id/apply', requireAuth, asyncHandler(controller.applyJob));
router.get('/recommendations/me', requireAuth, asyncHandler(controller.recommendForUser));

module.exports = router;
