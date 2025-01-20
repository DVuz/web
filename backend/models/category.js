'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Subcategory, {
        foreignKey: 'category_id',
        as: 'subcategories',
      });
      Category.hasMany(models.DiscountCategory, {
        foreignKey: 'category_id',
        as: 'discounts',
      });
    }
  }

  Category.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_name_en: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Đảm bảo không trùng lặp
      },
      category_name_vn: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description_vn: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Category;
};
