'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    static associate(models) {
      Warehouse.hasMany(models.Batch, {
        foreignKey: 'warehouse_id',
        as: 'batches',
      });
      Warehouse.hasMany(models.ProductSerial, {
        foreignKey: 'current_warehouse_id',
        as: 'products',
      });
    }
  }

  Warehouse.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: DataTypes.STRING(20),
      email: DataTypes.STRING(100),
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      image_url: {
        type: DataTypes.STRING(255), // Chứa URL hoặc đường dẫn đến ảnh
        allowNull: true, // Không bắt buộc
      },
    },
    {
      sequelize,
      modelName: 'Warehouse',
      tableName: 'Warehouses',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Warehouse;
};
