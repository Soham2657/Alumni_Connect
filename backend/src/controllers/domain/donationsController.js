const crypto = require('crypto');
const { Donation } = require('../../models/Donation');
const { PaymentOrder } = require('../../models/PaymentOrder');
const { generateId } = require('../../utils/id');
const { createOrder, verifyRazorpaySignature } = require('../../services/integrations/paymentService');

const listDonations = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
  const data = await Donation.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
};

const createDonationOrder = async (req, res) => {
  const { amount, purpose, provider = 'razorpay', currency = 'INR' } = req.body;
  const receipt = `don_${generateId()}`;
  const order = await createOrder({ provider, amount: Number(amount), currency, receipt });

  await PaymentOrder.create({
    orderId: order.orderId,
    provider: order.provider,
    userId: req.user.id,
    amount: Number(amount),
    currency,
    purpose,
    status: 'created',
    meta: order.raw,
  });

  res.status(201).json({ success: true, data: order });
};

const confirmDonationPayment = async (req, res) => {
  const { provider, orderId, paymentId, transactionId, signature, purpose, amount, message } = req.body;

  let verified = false;
  if (!provider || provider === 'manual') {
    verified = true;
  } else if (provider === 'razorpay') {
    verified = verifyRazorpaySignature({ orderId, paymentId, signature });
  } else if (provider === 'stripe') {
    verified = true;
  }

  if (!verified) {
    return res.status(400).json({ success: false, error: 'Payment verification failed' });
  }

  await PaymentOrder.findOneAndUpdate({ orderId }, { status: 'paid', paymentReference: paymentId || '' });

  const donation = await Donation.create({
    id: generateId(),
    userId: req.user.id,
    userName: req.user.name,
    amount: Number(amount),
    purpose,
    message: message || '',
    donatedAt: new Date().toISOString(),
    transactionId: paymentId || transactionId || `TXN-${crypto.randomUUID()}`,
    paymentProvider: provider,
    paymentStatus: 'paid',
  });

  res.json({ success: true, data: donation });
};

module.exports = {
  listDonations,
  createDonationOrder,
  confirmDonationPayment,
};
