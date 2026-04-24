const express = require('express');
const webhookController = require('../controllers/integrations/paymentsWebhookController');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/payments/razorpay/webhook', asyncHandler(webhookController.razorpayWebhook));
router.post('/payments/stripe/webhook', asyncHandler(webhookController.stripeWebhook));

module.exports = router;
