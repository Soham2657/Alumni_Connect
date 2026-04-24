const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/domain/applicationsController');

const router = express.Router();

router.get('/my', requireAuth, asyncHandler(controller.listMyApplications));
router.get('/job/:jobId', requireAuth, requireRole('admin', 'alumni'), asyncHandler(controller.listApplicationsForJob));
router.patch('/:id/status', requireAuth, requireRole('admin', 'alumni'), asyncHandler(controller.updateApplicationStatus));

module.exports = router;
