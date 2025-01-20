const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const productController = require('../controllers/productController');

const parseFiles = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'subImages', maxCount: 5 },
]);

router.post('/products', parseFiles, productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/get_all_products', productController.getAllProducts);
router.get('/products/name/:productName', productController.getProductByName);

module.exports = router;
