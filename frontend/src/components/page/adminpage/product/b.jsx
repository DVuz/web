// multerConfig.js (Update)
const uploadTypes = {
  // ... existing types ...
  warehouse: {
    path: 'uploads/warehouses',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'warehouse',
  },
};

// Update getUploadType function
const getUploadType = (path) => {
  if (path.includes('subcategory')) return 'subcategory';
  if (path.includes('product-type')) return 'product-type';
  if (path.includes('warehouse')) return 'warehouse';
  return 'category';
};

// models/warehouse.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Warehouse extends Model {}

Warehouse.init(
  {
    warehouse_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Warehouse',
    tableName: 'warehouses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Warehouse;

// services/warehouseService.js
const { Warehouse } = require('../models');
const fs = require('fs').promises;
const path = require('path');

exports.createWarehouse = async (warehouseData) => {
  try {
    const warehouse = await Warehouse.create(warehouseData);
    return {
      success: true,
      warehouse,
      message: 'Warehouse created successfully',
    };
  } catch (error) {
    if (warehouseData.image_url) {
      try {
        await fs.unlink(
          path.join(__dirname, '..', 'public', warehouseData.image_url)
        );
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    return {
      success: false,
      message: error.message,
    };
  }
};

exports.getAllWarehouses = async () => {
  try {
    const warehouses = await Warehouse.findAll({
      attributes: [
        'warehouse_id',
        'name',
        'address',
        'phone',
        'email',
        'image_url',
        'is_active',
        'created_at',
        'updated_at',
      ],
    });
    return {
      success: true,
      warehouses,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

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

// routes/warehouseRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const warehouseController = require('../controllers/warehouseController');

router.post(
  '/warehouse',
  upload.single('image'),
  warehouseController.createWarehouse
);
router.get('/get_all_warehouses', warehouseController.getAllWarehouses);

module.exports = router;
