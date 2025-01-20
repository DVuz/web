const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const manufacturerController = require('../controllers/manufacturerControllers');

// Route để tạo mới nhà sản xuất
router.post(
  '/manufacturer',
  upload.single('image'),
  manufacturerController.createManufacturer
);

// Route để cập nhật thông tin nhà sản xuất
router.put('/:manufacturer_id', manufacturerController.updateManufacturer);

// Route để xóa mềm nhà sản xuất
router.delete('/:manufacturer_id', manufacturerController.deleteManufacturer);

// Route để lấy thông tin chi tiết của một nhà sản xuất
router.get('/:manufacturer_id', manufacturerController.getManufacturerById);

// Route để lấy danh sách tất cả các nhà sản xuất (bao gồm cả tùy chọn hiển thị nhà sản xuất "đã xóa mềm")
router.get('/', manufacturerController.getAllManufacturers);

module.exports = router;
