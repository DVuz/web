// models/discountProduct.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DiscountProduct extends Model {
    static associate(models) {
      DiscountProduct.belongsTo(models.Discount, {
        foreignKey: 'discount_id',
        as: 'discount',
      });
      DiscountProduct.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  DiscountProduct.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'DiscountProduct',
      tableName: 'DiscountProducts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return DiscountProduct;
};
