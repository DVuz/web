// routes/warehouseRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const warehouseController = require('../controllers/warehouseController');

router.post(
  '/warehouse',
  upload.single('image'),
  warehouseController.createWarehouse
);
router.get('/get_all_warehouses', warehouseController.getAllWarehouses);

module.exports = router;
