// models/product.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.ProductType, {
        foreignKey: 'product_type_id',
        as: 'productType',
      });
      Product.hasMany(models.DiscountProduct, {
        foreignKey: 'product_id',
        as: 'discounts',
      });
      // Thêm quan hệ với DirectDiscount
      Product.hasOne(models.DirectDiscount, {
        foreignKey: 'product_id',
        as: 'directDiscount',
      });
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      product_name_en: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      product_name_vn: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      main_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sub_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      length: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      material: DataTypes.STRING(100),
      material_vn: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: DataTypes.TEXT,
      description_vn: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      quantity_purchased: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      quantity_viewed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      origin: DataTypes.STRING(100),
      origin_vn: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      color: DataTypes.STRING(50),
      color_vn: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      product_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ProductTypes',
          key: 'product_type_id',
        },
      },
      detail_description: DataTypes.JSON,
      public_date: DataTypes.DATE,
      visibility_status: {
        type: DataTypes.ENUM('visible', 'hidden'),
        defaultValue: 'visible',
      },
      warranty_period: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 12,
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Product;
};
