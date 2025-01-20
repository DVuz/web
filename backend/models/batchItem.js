'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BatchItem extends Model {
    static associate(models) {
      BatchItem.belongsTo(models.Batch, {
        foreignKey: 'batch_id',
        as: 'batch',
      });
      BatchItem.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  BatchItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'BatchItem',
      tableName: 'BatchItems',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return BatchItem;
};
