require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
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

  // Serve the frontend app and support browser refresh on client-side routes.
  const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
  const frontendIndexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(frontendIndexPath)) {
    app.use(express.static(frontendDistPath));
    app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
      res.sendFile(frontendIndexPath);
    });
  } else if (process.env.NODE_ENV !== 'production') {
    app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
      res.redirect(`http://localhost:8080${req.originalUrl}`);
    });
  }

  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
