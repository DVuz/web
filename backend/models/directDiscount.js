// models/directDiscount.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DirectDiscount extends Model {
    static associate(models) {
      DirectDiscount.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  DirectDiscount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
      },
      discount_value: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Giá trị giảm (% hoặc số tiền cố định)',
      },
      original_price: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Giá gốc trước khi giảm',
      },
      discounted_price: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Giá sau khi giảm',
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'expired'),
        defaultValue: 'active',
      },
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Độ ưu tiên khi có nhiều chương trình giảm giá',
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'DirectDiscount',
      tableName: 'DirectDiscounts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return DirectDiscount;
};
