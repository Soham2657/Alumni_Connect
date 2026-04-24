const { createApp } = require('./app');
const { PORT } = require('./config/env');
const { connectDatabase } = require('./config/db');
const { ensureSeedData } = require('./services/seedService');

const startServer = async () => {
  await connectDatabase();
  await ensureSeedData();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});
