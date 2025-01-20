const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

router.post('/validate', discountController.validateDiscount);

router.post('/', discountController.createDiscount);
router.get('/', discountController.getAllDiscounts);
router.get('/:id', discountController.getDiscountById);
router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);
module.exports = router;
