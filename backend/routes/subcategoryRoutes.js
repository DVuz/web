const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const subcategoryController = require('../controllers/subcategoryController');
const productTypeController = require('../controllers/productTypeController');

// Subcategory routes
router.post(
  '/subcategory',
  upload.single('image'),
  subcategoryController.createSubcategory
);
router.get('/get_all_subcategory', subcategoryController.getAllSubcategories);

// ProductType routes
router.post(
  '/product-type',
  upload.single('image'),
  productTypeController.createProductType
);
router.get('/get_all_product_type', productTypeController.getAllProductTypes);

module.exports = router;
