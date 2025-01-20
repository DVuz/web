'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductPriceHistory extends Model {
    static associate(models) {
      ProductPriceHistory.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  ProductPriceHistory.init(
    {
      history_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      old_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      new_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      change_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      change_reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING(255),
        allowNull: true, // Lưu thông tin người thay đổi
      },
    },
    {
      sequelize,
      modelName: 'ProductPriceHistory',
      tableName: 'ProductPriceHistories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ProductPriceHistory;
};
