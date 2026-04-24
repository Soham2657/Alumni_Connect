const mongoose = require('mongoose');
const { paymentOrderSchema } = require('./schemas/paymentOrder.schema');

const PaymentOrder = mongoose.models.PaymentOrder || mongoose.model('PaymentOrder', paymentOrderSchema);

module.exports = { PaymentOrder };
