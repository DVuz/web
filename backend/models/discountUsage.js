// models/discountUsage.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DiscountUsage extends Model {
    static associate(models) {
      DiscountUsage.belongsTo(models.Discount, {
        foreignKey: 'discount_id',
        as: 'discount',
      });
      DiscountUsage.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  DiscountUsage.init(
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      used_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'DiscountUsage',
      tableName: 'DiscountUsages',
      timestamps: true,
      createdAt: 'used_at',
      updatedAt: false,
    }
  );

  return DiscountUsage;
};
