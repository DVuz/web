'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    static associate(models) {
      Subcategory.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });
      Subcategory.hasMany(models.ProductType, {
        foreignKey: 'subcategory_id',
        as: 'productTypes',
      });
    }
  }

  Subcategory.init(
    {
      subcategory_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'category_id',
        },
      },
      subcategory_name_en: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      subcategory_name_vn: {
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
      image_url: DataTypes.STRING(255),
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
      modelName: 'Subcategory',
      tableName: 'Subcategories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Subcategory;
};
