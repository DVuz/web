// controllers/warehouseController.js
const warehouseService = require('../services/warehouseService');
const path = require('path');

exports.createWarehouse = async (req, res) => {
  try {
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/warehouses/${req.file.filename}`;
    }

    const warehouseData = {
      name: req.body.name?.trim(),
      address: req.body.address?.trim(),
      phone: req.body.phone?.trim(),
      email: req.body.email?.trim(),
      image_url: imagePath,
      is_active: req.body.is_active === 'true',
    };

    const result = await warehouseService.createWarehouse(warehouseData);

    if (result.success) {
      res.status(201).json(result);
    } else {
      if (req.file) {
        const filePath = path.join(__dirname, '..', req.file.path);
        require('fs').unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      res.status(400).json(result);
    }
  } catch (error) {
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path);
      require('fs').unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllWarehouses = async (req, res) => {
  try {
    const result = await warehouseService.getAllWarehouses();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching warehouses',
      error: error.message,
    });
  }
};
