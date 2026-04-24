const dataService = require('../services/dataService');

const health = (_req, res) => {
  res.json({ ok: true, service: 'alumni-connect-hub-backend' });
};

const bootstrap = async (_req, res) => {
  res.json(await dataService.getBootstrapData());
};

const getByKey = async (req, res) => {
  const value = await dataService.getDataByKey(req.params.key);
  res.json({ value });
};

const putByKey = async (req, res) => {
  await dataService.setDataByKey(req.params.key, req.body.value);
  res.json({ success: true });
};

module.exports = {
  health,
  bootstrap,
  getByKey,
  putByKey,
};
