'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      Discount.hasMany(models.DiscountUsage, {
        foreignKey: 'discount_id',
        as: 'usages',
      });
      Discount.hasMany(models.DiscountProduct, {
        foreignKey: 'discount_id',
        as: 'products',
      });
      Discount.hasMany(models.DiscountCategory, {
        foreignKey: 'discount_id',
        as: 'categories',
      });
    }
  }

  Discount.init(
    {
      discount_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      discount_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      discount_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
      },
      discount_value: {
        type: DataTypes.BIGINT, // Chuyển sang BIGINT
        allowNull: false,
      },
      min_order_amount: {
        type: DataTypes.BIGINT, // Chuyển sang BIGINT
        allowNull: true,
      },
      max_discount_value: {
        type: DataTypes.BIGINT, // Chuyển sang BIGINT
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      usage_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      target_type: {
        type: DataTypes.ENUM('public', 'private', 'specific_users'),
        defaultValue: 'public',
      },
      user_restriction: {
        type: DataTypes.ENUM('all', 'new', 'vip'),
        defaultValue: 'all',
      },
      max_uses_per_user: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Discount',
      tableName: 'Discounts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Discount;
};
