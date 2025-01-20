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
        'id',
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
