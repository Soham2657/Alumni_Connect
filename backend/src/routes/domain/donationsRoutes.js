const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/asyncHandler');
const controller = require('../../controllers/domain/donationsController');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(controller.listDonations));
router.post('/order', requireAuth, asyncHandler(controller.createDonationOrder));
router.post('/confirm', requireAuth, asyncHandler(controller.confirmDonationPayment));

module.exports = router;
