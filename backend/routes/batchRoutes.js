const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

// Place more specific routes first
router.get('/all', batchController.getAllBatches);
// Then place the filtered route
router.get('/', batchController.getBatches);
router.post('/', batchController.createBatch);

module.exports = router;

// GET /api/batches?page=1&limit=10&minTotalPrice=1000&maxTotalPrice=5000&dateStart=2024-01-01&manufacturer_id=5&warehouse_id=1&search=test
