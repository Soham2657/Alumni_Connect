require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');
const domainRoutes = require('./routes/domain');
const integrationsRoutes = require('./routes/integrationsRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const createApp = () => {
  const app = express();
  app.use(cors());

  app.use('/api/integrations/payments/stripe/webhook', express.raw({ type: 'application/json' }));
  app.use('/api/integrations/payments/razorpay/webhook', express.raw({ type: '*/*' }));
  app.use(express.json({ limit: '2mb' }));

  app.use('/api', dataRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api', domainRoutes);
  app.use('/api/integrations', integrationsRoutes);
  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
