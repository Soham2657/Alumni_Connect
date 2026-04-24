const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/domain/eventsController');

const router = express.Router();

router.get('/', asyncHandler(controller.listEvents));
router.post('/', requireAuth, requireRole('admin'), asyncHandler(controller.createEvent));
router.post('/:id/register', requireAuth, asyncHandler(controller.registerForEvent));
router.get('/:id/registrations', requireAuth, requireRole('admin'), asyncHandler(controller.listEventRegistrations));

module.exports = router;
