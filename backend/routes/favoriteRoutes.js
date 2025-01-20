// routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Thêm sản phẩm vào danh sách yêu thích
router.post('/add', authMiddleware, favoriteController.addToFavorite);

// Xóa sản phẩm khỏi danh sách yêu thích
router.delete('/remove', authMiddleware, favoriteController.removeFromFavorite);

// Lấy danh sách yêu thích của user
router.get('/:user_id', favoriteController.getUserFavorites);

module.exports = router;
