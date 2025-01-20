// models/discountCategory.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DiscountCategory extends Model {
    static associate(models) {
      DiscountCategory.belongsTo(models.Discount, {
        foreignKey: 'discount_id',
        as: 'discount',
      });
      DiscountCategory.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });
    }
  }

  DiscountCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Discounts',
          key: 'discount_id',
        },
      },
      category_id: {
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
      modelName: 'DiscountCategory',
      tableName: 'DiscountCategories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return DiscountCategory;
};
