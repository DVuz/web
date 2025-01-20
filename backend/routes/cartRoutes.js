// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, cartController.addToCart);
router.delete('/:cart_id', authMiddleware, cartController.removeFromCart);
router.put(
  '/:cart_id/quantity',
  authMiddleware,
  cartController.updateCartQuantity
);
router.get('/user', authMiddleware, cartController.getUserCart);

module.exports = router;
