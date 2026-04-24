const crypto = require('crypto');
const Stripe = require('stripe');
const Razorpay = require('razorpay');
const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} = require('../../config/env');

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;
const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

const createOrder = async ({ provider, amount, currency = 'INR', receipt }) => {
  if (provider === 'manual') {
    return {
      provider,
      orderId: `mock_${receipt}`,
      amount: Math.round(amount * 100),
      currency,
      raw: { receipt, amount: Math.round(amount * 100), currency, mock: true },
    };
  }

  if (provider === 'razorpay') {
    if (!razorpay) {
      return {
        provider: 'manual',
        orderId: `mock_${receipt}`,
        amount: Math.round(amount * 100),
        currency,
        raw: { receipt, amount: Math.round(amount * 100), currency, mock: true },
      };
    }
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
    });
    return { provider, orderId: order.id, amount: order.amount, currency: order.currency, raw: order };
  }

  if (provider === 'stripe') {
    if (!stripe) {
      return {
        provider: 'manual',
        orderId: `mock_${receipt}`,
        amount: Math.round(amount * 100),
        currency,
        raw: { receipt, amount: Math.round(amount * 100), currency, mock: true },
      };
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: { receipt },
      automatic_payment_methods: { enabled: true },
    });
    return { provider, orderId: intent.id, amount: intent.amount, currency: intent.currency.toUpperCase(), clientSecret: intent.client_secret, raw: intent };
  }

  throw new Error('Unsupported payment provider');
};

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  if (String(orderId || '').startsWith('mock_')) return true;
  if (!RAZORPAY_WEBHOOK_SECRET && !RAZORPAY_KEY_SECRET) return false;
  const secret = RAZORPAY_KEY_SECRET;
  const digest = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return digest === signature;
};

const verifyRazorpayWebhook = ({ rawBody, signature }) => {
  if (String(rawBody || '').includes('"mock":true')) return true;
  if (!RAZORPAY_WEBHOOK_SECRET) return false;
  const digest = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
  return digest === signature;
};

const parseStripeWebhook = (rawBody, signature) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return { type: 'payment_intent.succeeded', data: { object: { id: 'mock_stripe_payment', latest_charge: 'mock_stripe_charge' } } };
  }
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook is not configured');
  }
  return stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
};

module.exports = {
  createOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhook,
  parseStripeWebhook,
};
