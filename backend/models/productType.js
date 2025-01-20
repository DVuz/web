'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductType extends Model {
    static associate(models) {
      ProductType.belongsTo(models.Subcategory, {
        foreignKey: 'subcategory_id',
        as: 'subcategory',
      });
      ProductType.hasMany(models.Product, {
        foreignKey: 'product_type_id',
        as: 'products',
      });
    }
  }

  ProductType.init(
    {
      product_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Subcategories',
          key: 'subcategory_id',
        },
      },
      productType_name_en: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      productType_name_vn: {
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
      modelName: 'ProductType',
      tableName: 'ProductTypes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ProductType;
};
