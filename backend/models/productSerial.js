'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductSerial extends Model {
    static associate(models) {
      ProductSerial.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
      ProductSerial.belongsTo(models.Batch, {
        foreignKey: 'batch_id',
        as: 'batch',
      });
    }
  }

  ProductSerial.init(
    {
      serial_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serial_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sold_date: DataTypes.DATE,
      warranty_start_date: DataTypes.DATE,
      warranty_end_date: DataTypes.DATE,
      current_warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'available',
          'reserved',
          'sold',
          'defective',
          'in_transit'
        ),
        defaultValue: 'available',
      },
    },
    {
      sequelize,
      modelName: 'ProductSerial',
      tableName: 'ProductSerials',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at', // Thêm trường updated_at
    }
  );

  return ProductSerial;
};
