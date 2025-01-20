// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, addressController.createOrUpdateAddress);
router.get('/', authMiddleware, addressController.getAddress);
router.get('/address_with_user', authMiddleware, addressController.getAddressWithUserDetails);

module.exports = router;