'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    static associate(models) {
      Batch.belongsTo(models.Warehouse, {
        foreignKey: 'warehouse_id',
        as: 'warehouse',
      });
      Batch.belongsTo(models.Manufacturer, {
        foreignKey: 'manufacturer_id',
        as: 'manufacturer',
      });
      Batch.hasMany(models.BatchItem, {
        foreignKey: 'batch_id',
        as: 'items',
      });
      Batch.hasMany(models.ProductSerial, {
        foreignKey: 'batch_id',
        as: 'serials',
      });
    }
  }

  Batch.init(
    {
      batch_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      batch_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      manufacturer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      total_products: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      received_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'received', 'processed', 'completed'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Batch',
      tableName: 'Batches',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Batch;
};
