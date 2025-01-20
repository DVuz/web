const express = require('express');
const router = express.Router();
const shippingFeeController = require('../controllers/shippingFeeController');

// Create new shipping fee
router.post('/shipping_fees', shippingFeeController.createShippingFee);
/*
Request body:
{
    "min_distance": 0,     // Integer, minimum distance in km
    "max_distance": 5,     // Integer, maximum distance in km
    "fee": 15000          // Integer, shipping fee amount
}
*/

// Get all active shipping fees
router.get('/', shippingFeeController.getShippingFees);
/*
No parameters required
Response will return all active shipping fees sorted by min_distance
*/

// Update shipping fee by ID
router.put('/shipping_fees/:id', shippingFeeController.updateShippingFee);
/*
URL Parameter:
- id: The ID of the shipping fee to update

Request body (all fields optional):
{
    "min_distance": 5,     // Integer, new minimum distance
    "max_distance": 10,    // Integer, new maximum distance
    "fee": 25000          // Integer, new fee amount
}
*/

// Delete (soft delete) shipping fee by ID
router.delete('/shipping_fees/:id', shippingFeeController.deleteShippingFee);
/*
URL Parameter:
- id: The ID of the shipping fee to delete

No request body required
Will set status to false instead of actually deleting the record
*/

module.exports = router;
