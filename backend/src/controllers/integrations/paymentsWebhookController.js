const { PaymentOrder } = require('../../models/PaymentOrder');
const { verifyRazorpayWebhook, parseStripeWebhook } = require('../../services/integrations/paymentService');

const razorpayWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body || {});
  const verified = verifyRazorpayWebhook({ rawBody, signature });

  if (!verified) return res.status(400).json({ success: false, error: 'Invalid webhook signature' });

  const event = JSON.parse(rawBody);
  const orderId = event?.payload?.payment?.entity?.order_id;
  const paymentId = event?.payload?.payment?.entity?.id;
  if (orderId) {
    await PaymentOrder.findOneAndUpdate({ orderId }, { status: 'paid', paymentReference: paymentId || '' });
  }

  return res.json({ success: true });
};

const stripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const rawBody = req.body;
  const event = parseStripeWebhook(rawBody, signature);

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await PaymentOrder.findOneAndUpdate(
      { orderId: paymentIntent.id },
      { status: 'paid', paymentReference: paymentIntent.latest_charge || '' }
    );
  }

  return res.json({ success: true });
};

module.exports = {
  razorpayWebhook,
  stripeWebhook,
};
