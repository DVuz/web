const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const categoryController = require('../controllers/categoryController');

// Sửa lại tên field thành 'image'
router.post(
  '/category',
  upload.single('image'),
  categoryController.createCategory
);
router.get('/get_all_category', categoryController.getAllCategories);
router.get(
  '/get_all_category_nested',
  categoryController.getAllCategoriesNested
);

router.get('/test/', upload.single('image'));

module.exports = router;
