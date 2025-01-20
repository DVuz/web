const express = require('express');
const router = express.Router();
const discountUsageController = require('../controllers/discountUsageController');

router.post('/', discountUsageController.createDiscountUsage);
router.get('/', discountUsageController.getDiscountUsages);
router.get('/:id', discountUsageController.getDiscountUsageById);
router.delete('/:id', discountUsageController.deleteDiscountUsage);

module.exports = router;
