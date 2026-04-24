const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

router.get('/health', dataController.health);
router.get('/bootstrap', dataController.bootstrap);
router.get('/data/:key', dataController.getByKey);
router.put('/data/:key', dataController.putByKey);

module.exports = router;
